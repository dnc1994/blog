'use client'

import { useEffect, useRef } from 'react'
import type * as T from 'three'
import type { DiveMap } from '@/lib/dive-map'
import type { DiveAudio } from './dive-audio'
import { createGlyphRain, cylinderColumns, glyphAtlas, ringColumns } from './glyph-rain'
import { CRTShader } from './crt-pass'

export type Hover = { index: number; x: number; y: number; pinned: boolean } | null
export type Phase = 'loading' | 'ready' | 'boot' | 'descent' | 'explore' | 'diving'
export type AudioRef = { current: DiveAudio | null }
export type DiveApi = { jackIn: (audio: AudioRef) => void }

type Props = {
  map: DiveMap
  onHover: (h: Hover) => void
  onOpen: (slug: string) => void
  onDepth: (depth: number) => void
  onPhase: (p: Phase) => void
  onReady: (api: DiveApi) => void
  onFail: () => void
}

// Choreography (seconds)
const BOOT = 1.7
const DESCENT = 5.2
const ARRIVE = 2.4
// Geometry
const SHAFT_TOP = 330
const SHAFT_END = 44
const SHAFT_R = 7
const FLOOR_Y = -20
const CEIL_Y = 28

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
const clamp01 = (x: number) => Math.min(1, Math.max(0, x))

