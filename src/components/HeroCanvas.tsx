/**
 * HeroCanvas — premium interactive 3D particle canvas.
 *
 * Built with @react-three/fiber + @react-three/drei.
 *
 * Design intent (per UI/UX Pro Max skill):
 *   - Thousands of tiny glowing geometric nodes on a sphere surface.
 *   - Mouse-pointer vector mapped with a smooth lerp factor so particles
 *     ripple fluidly toward/away from the cursor.
 *   - Strict framerate budget: the render loop lives inside requestAnimationFrame
 *     via useFrame; nothing runs off-loop.
 *   - Battery preservation: canvas unmounts below the mobile breakpoint
 *     (static CSS background takes over).
 *
 * Security: Zero external data, zero API keys, zero network. Fully
 * self-contained procedural geometry.
 */

import { useRef, useState, useMemo, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

type Object3DRef = React.RefObject<THREE.Object3D>

/** Total particle nodes — modest to hold 60fps on mid-tier devices. */
const PARTICLE_COUNT = 6000

/** Lerp factor for the mouse vector — lower = smoother/slower follow. */
const MOUSE_LERP = 0.08

/** Displacement amplitude for the ripple wave. */
const WAVE_AMPLITUDE = 0.35

interface HeroCanvasProps {
  /** When true, the canvas is forced off (mobile media queries). */
  disabled?: boolean
}

/** Build the sphere geometry once; YAGNI — no runtime regeneration. */
function buildParticleGeometry() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const originals = new Float32Array(PARTICLE_COUNT * 3)

  // Fibonacci sphere distribution — even coverage, no clustering at poles.
  const phi = Math.PI * (3 - Math.sqrt(5)) // golden angle
  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2 // -1 to +1
    const radius = Math.sqrt(1 - y * y)
    const theta = phi * i
    positions[i * 3] = Math.cos(theta) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(theta) * radius
    originals[i * 3] = positions[i * 3]
    originals[i * 3 + 1] = positions[i * 3 + 1]
    originals[i * 3 + 2] = positions[i * 3 + 2]
  }

  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geo.setAttribute(
    'originalPosition',
    new THREE.BufferAttribute(originals, 3)
  )
  return geo
}

/** Glowing node material — additive blend for luminosity. */
function buildParticleMaterial() {
  return new THREE.PointsMaterial({
    size: 0.045,
    color: new THREE.Color('#3b82f6'),
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
}

export default function HeroCanvas({ disabled = false }: HeroCanvasProps) {
  const [mouseTarget, setMouseTarget] = useState(new THREE.Vector2(0, 0))
  const [mouseCurrent] = useState(() => new THREE.Vector2(0, 0))
  const pointsRef: Object3DRef = useRef<THREE.Object3D>(null)

  const geometry = useMemo(buildParticleGeometry, [])
  const material = useMemo(buildParticleMaterial, [])

  // Compose once; both geometry + material are stable references.
  const points = useMemo(() => new THREE.Points(geometry, material), [])

  const handlePointerMove = useCallback(
    (event: MouseEvent) => {
      setMouseTarget(
        new THREE.Vector2(
          (event.clientX / window.innerWidth) * 2 - 1,
          -(event.clientY / window.innerHeight) * 2 + 1
        )
      )
    },
    []
  )

  // Isolated render loop: every frame inside requestAnimationFrame via useFrame.
  useFrame((state) => {
    if (disabled) return

    // Lerp current mouse toward target — smooth, damped follow.
    mouseCurrent.lerp(mouseTarget, MOUSE_LERP)

    const { position, originalPosition } = geometry.attributes
    const posArr = position.array as Float32Array
    const origArr = originalPosition.array as Float32Array
    const time = state.clock.getElapsedTime()

    const mx = mouseCurrent.x
    const my = mouseCurrent.y

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = origArr[i * 3]
      const oy = origArr[i * 3 + 1]

      const breath = Math.sin(time * 0.6 + i * 0.001) * 0.06

      const dx = mx - ox
      const dy = my - oy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const pull = Math.max(0, 1 - dist / 2.2) * WAVE_AMPLITUDE

      posArr[i * 3] = ox + dx * pull * 0.15 + Math.cos(time + oy) * breath
      posArr[i * 3 + 1] = oy + dy * pull * 0.15 + Math.sin(time + ox) * breath
      posArr[i * 3 + 2] = Math.sin(time * 0.8 + i * 0.002) * pull
    }

    position.needsUpdate = true

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05
      pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
    }
  })

  if (disabled) {
    return null
  }

  return (
    <group ref={pointsRef} onPointerMove={handlePointerMove}>
      <primitive object={points} />
    </group>
  )
}
