// Tiny synthesized soundtrack for the dive: no audio files, everything is
// generated with WebAudio. Only created after the visitor chooses sound.

export type DiveAudio = {
  whoosh: (seconds: number) => void
  drone: () => void
  blip: () => void
  plunge: () => void
  setEnabled: (on: boolean) => void
  dispose: () => void
}

export function createDiveAudio(): DiveAudio | null {
  const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!Ctx) return null
  const ctx = new Ctx()
  const master = ctx.createGain()
  master.gain.value = 0.9
  master.connect(ctx.destination)

  const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
  const data = noiseBuffer.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

  let droneNodes: AudioNode[] = []

  const noise = () => {
    const src = ctx.createBufferSource()
    src.buffer = noiseBuffer
    src.loop = true
    return src
  }

  return {
    whoosh(seconds) {
      const t = ctx.currentTime
      const src = noise()
      const bp = ctx.createBiquadFilter()
      bp.type = 'bandpass'
      bp.Q.value = 1.4
      bp.frequency.setValueAtTime(180, t)
      bp.frequency.exponentialRampToValueAtTime(2600, t + seconds * 0.6)
      bp.frequency.exponentialRampToValueAtTime(300, t + seconds)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.22, t + seconds * 0.55)
      g.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
      src.connect(bp).connect(g).connect(master)
      src.start(t)
      src.stop(t + seconds + 0.1)
      // rising tone under the noise
      const o = ctx.createOscillator()
      o.type = 'sawtooth'
      o.frequency.setValueAtTime(40, t)
      o.frequency.exponentialRampToValueAtTime(320, t + seconds * 0.9)
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 500
      const og = ctx.createGain()
      og.gain.setValueAtTime(0.0001, t)
      og.gain.exponentialRampToValueAtTime(0.05, t + seconds * 0.7)
      og.gain.exponentialRampToValueAtTime(0.0001, t + seconds)
      o.connect(lp).connect(og).connect(master)
      o.start(t)
      o.stop(t + seconds + 0.1)
    },
    drone() {
      if (droneNodes.length) return
      const t = ctx.currentTime
      const lp = ctx.createBiquadFilter()
      lp.type = 'lowpass'
      lp.frequency.value = 240
      lp.Q.value = 4
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.07
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 90
      lfo.connect(lfoGain).connect(lp.frequency)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(0.06, t + 3)
      const oscs = [55, 55.35, 82.4].map((f, i) => {
        const o = ctx.createOscillator()
        o.type = i === 2 ? 'sine' : 'sawtooth'
        o.frequency.value = f
        o.connect(lp)
        o.start(t)
        return o
      })
      lp.connect(g).connect(master)
      lfo.start(t)
      droneNodes = [...oscs, lfo, lp, g]
    },
    blip() {
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      o.type = 'sine'
      o.frequency.setValueAtTime(1500, t)
      o.frequency.exponentialRampToValueAtTime(900, t + 0.08)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.035, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)
      o.connect(g).connect(master)
      o.start(t)
      o.stop(t + 0.12)
    },
    plunge() {
      const t = ctx.currentTime
      const o = ctx.createOscillator()
      o.type = 'triangle'
      o.frequency.setValueAtTime(700, t)
      o.frequency.exponentialRampToValueAtTime(50, t + 0.9)
      const g = ctx.createGain()
      g.gain.setValueAtTime(0.09, t)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 1)
      o.connect(g).connect(master)
      o.start(t)
      o.stop(t + 1.05)
      this.whoosh(0.9)
    },
    setEnabled(on) {
      master.gain.setTargetAtTime(on ? 0.9 : 0, ctx.currentTime, 0.15)
      if (on && ctx.state === 'suspended') void ctx.resume()
    },
    dispose() {
      if (ctx.state === 'closed') return
      droneNodes.forEach((n) => {
        try {
          ;(n as OscillatorNode).stop?.()
        } catch {}
        n.disconnect()
      })
      void ctx.close()
    },
  }
}