function glowTexture(THREE: typeof import('three')) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.16, 'rgba(255,255,255,0.9)')
  g.addColorStop(0.34, 'rgba(255,255,255,0.28)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

function titleTexture(THREE: typeof import('three'), text: string, color: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 1024
  canvas.height = 96
  const ctx = canvas.getContext('2d')!
  ctx.font = '500 52px "Space Grotesk", "Inter", system-ui, sans-serif'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = color
  let label = text
  while (ctx.measureText(label).width > 980 && label.length > 4) label = label.slice(0, -2)
  if (label !== text) label = label.trimEnd() + '…'
  ctx.fillText(label, 20, 50)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return { tex, aspect: Math.min(1, (ctx.measureText(label).width + 40) / 1024) }
}

export default function DiveScene({ map, onHover, onOpen, onDepth, onPhase, onReady, onFail }: Props) {
  const mount = useRef<HTMLDivElement>(null)
  const cb = useRef({ onHover, onOpen, onDepth, onPhase })
  cb.current = { onHover, onOpen, onDepth, onPhase }

  useEffect(() => {
    if (!hasWebGL()) {
      onFail()
      return
    }
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const [{ OrbitControls }, { EffectComposer }, { RenderPass }, { UnrealBloomPass }, { ShaderPass }, { OutputPass }] =
        await Promise.all([
          import('three/examples/jsm/controls/OrbitControls.js'),
          import('three/examples/jsm/postprocessing/EffectComposer.js'),
          import('three/examples/jsm/postprocessing/RenderPass.js'),
          import('three/examples/jsm/postprocessing/UnrealBloomPass.js'),
          import('three/examples/jsm/postprocessing/ShaderPass.js'),
          import('three/examples/jsm/postprocessing/OutputPass.js'),
        ])
      // make sure the canvas glyph atlas uses the real fonts
      await document.fonts?.ready
      if (disposed || !mount.current) return

      const el = mount.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const touch = window.matchMedia('(hover: none)').matches
      const small = el.clientWidth < 700

      // ---------- renderer & post ----------
      const renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: 'high-performance' })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, small ? 1.5 : 2))
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setClearColor(0x030505, 1)
      el.appendChild(renderer.domElement)
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.touchAction = 'none'

      const scene = new THREE.Scene()
      const fog = new THREE.FogExp2(0x030505, 0.006)
      scene.fog = fog

      const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 900)
      camera.up.set(0, 0, -1)
      camera.position.set(0, SHAFT_TOP + 20, 0)
      camera.lookAt(0, 0, 0)

      const composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      const bloom = new UnrealBloomPass(
        new THREE.Vector2(el.clientWidth / (small ? 2 : 1), el.clientHeight / (small ? 2 : 1)),
        small ? 0.7 : 0.9,
        0.5,
        0.28
      )
      composer.addPass(bloom)
      const crt = new ShaderPass(CRTShader)
      composer.addPass(crt)
      composer.addPass(new OutputPass())
      const U = crt.uniforms as Record<string, { value: number }>
      U.uBlack.value = 0.35

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enabled = false
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.enablePan = false
      controls.minDistance = 8
      controls.maxDistance = 120
      controls.rotateSpeed = 0.6
      controls.autoRotateSpeed = 0.35

      const maxR = Math.max(...map.nodes.map((n) => Math.hypot(n.x, n.y, n.z)))
      const fitDistance = () => {
        const halfV = Math.tan((55 * Math.PI) / 360)
        const radius = maxR * (camera.aspect < 1 ? 1.1 : 0.8)
        return Math.min(80, Math.max(14, radius / (halfV * Math.min(camera.aspect, 1)) + 4))
      }
      let endZ = fitDistance()

      const tex = glowTexture(THREE)
      const atlas = glyphAtlas(THREE)
      const groupColor = new Map(map.groups.map((g) => [g.id, new THREE.Color(g.color)]))
      const disposables: { dispose: () => void }[] = [tex, atlas]

      // ---------- the archive constellation ----------
      const sprites = map.nodes.map((n) => {
        const mat = new THREE.SpriteMaterial({
          map: tex,
          color: groupColor.get(n.group) ?? new THREE.Color('#3AA99F'),
          transparent: true,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
        const s = new THREE.Sprite(mat)
        s.position.set(n.x, n.y, n.z)
        const base = n.size * 1.7
        s.scale.setScalar(base)
        s.userData = { base, target: base, opacity: 1 }
        scene.add(s)
        return s
      })

      const neighbours = map.nodes.map(() => new Set<number>())
      const edgePos: number[] = []
      for (const [a, b] of map.edges) {
        neighbours[a].add(b)
        neighbours[b].add(a)
        const A = map.nodes[a], B = map.nodes[b]
        edgePos.push(A.x, A.y, A.z, B.x, B.y, B.z)
      }
      const edgeGeo = new THREE.BufferGeometry()
      edgeGeo.setAttribute('position', new THREE.Float32BufferAttribute(edgePos, 3))
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x3aa99f, transparent: true, opacity: 0.25, depthWrite: false, blending: THREE.AdditiveBlending })
      scene.add(new THREE.LineSegments(edgeGeo, edgeMat))

      const hiGeo = new THREE.BufferGeometry()
      const hiMat = new THREE.LineBasicMaterial({ color: 0x8ff5e8, transparent: true, opacity: 1, depthWrite: false, blending: THREE.AdditiveBlending })
      scene.add(new THREE.LineSegments(hiGeo, hiMat))

      const pulses = Array.from({ length: Math.min(small ? 10 : 18, map.edges.length) }, (_, i) => {
        const mat = new THREE.SpriteMaterial({ map: tex, color: 0xda702c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
        const s = new THREE.Sprite(mat)
        s.scale.setScalar(0.55)
        s.userData = { edge: (i * 7) % map.edges.length, t: Math.random(), speed: 0.15 + Math.random() * 0.25 }
        scene.add(s)
        return s
      })

      // ---------- the shaft you fall through ----------
      const shaft = new THREE.Group()
      scene.add(shaft)
      const shaftRows = 36
      const shaftSize = 0.95
      const bandH = shaftRows * shaftSize * 1.05
      const bands = Math.ceil((SHAFT_TOP - SHAFT_END + 40) / bandH)
      const shaftRain = createGlyphRain(
        THREE,
        atlas,
        cylinderColumns(SHAFT_R, small ? 26 : 42, SHAFT_TOP + 20, bands, bandH),
        { rows: shaftRows, size: shaftSize, color: '#2FB3A5', head: '#E9FFFB', fog: 0.0075, speed: [8, 22] }
      )
      shaft.add(shaftRain.mesh)
      disposables.push(shaftRain.material, shaftRain.mesh.geometry)

      const ringMat = new THREE.LineBasicMaterial({ color: 0x3aa99f, transparent: true, opacity: 0.4, depthWrite: false, blending: THREE.AdditiveBlending })
      for (let y = SHAFT_TOP; y > SHAFT_END - 10; y -= 13) {
        const pts: T.Vector3[] = []
        const sides = y % 39 === 0 ? 6 : 64 // every third ring is a hexagon
        for (let i = 0; i <= sides; i++) {
          const a = (i / sides) * Math.PI * 2
          pts.push(new THREE.Vector3(Math.cos(a) * (SHAFT_R + 0.7), y, Math.sin(a) * (SHAFT_R + 0.7)))
        }
        shaft.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts), ringMat))
      }

      // post titles flying past on the shaft walls
      const titleSprites = map.nodes.map((n, i) => {
        const color = '#' + (groupColor.get(n.group) ?? new THREE.Color('#3AA99F')).clone().lerp(new THREE.Color('#ffffff'), 0.35).getHexString()
        const { tex: t, aspect } = titleTexture(THREE, n.title, color)
        disposables.push(t)
        const mat = new THREE.SpriteMaterial({ map: t, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9 })
        const s = new THREE.Sprite(mat)
        const a = i * 2.39996
        const y = SHAFT_END + 30 + ((i * 0.61803) % 1) * (SHAFT_TOP - SHAFT_END - 50)
        s.position.set(Math.cos(a) * (SHAFT_R - 2.2), y, Math.sin(a) * (SHAFT_R - 2.2))
        // texture is 1024x96 with the title left-aligned; anchor the text's centre
        s.scale.set(9, 9 * (96 / 1024), 1)
        s.center.set(aspect / 2, 0.5)
        shaft.add(s)
        return s
      })

      // ---------- the arena you arrive in ----------
      const arena = new THREE.Group()
      scene.add(arena)
      const gridLines = (y: number, span: number, step: number, opacity: number) => {
        const pos: number[] = []
        for (let v = -span; v <= span; v += step) {
          pos.push(-span, y, v, span, y, v, v, y, -span, v, y, span)
        }
        const g = new THREE.BufferGeometry()
        g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        const m = new THREE.LineBasicMaterial({ color: 0x2a8f86, transparent: true, opacity, depthWrite: false })
        disposables.push(g, m)
        return new THREE.LineSegments(g, m)
      }
      arena.add(gridLines(FLOOR_Y, 240, 4, 0.32))
      arena.add(gridLines(CEIL_Y, 240, 8, 0.08))

      // data towers rising from the floor
      const towerCount = small ? 40 : 90
      const towerGeo = new THREE.BoxGeometry(0.16, 1, 0.16)
      towerGeo.translate(0, 0.5, 0)
      const towerMat = new THREE.MeshBasicMaterial({ color: 0x3aa99f, transparent: true, opacity: 0.2, depthWrite: false, blending: THREE.AdditiveBlending })
      const towers = new THREE.InstancedMesh(towerGeo, towerMat, towerCount)
      const tops: number[] = []
      const m4 = new THREE.Matrix4()
      for (let i = 0; i < towerCount; i++) {
        const a = i * 2.39996 + 0.3
        const r = 42 + ((Math.sin(i * 3.31) * 0.5 + 0.5) ** 0.8) * 110
        const h = 3 + ((Math.sin(i * 9.17) * 0.5 + 0.5) ** 2) * 28
        const x = Math.cos(a) * r, z = Math.sin(a) * r
        m4.makeScale(1 + (i % 3) * 0.6, h, 1 + (i % 3) * 0.6).setPosition(x, FLOOR_Y, z)
        towers.setMatrixAt(i, m4)
        tops.push(x, FLOOR_Y + h, z)
      }
      arena.add(towers)
      const topGeo = new THREE.BufferGeometry()
      topGeo.setAttribute('position', new THREE.Float32BufferAttribute(tops, 3))
      const topMat = new THREE.PointsMaterial({ color: 0x8ff5e8, size: 3, sizeAttenuation: false, transparent: true, opacity: 0.9, depthWrite: false, blending: THREE.AdditiveBlending })
      arena.add(new THREE.Points(topGeo, topMat))
      disposables.push(towerGeo, towerMat, topGeo, topMat)

      const arenaRain = createGlyphRain(
        THREE,
        atlas,
        ringColumns(30, 150, small ? 70 : 150, CEIL_Y),
        { rows: 34, size: 1.5, color: '#2AA79B', head: '#C9FFF8', opacity: 1, fog: 0.0065, speed: [3, 9] }
      )
      arena.add(arenaRain.mesh)
      disposables.push(arenaRain.material, arenaRain.mesh.geometry)

      // dust everywhere
      const dustCount = small ? 900 : 1800
      const dustPos = new Float32Array(dustCount * 3)
      for (let i = 0; i < dustCount; i++) {
        dustPos[i * 3] = (Math.random() - 0.5) * 260
        dustPos[i * 3 + 1] = FLOOR_Y + Math.random() * (SHAFT_TOP - FLOOR_Y)
        dustPos[i * 3 + 2] = (Math.random() - 0.5) * 260
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
      const dustMat = new THREE.PointsMaterial({ color: 0x3aa99f, size: 1.5, sizeAttenuation: false, transparent: true, opacity: 0.4, depthWrite: false })
      const dust = new THREE.Points(dustGeo, dustMat)
      scene.add(dust)

      // ---------- interaction ----------
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2(9, 9)
      let hovered = -1
      let pinned = -1
      let downAt = { x: 0, y: 0 }
      let audio: AudioRef = { current: null }

      let phase: Phase = 'ready'
      let phaseStart = 0
      const setPhase = (p: Phase) => {
        phase = p
        phaseStart = performance.now()
        cb.current.onPhase(p)
      }

      const setFocus = (i: number) => {
        if (i !== hovered && i !== -1) audio.current?.blip()
        hovered = i
        sprites.forEach((s, j) => {
          const near = i === -1 || j === i || neighbours[i].has(j)
          s.userData.target = s.userData.base * (j === i ? 2.2 : 1)
          s.userData.opacity = near ? 1 : 0.15
        })
        const pos: number[] = []
        if (i !== -1) {
          const A = map.nodes[i]
          for (const j of neighbours[i]) {
            const B = map.nodes[j]
            pos.push(A.x, A.y, A.z, B.x, B.y, B.z)
          }
        }
        hiGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        renderer.domElement.style.cursor = i === -1 ? 'grab' : 'pointer'
        if (i !== -1 && !reduced) U.uAberration.value = Math.max(U.uAberration.value, 0.006)
      }

      const pick = (clientX: number, clientY: number) => {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects(sprites, false)[0]
        return hit ? sprites.indexOf(hit.object as T.Sprite) : -1
      }

      // dive into a node: fly at it, warp the lens, flash, then open the post
      let diveTarget = -1
      const diveFrom = new THREE.Vector3()
      const startDive = (i: number) => {
        diveTarget = i
        diveFrom.copy(camera.position)
        controls.enabled = false
        audio.current?.plunge()
        setPhase('diving')
      }

      const onMove = (e: PointerEvent) => {
        if (phase !== 'explore' || touch || pinned !== -1) return
        const i = pick(e.clientX, e.clientY)
        if (i !== hovered) setFocus(i)
      }
      const onDown = (e: PointerEvent) => {
        downAt = { x: e.clientX, y: e.clientY }
      }
      const onUp = (e: PointerEvent) => {
        if (phase !== 'explore') return
        if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return
        const i = pick(e.clientX, e.clientY)
        if (i === -1) {
          pinned = -1
          setFocus(-1)
          return
        }
        if (touch && pinned !== i) {
          pinned = i
          setFocus(i)
          return
        }
        startDive(i)
      }
      renderer.domElement.addEventListener('pointermove', onMove)
      renderer.domElement.addEventListener('pointerdown', onDown)
      renderer.domElement.addEventListener('pointerup', onUp)

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(el.clientWidth, el.clientHeight)
        composer.setSize(el.clientWidth, el.clientHeight)
        endZ = fitDistance()
      }
      window.addEventListener('resize', onResize)

      // ---------- choreography ----------
      const enterExplore = () => {
        camera.up.set(0, 1, 0)
        camera.position.set(0, 6, endZ)
        camera.lookAt(0, 0, 0)
        controls.target.set(0, 0, 0)
        controls.enabled = true
        controls.update()
        shaft.visible = false
        setPhase('explore')
      }

      const api: DiveApi = {
        jackIn(a) {
          if (phase !== 'ready') return
          audio = a
          if (reduced) {
            audio.current?.drone()
            enterExplore()
            return
          }
          setPhase('boot')
        },
      }

      const v = new THREE.Vector3()
      const look = new THREE.Vector3()
      const arrivalCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(0, SHAFT_END, 0),
        new THREE.Vector3(0, SHAFT_END - 22, 0.01),
        new THREE.Vector3(0, 16, 20),
        new THREE.Vector3(0, 6, 26)
      )
      const upA = new THREE.Vector3(0, 0, -1)
      const upB = new THREE.Vector3(0, 1, 0)
      let raf = 0
      let lastDepth = -1
      let last = performance.now()
      const debugScale = Number(new URLSearchParams(window.location.search).get('timescale')) || 1
      const timeScale = (reduced ? 0.25 : 1) * debugScale
      let clockT = 0

      const frame = (now: number) => {
        raf = requestAnimationFrame(frame)
        const rawDt = (now - last) / 1000
        const dt = Math.min(rawDt, 0.05)
        last = now
        clockT += dt * timeScale
        const t = ((now - phaseStart) / 1000) * debugScale

        shaftRain.material.uniforms.uTime.value = clockT
        arenaRain.material.uniforms.uTime.value = clockT
        U.uTime.value = clockT

        // ease effects back to their resting values
        // frame-rate independent decay, so slow devices don't get a lingering flash
        U.uAberration.value += (0.0018 - U.uAberration.value) * (1 - Math.exp(-rawDt * 3 * debugScale))
        U.uFlash.value += (0 - U.uFlash.value) * (1 - Math.exp(-rawDt * 4 * debugScale))

        if (phase === 'ready') {
          // idle: hover at the mouth of the shaft, looking down
          camera.position.set(0, SHAFT_TOP + 20 + Math.sin(clockT * 0.6) * 1.5, 0)
          camera.lookAt(0, 0, 0)
        } else if (phase === 'boot') {
          const k = clamp01(t / BOOT)
          U.uBlack.value = 0.35 + 0.65 * Math.min(1, k * 3) * (1 - clamp01((k - 0.8) / 0.2))
          if (k >= 1) {
            U.uBlack.value = 0
            U.uFlash.value = 0.7
            U.uAberration.value = 0.03
            audio.current?.whoosh(DESCENT + 0.4)
            setPhase('descent')
          }
        } else if (phase === 'descent') {
          const k = clamp01(t / DESCENT)
          const e = easeInOut(k)
          const y = SHAFT_TOP + 20 + (SHAFT_END - SHAFT_TOP - 20) * e
          const speed = Math.sin(k * Math.PI) // 0 → 1 → 0
          const shake = speed * 0.14
          camera.position.set((Math.random() - 0.5) * shake, y, (Math.random() - 0.5) * shake)
          camera.up.copy(upA)
          camera.lookAt(0, 0, 0)
          camera.fov = 55 + 26 * speed
          camera.updateProjectionMatrix()
          shaftRain.material.uniforms.uBoost.value = speed * 0.8
          U.uAberration.value = Math.max(U.uAberration.value, 0.002 + speed * 0.008)
          fog.density = 0.004
          cb.current.onDepth(Math.round((SHAFT_TOP + 20 - y) * 11))
          if (k >= 1) {
            U.uFlash.value = 0.45
            U.uAberration.value = 0.02
            audio.current?.drone()
            arriving = true
            controls.enabled = false
            setPhase('explore')
          }
        } else if (phase === 'diving' && diveTarget !== -1) {
          const k = clamp01(t / 0.95)
          const target = sprites[diveTarget].position
          const e = easeInOut(k)
          v.copy(target).sub(diveFrom).multiplyScalar(e * 0.97).add(diveFrom)
          camera.position.copy(v)
          camera.lookAt(target)
          camera.fov = 55 + 50 * e
          camera.updateProjectionMatrix()
          U.uAberration.value = 0.002 + e * 0.04
          U.uFlash.value = Math.max(U.uFlash.value, clamp01((k - 0.7) / 0.3))
          if (k >= 1 && diveTarget !== -1) {
            const slug = map.nodes[diveTarget].slug
            diveTarget = -1
            cb.current.onOpen(slug)
          }
        }

        // arrival: swing from the bottom of the shaft out to the overview
        if (phase === 'explore' && arriving) {
          const k = clamp01(t / ARRIVE)
          const e = easeOut(k)
          arrivalCurve.v3.set(0, 6, endZ)
          arrivalCurve.v2.set(0, 16, endZ * 0.75)
          arrivalCurve.getPoint(e, v)
          camera.position.copy(v)
          camera.up.copy(upA).lerp(upB, e).normalize()
          look.set(0, 0, 0)
          camera.lookAt(look)
          camera.fov = 81 - 26 * e
          camera.updateProjectionMatrix()
          fog.density = 0.004 + (0.013 - 0.004) * e
          shaftRingFade(1 - e)
          cb.current.onDepth(Math.round((SHAFT_TOP - SHAFT_END + 20) * 11 + e * 400))
          if (k >= 1) {
            arriving = false
            enterExplore()
          }
        } else if (phase === 'explore') {
          controls.autoRotate = !reduced && pinned === -1 && hovered === -1
          controls.update()
          const depth = Math.round((SHAFT_TOP - SHAFT_END + 20) * 11 + 400 + camera.position.length() * 6)
          if (depth !== lastDepth) {
            lastDepth = depth
            cb.current.onDepth(depth)
          }
        }

        sprites.forEach((s) => {
          const u = s.userData
          const cur = s.scale.x
          s.scale.setScalar(cur + (u.target - cur) * Math.min(1, dt * 10))
          const m = s.material as T.SpriteMaterial
          m.opacity += (u.opacity - m.opacity) * Math.min(1, dt * 8)
        })
        edgeMat.opacity += ((hovered === -1 ? 0.25 : 0.06) - edgeMat.opacity) * Math.min(1, dt * 8)
        hiMat.opacity = 0.75 + Math.sin(clockT * 8) * 0.25

        pulses.forEach((p) => {
          const u = p.userData
          u.t += dt * u.speed * timeScale
          if (u.t > 1) {
            u.t = 0
            u.edge = Math.floor(Math.random() * map.edges.length)
          }
          const [a, b] = map.edges[u.edge]
          const A = map.nodes[a], B = map.nodes[b]
          p.position.set(A.x + (B.x - A.x) * u.t, A.y + (B.y - A.y) * u.t, A.z + (B.z - A.z) * u.t)
        })
        topMat.opacity = 0.6 + Math.sin(clockT * 2.3) * 0.3

        const focus = phase === 'explore' && !arriving ? (pinned !== -1 ? pinned : hovered) : -1
        if (focus !== -1) {
          v.copy(sprites[focus].position).project(camera)
          const rect = el.getBoundingClientRect()
          cb.current.onHover({ index: focus, x: ((v.x + 1) / 2) * rect.width, y: ((1 - v.y) / 2) * rect.height, pinned: pinned !== -1 })
        } else {
          cb.current.onHover(null)
        }

        composer.render(dt)
      }

      let arriving = false
      const shaftRingFade = (o: number) => {
        ringMat.opacity = 0.4 * o
        shaftRain.material.uniforms.uOpacity.value = o
        titleSprites.forEach((s) => ((s.material as T.SpriteMaterial).opacity = 0.9 * o))
      }

      raf = requestAnimationFrame(frame)
      setPhase('ready')
      onReady(api)

      cleanup = () => {
        cancelAnimationFrame(raf)
        window.removeEventListener('resize', onResize)
        renderer.domElement.removeEventListener('pointermove', onMove)
        renderer.domElement.removeEventListener('pointerdown', onDown)
        renderer.domElement.removeEventListener('pointerup', onUp)
        controls.dispose()
        scene.traverse((o) => {
          const obj = o as T.Mesh
          obj.geometry?.dispose?.()
          const mat = obj.material as T.Material | T.Material[] | undefined
          if (Array.isArray(mat)) mat.forEach((m) => m.dispose())
          else mat?.dispose?.()
        })
        disposables.forEach((d) => d.dispose())
        composer.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })().catch((err) => {
      console.error(err)
      onFail()
    })

    return () => {
      disposed = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return <div ref={mount} className='absolute inset-0' />
}
