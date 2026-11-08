// Final screen pass: barrel distortion, chromatic aberration, vignette,
// film grain and a full-screen flash, all driven by uniforms so the scene
// can spike them during jack-in, transitions and the dive into a node.

export const CRTShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uAberration: { value: 0.0015 },
    uDistortion: { value: 0.06 },
    uVignette: { value: 0.9 },
    uNoise: { value: 0.018 },
    uFlash: { value: 0 },
    uBlack: { value: 0 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform float uAberration;
    uniform float uDistortion;
    uniform float uVignette;
    uniform float uNoise;
    uniform float uFlash;
    uniform float uBlack;
    varying vec2 vUv;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 c = vUv - 0.5;
      float r2 = dot(c, c);
      vec2 uv = 0.5 + c * (1.0 + uDistortion * r2);
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
      vec2 off = c * uAberration * (1.0 + 4.0 * r2);
      vec3 col;
      col.r = texture2D(tDiffuse, uv + off).r;
      col.g = texture2D(tDiffuse, uv).g;
      col.b = texture2D(tDiffuse, uv - off).b;

      float vig = smoothstep(0.95, 0.25, length(c) * uVignette * 1.25);
      col *= mix(0.55, 1.0, vig);
      col += (hash(vUv * 900.0 + uTime) - 0.5) * uNoise;
      col += uFlash * vec3(0.55, 1.0, 0.92);
      col *= 1.0 - uBlack;
      gl_FragColor = vec4(col, 1.0);
    }
  `,
}
