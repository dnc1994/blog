// Streams of falling hex glyphs, drawn as one instanced mesh. Each column is
// a strip of glyph quads facing the central axis; a bright "head" runs down
// the strip leaving a fading trail, and characters flicker over time. All
// animation happens in the shader, so the CPU cost is one uniform per frame.

import type * as T from 'three'

type Three = typeof import('three')

export type RainColumn = { x: number; y: number; z: number }

export function glyphAtlas(THREE: Three) {
  const cell = 64
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = cell * 4
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `600 ${cell * 0.78}px "JetBrains Mono", ui-monospace, monospace`
  const chars = '0123456789ABCDEF'
  for (let i = 0; i < 16; i++) {
    ctx.fillText(chars[i], (i % 4) * cell + cell / 2, Math.floor(i / 4) * cell + cell / 2 + 2)
  }
  const tex = new THREE.CanvasTexture(canvas)
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.anisotropy = 4
  return tex
}

const vertex = /* glsl */ `
  attribute vec3 aBase;
  attribute vec4 aParams; // speed, phase, seed, trail length
  attribute float aRow;
  uniform float uSize;
  varying vec2 vUv;
  varying float vRow;
  varying vec4 vParams;
  varying float vFog;
  void main() {
    vUv = uv;
    vRow = aRow;
    vParams = aParams;
    vec3 inward = normalize(vec3(-aBase.x, 0.0, -aBase.z) + 1e-5);
    vec3 right = normalize(cross(vec3(0.0, 1.0, 0.0), inward));
    vec3 p = aBase
      + right * position.x * uSize
      + vec3(0.0, 1.0, 0.0) * (position.y * uSize - aRow * uSize * 1.05);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    vFog = -mv.z;
    gl_Position = projectionMatrix * mv;
  }
`

const fragment = /* glsl */ `
  uniform sampler2D uAtlas;
  uniform float uTime;
  uniform float uRows;
  uniform float uOpacity;
  uniform vec3 uColor;
  uniform vec3 uHead;
  uniform float uFogDensity;
  uniform float uBoost;
  varying vec2 vUv;
  varying float vRow;
  varying vec4 vParams;
  varying float vFog;

  float hash(float n) { return fract(sin(n) * 43758.5453123); }

  void main() {
    float speed = vParams.x;
    float trail = vParams.w;
    float head = mod(uTime * speed + vParams.y * (uRows + trail), uRows + trail);
    float d = head - vRow;
    if (d < 0.0 || d > trail) discard;
    float b = 1.0 - d / trail;

    float tick = floor(uTime * (2.0 + hash(vParams.z) * 6.0) + vRow * 0.37);
    float ch = floor(hash(vParams.z * 17.0 + vRow * 31.7 + tick) * 16.0);
    vec2 cell = vec2(mod(ch, 4.0), 3.0 - floor(ch / 4.0));
    // distant glyphs mip-blur into faint boxes; thousands of those stack into
    // grey haze, so cut the soft tail and keep only crisp strokes
    float a = smoothstep(0.28, 0.62, texture2D(uAtlas, (cell + vUv) / 4.0).a);

    float isHead = step(d, 1.0);
    vec3 col = mix(uColor, uHead, isHead) * (0.25 + 0.75 * b * b) * (1.0 + uBoost);
    float fog = exp(-pow(uFogDensity * vFog, 2.0));
    float alpha = a * b * uOpacity * fog;
    if (alpha < 0.01) discard;
    gl_FragColor = vec4(col * alpha, alpha);
  }
`

export function createGlyphRain(
  THREE: Three,
  atlas: T.Texture,
  columns: RainColumn[],
  opts: { rows: number; size: number; color: string; head?: string; opacity?: number; fog?: number; speed?: [number, number] }
) {
  const quad = new THREE.PlaneGeometry(1, 1)
  const geo = new THREE.InstancedBufferGeometry()
  geo.index = quad.index
  geo.setAttribute('position', quad.getAttribute('position'))
  geo.setAttribute('uv', quad.getAttribute('uv'))

  const count = columns.length * opts.rows
  const base = new Float32Array(count * 3)
  const params = new Float32Array(count * 4)
  const row = new Float32Array(count)
  const [smin, smax] = opts.speed ?? [6, 16]
  let k = 0
  columns.forEach((c, ci) => {
    const seed = ci * 1.618 + 0.5
    const speed = smin + ((Math.sin(seed * 91.7) * 0.5 + 0.5) * (smax - smin))
    const phase = Math.sin(seed * 12.3) * 0.5 + 0.5
    const trail = 6 + Math.floor((Math.sin(seed * 5.1) * 0.5 + 0.5) * (opts.rows * 0.6))
    for (let r = 0; r < opts.rows; r++, k++) {
      base.set([c.x, c.y, c.z], k * 3)
      params.set([speed, phase, seed, trail], k * 4)
      row[k] = r
    }
  })
  geo.setAttribute('aBase', new THREE.InstancedBufferAttribute(base, 3))
  geo.setAttribute('aParams', new THREE.InstancedBufferAttribute(params, 4))
  geo.setAttribute('aRow', new THREE.InstancedBufferAttribute(row, 1))
  geo.instanceCount = count

  const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    side: THREE.DoubleSide,
    uniforms: {
      uAtlas: { value: atlas },
      uTime: { value: 0 },
      uRows: { value: opts.rows },
      uSize: { value: opts.size },
      uOpacity: { value: opts.opacity ?? 1 },
      uColor: { value: new THREE.Color(opts.color) },
      uHead: { value: new THREE.Color(opts.head ?? '#E8FFF9') },
      uFogDensity: { value: opts.fog ?? 0.012 },
      uBoost: { value: 0 },
    },
  })

  const mesh = new THREE.Mesh(geo, material)
  mesh.frustumCulled = false
  return { mesh, material }
}

/** Columns evenly spread on a cylinder wall, spanning yTop downwards in stacked bands. */
export function cylinderColumns(radius: number, count: number, yTop: number, bands = 1, bandHeight = 0) {
  const out: RainColumn[] = []
  for (let b = 0; b < bands; b++) {
    for (let i = 0; i < count; i++) {
      const a = (i / count) * Math.PI * 2 + b * 0.37
      out.push({ x: Math.cos(a) * radius, y: yTop - b * bandHeight, z: Math.sin(a) * radius })
    }
  }
  return out
}

/** Columns scattered in a ring between rMin and rMax (deterministic). */
export function ringColumns(rMin: number, rMax: number, count: number, yTop: number) {
  const out: RainColumn[] = []
  for (let i = 0; i < count; i++) {
    const a = i * 2.39996 // golden angle
    const r = rMin + (rMax - rMin) * ((Math.sin(i * 7.77) * 0.5 + 0.5) ** 0.7)
    out.push({ x: Math.cos(a) * r, y: yTop, z: Math.sin(a) * r })
  }
  return out
}
