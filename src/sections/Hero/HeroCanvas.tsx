
import { useRef, useMemo, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const PARTICLE_COUNT = 6000
const MOUSE_LERP = 0.08
const WAVE_AMPLITUDE = 0.35

interface HeroCanvasProps {
  disabled?: boolean
}

function buildParticleGeometry() {
  const positions = new Float32Array(PARTICLE_COUNT * 3)
  const originals = new Float32Array(PARTICLE_COUNT * 3)
  const goldenAngle = Math.PI * (3 - Math.sqrt(5))

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const y = 1 - (i / (PARTICLE_COUNT - 1)) * 2
    const radius = Math.sqrt(1 - y * y)
    const theta = goldenAngle * i

    positions[i * 3] = Math.cos(theta) * radius
    positions[i * 3 + 1] = y
    positions[i * 3 + 2] = Math.sin(theta) * radius

    originals[i * 3] = positions[i * 3]
    originals[i * 3 + 1] = positions[i * 3 + 1]
    originals[i * 3 + 2] = positions[i * 3 + 2]
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.BufferAttribute(positions, 3)
  )
  geometry.setAttribute(
    'originalPosition',
    new THREE.BufferAttribute(originals, 3)
  )

  return geometry
}

function buildParticleMaterial() {
  return new THREE.PointsMaterial({
    size: 0.045,
    color: '#3b82f6',
    transparent: true,
    opacity: 0.8,
    sizeAttenuation: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
  })
}

export default function HeroCanvas({
  disabled = false,
}: HeroCanvasProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const mouseTarget = useRef(new THREE.Vector2())
  const mouseCurrent = useRef(new THREE.Vector2())

  const geometry = useMemo(buildParticleGeometry, [])
  const material = useMemo(buildParticleMaterial, [])

  const handlePointerMove = useCallback(
    (event: { pointer: THREE.Vector2 }) => {
      mouseTarget.current.copy(event.pointer)
    },
    []
  )

  useFrame((state) => {
    if (disabled) return

    mouseCurrent.current.lerp(mouseTarget.current, MOUSE_LERP)

    const position = geometry.attributes.position
    const original = geometry.attributes.originalPosition
    const positions = position.array as Float32Array
    const originals = original.array as Float32Array
    const time = state.clock.getElapsedTime()

    const mx = mouseCurrent.current.x
    const my = mouseCurrent.current.y

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const ox = originals[i * 3]
      const oy = originals[i * 3 + 1]
      const oz = originals[i * 3 + 2]

      const breath = Math.sin(time * 0.6 + i * 0.001) * 0.06
      const dx = mx - ox
      const dy = my - oy
      const distance = Math.sqrt(dx * dx + dy * dy)
      const pull =
        Math.max(0, 1 - distance / 2.2) * WAVE_AMPLITUDE

      positions[i * 3] =
        ox + dx * pull * 0.15 + Math.cos(time + oy) * breath

      positions[i * 3 + 1] =
        oy + dy * pull * 0.15 + Math.sin(time + ox) * breath

      positions[i * 3 + 2] =
        oz + Math.sin(time * 0.8 + i * 0.002) * pull
    }

    position.needsUpdate = true

    if (pointsRef.current) {
      pointsRef.current.rotation.y = time * 0.05
      pointsRef.current.rotation.x = Math.sin(time * 0.3) * 0.1
    }
  })

  if (disabled) return null

  return (
    <Canvas className="absolute inset-0 -z-10 w-full h-full">
      <points
        ref={pointsRef}
        geometry={geometry}
        material={material}
        onPointerMove={handlePointerMove}
      />
    </Canvas>
  )
}
