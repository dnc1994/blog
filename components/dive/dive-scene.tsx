'use client'

import { useEffect, useRef } from 'react'
import type { DiveMap } from '@/lib/dive-map'
import type * as T from 'three'

export type Hover = { index: number; x: number; y: number; pinned: boolean } | null

type Props = {
  map: DiveMap
  onHover: (h: Hover) => void
  onOpen: (slug: string) => void
  onDepth: (depth: number) => void
  onReady: () => void
  onFail: () => void
}

function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}

function glowTexture(THREE: typeof import('three')) {
  const size = 128
  const canvas = document.createElement('canvas')
  canvas.width = canvas.height = size
  const ctx = canvas.getContext('2d')!
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.18, 'rgba(255,255,255,0.95)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.35)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, size, size)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

export default function DiveScene({ map, onHover, onOpen, onDepth, onReady, onFail }: Props) {
  const mount = useRef<HTMLDivElement>(null)
  const cb = useRef({ onHover, onOpen, onDepth })
  cb.current = { onHover, onOpen, onDepth }

  useEffect(() => {
    if (!hasWebGL()) {
      onFail()
      return
    }
    let disposed = false
    let cleanup = () => {}

    ;(async () => {
      const THREE = await import('three')
      const { OrbitControls } = await import('three/examples/jsm/controls/OrbitControls.js')
      if (disposed || !mount.current) return

      const el = mount.current
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const touch = window.matchMedia('(hover: none)').matches

      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setSize(el.clientWidth, el.clientHeight)
      renderer.setClearColor(0x050707, 1)
      el.appendChild(renderer.domElement)
      renderer.domElement.style.display = 'block'
      renderer.domElement.style.touchAction = 'none'

      const scene = new THREE.Scene()
      scene.fog = new THREE.FogExp2(0x050707, 0.016)

      const camera = new THREE.PerspectiveCamera(55, el.clientWidth / el.clientHeight, 0.1, 400)
      // Fit the whole cloud on screen whatever the aspect ratio
      const maxR = Math.max(...map.nodes.map((n) => Math.hypot(n.x, n.y, n.z)))
      const fitDistance = () => {
        const halfV = Math.tan((camera.fov * Math.PI) / 360)
        // portrait screens rotate the full width of the cloud through a narrow view
        const radius = maxR * (camera.aspect < 1 ? 1.1 : 0.8)
        return Math.min(80, Math.max(14, radius / (halfV * Math.min(camera.aspect, 1)) + 4))
      }
      let endZ = fitDistance()
      const startZ = 110
      camera.position.set(0, 4, reduced ? endZ : startZ)

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.06
      controls.enablePan = false
      controls.minDistance = 8
      controls.maxDistance = 120
      controls.autoRotate = !reduced
      controls.autoRotateSpeed = 0.35
      controls.rotateSpeed = 0.6

      const tex = glowTexture(THREE)
      const groupColor = new Map(map.groups.map((g) => [g.id, new THREE.Color(g.color)]))

      // Nodes
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
        const base = n.size * 1.6
        s.scale.setScalar(base)
        s.userData = { base, target: base, opacity: 1 }
        scene.add(s)
        return s
      })

      // Edges
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
      const edgeMat = new THREE.LineBasicMaterial({ color: 0x3aa99f, transparent: true, opacity: 0.22, depthWrite: false })
      scene.add(new THREE.LineSegments(edgeGeo, edgeMat))

      const hiGeo = new THREE.BufferGeometry()
      const hiMat = new THREE.LineBasicMaterial({ color: 0x5ed3c6, transparent: true, opacity: 0.9, depthWrite: false })
      const hiLines = new THREE.LineSegments(hiGeo, hiMat)
      scene.add(hiLines)

      // Signals travelling along edges
      const pulses = Array.from({ length: Math.min(16, map.edges.length) }, (_, i) => {
        const mat = new THREE.SpriteMaterial({ map: tex, color: 0xda702c, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })
        const s = new THREE.Sprite(mat)
        s.scale.setScalar(0.5)
        s.userData = { edge: (i * 7) % map.edges.length, t: Math.random(), speed: 0.15 + Math.random() * 0.25 }
        scene.add(s)
        return s
      })

      // Background dust
      const dustCount = 1400
      const dustPos = new Float32Array(dustCount * 3)
      for (let i = 0; i < dustCount; i++) {
        const r = 25 + Math.random() * 90
        const th = Math.random() * Math.PI * 2
        const ph = Math.acos(2 * Math.random() - 1)
        dustPos[i * 3] = r * Math.sin(ph) * Math.cos(th)
        dustPos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th)
        dustPos[i * 3 + 2] = r * Math.cos(ph)
      }
      const dustGeo = new THREE.BufferGeometry()
      dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3))
      const dust = new THREE.Points(
        dustGeo,
        new THREE.PointsMaterial({ color: 0x3aa99f, size: 1.6, sizeAttenuation: false, transparent: true, opacity: 0.45, depthWrite: false })
      )
      scene.add(dust)

      // Interaction
      const raycaster = new THREE.Raycaster()
      const pointer = new THREE.Vector2(9, 9)
      let hovered = -1
      let pinned = -1
      let downAt = { x: 0, y: 0 }

      const setFocus = (i: number) => {
        hovered = i
        sprites.forEach((s, j) => {
          const near = i === -1 || j === i || neighbours[i].has(j)
          s.userData.target = s.userData.base * (j === i ? 2.1 : 1)
          s.userData.opacity = near ? 1 : 0.18
        })
        if (i === -1) {
          hiGeo.setAttribute('position', new THREE.Float32BufferAttribute([], 3))
        } else {
          const pos: number[] = []
          const A = map.nodes[i]
          for (const j of neighbours[i]) {
            const B = map.nodes[j]
            pos.push(A.x, A.y, A.z, B.x, B.y, B.z)
          }
          hiGeo.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3))
        }
        renderer.domElement.style.cursor = i === -1 ? 'grab' : 'pointer'
      }

      const pick = (clientX: number, clientY: number) => {
        const rect = renderer.domElement.getBoundingClientRect()
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1
        raycaster.setFromCamera(pointer, camera)
        const hit = raycaster.intersectObjects(sprites, false)[0]
        return hit ? sprites.indexOf(hit.object as T.Sprite) : -1
      }

      const onMove = (e: PointerEvent) => {
        if (touch || pinned !== -1) return
        const i = pick(e.clientX, e.clientY)
        if (i !== hovered) setFocus(i)
      }
      const onDown = (e: PointerEvent) => {
        downAt = { x: e.clientX, y: e.clientY }
      }
      const onUp = (e: PointerEvent) => {
        // ignore drags
        if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return
        const i = pick(e.clientX, e.clientY)
        if (i === -1) {
          pinned = -1
          setFocus(-1)
          return
        }
        if (touch && pinned !== i) {
          // first tap selects, second tap opens
          pinned = i
          setFocus(i)
          return
        }
        cb.current.onOpen(map.nodes[i].slug)
      }
      renderer.domElement.addEventListener('pointermove', onMove)
      renderer.domElement.addEventListener('pointerdown', onDown)
      renderer.domElement.addEventListener('pointerup', onUp)

      const onResize = () => {
        camera.aspect = el.clientWidth / el.clientHeight
        camera.updateProjectionMatrix()
        endZ = fitDistance()
        renderer.setSize(el.clientWidth, el.clientHeight)
      }
      window.addEventListener('resize', onResize)

      // Loop
      const clock = new THREE.Clock()
      let start = -1 // set on the first rendered frame, so slow shader compiles don't eat the fly-in
      let flying = !reduced
      const v = new THREE.Vector3()
      let raf = 0
      let lastDepth = -1
      const frame = () => {
        raf = requestAnimationFrame(frame)
        const dt = Math.min(clock.getDelta(), 0.05)
        if (start < 0) start = performance.now()
        const t = (performance.now() - start) / 1000

        // fly-in: ease camera distance from far to endZ during the first 2.6s
        if (flying) {
          const k = Math.min(1, t / 2.6)
          camera.position.setLength(startZ + (endZ - startZ) * (1 - Math.pow(1 - k, 3)))
          if (k === 1) flying = false
        }
        controls.autoRotate = !reduced && pinned === -1 && hovered === -1
        controls.update()

        sprites.forEach((s) => {
          const u = s.userData
          const cur = s.scale.x
          s.scale.setScalar(cur + (u.target - cur) * Math.min(1, dt * 10))
          const m = s.material as T.SpriteMaterial
          m.opacity += (u.opacity - m.opacity) * Math.min(1, dt * 8)
        })
        edgeMat.opacity += ((hovered === -1 ? 0.22 : 0.06) - edgeMat.opacity) * Math.min(1, dt * 8)

        if (!reduced) {
          pulses.forEach((p) => {
            const u = p.userData
            u.t += dt * u.speed
            if (u.t > 1) {
              u.t = 0
              u.edge = Math.floor(Math.random() * map.edges.length)
            }
            const [a, b] = map.edges[u.edge]
            const A = map.nodes[a], B = map.nodes[b]
            p.position.set(A.x + (B.x - A.x) * u.t, A.y + (B.y - A.y) * u.t, A.z + (B.z - A.z) * u.t)
          })
          dust.rotation.y += dt * 0.01
        }

        // report label position for the focused node
        const focus = pinned !== -1 ? pinned : hovered
        if (focus !== -1) {
          v.copy(sprites[focus].position).project(camera)
          const rect = el.getBoundingClientRect()
          cb.current.onHover({
            index: focus,
            x: ((v.x + 1) / 2) * rect.width,
            y: ((1 - v.y) / 2) * rect.height,
            pinned: pinned !== -1,
          })
        } else {
          cb.current.onHover(null)
        }

        const depth = Math.round(camera.position.length() * 40)
        if (depth !== lastDepth) {
          lastDepth = depth
          cb.current.onDepth(depth)
        }

        renderer.render(scene, camera)
      }
      frame()
      onReady()

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
        tex.dispose()
        renderer.dispose()
        renderer.domElement.remove()
      }
    })().catch(() => onFail())

    return () => {
      disposed = true
      cleanup()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map])

  return <div ref={mount} className='absolute inset-0' />
}
