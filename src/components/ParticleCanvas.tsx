import { useRef, useEffect, useState, useCallback } from 'react'
import * as THREE from 'three'

interface ParticleCanvasProps {
  particleCount?: number
  connectionDistance?: number
  colorPrimary?: string
  colorSecondary?: string
}

/**
 * Interactive 3D particle canvas.
 *
 * - ~2000 floating points with gentle drift
 * - Connect-the-dots edges between close particles
 * - Mouse-attraction field (particles drift toward the cursor)
 * - Responsive resize + clean dispose on unmount
 */
export default function ParticleCanvas({
  particleCount = 2000,
  connectionDistance = 2.6,
  colorPrimary = '#3b82f6',
  colorSecondary = '#8b5cf6',
}: ParticleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [mouse, setMouse] = useState({ x: 0, y: 0 })

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      setMouse({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      })
    },
    []
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      55,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    )
    camera.position.set(0, 0, 5.5)

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
    })
    renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // ---- particles ----
    const positions = new Float32Array(particleCount * 3)
    const originals = new Float32Array(particleCount * 3)
    const offsets = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 14
      positions[i + 1] = (Math.random() - 0.5) * 14
      positions[i + 2] = (Math.random() - 0.5) * 5
      originals[i] = positions[i]
      originals[i + 1] = positions[i + 1]
      originals[i + 2] = positions[i + 2]
      offsets[i] = Math.random() * Math.PI * 2
      offsets[i + 1] = Math.random() * Math.PI * 2
      offsets[i + 2] = Math.random() * Math.PI * 2
    }
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    const mat = new THREE.PointsMaterial({
      size: 0.055,
      color: new THREE.Color(colorPrimary),
      transparent: true,
      opacity: 0.55,
      sizeAttenuation: true,
    })
    const points = new THREE.Points(geo, mat)
    scene.add(points)

    // ---- connect-the-dots edges ----
    const edgeMat = new THREE.LineBasicMaterial({
      color: new THREE.Color(colorSecondary),
      transparent: true,
      opacity: 0.1,
    })
    const edges = new THREE.LineSegments(new THREE.BufferGeometry(), edgeMat)
    scene.add(edges)

    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(canvas.clientWidth, canvas.clientHeight)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('mousemove', handleMouseMove)

    let frame: number
    const animate = () => {
      frame = requestAnimationFrame(animate)
      const time = performance.now() * 0.001

      const pos = geo.attributes.position as THREE.BufferAttribute
      const arr = pos.array as Float32Array

      // gentle float + mouse attraction
      const mx = mouse.x * 6
      const my = mouse.y * 6
      for (let i = 0; i < particleCount * 3; i += 3) {
        arr[i] =
          originals[i] +
          Math.sin(time * 0.6 + offsets[i]) * 0.5 +
          (mx - arr[i]) * 0.02
        arr[i + 1] =
          originals[i + 1] +
          Math.cos(time * 0.5 + offsets[i + 1]) * 0.4 +
          (my - arr[i + 1]) * 0.02
        arr[i + 2] =
          originals[i + 2] + Math.sin(time * 0.4 + offsets[i + 2]) * 0.3
      }
      pos.needsUpdate = true

      // rebuild edges each frame for proximity connects
      const linePos: number[] = []
      for (let i = 0; i < particleCount; i++) {
        const x1 = arr[i * 3]
        const y1 = arr[i * 3 + 1]
        const z1 = arr[i * 3 + 2]
        for (let j = i + 1; j < particleCount; j++) {
          const dx = x1 - arr[j * 3]
          const dy = y1 - arr[j * 3 + 1]
          const dz = z1 - arr[j * 3 + 2]
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (d < connectionDistance) {
            linePos.push(x1, y1, z1, arr[j * 3], arr[j * 3 + 1], arr[j * 3 + 2])
          }
        }
      }
      const lineGeo = new THREE.BufferGeometry()
      lineGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(linePos), 3))
      edges.geometry.dispose()
      ;(edges as any).geometry = lineGeo

      points.rotation.y = time * 0.05
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', handleMouseMove)
      points.geometry.dispose()
      points.material.dispose()
      edges.geometry.dispose()
      edges.material.dispose()
      renderer.dispose()
      scene.dispose()
    }
  }, [particleCount, connectionDistance, colorPrimary, colorSecondary, handleMouseMove])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full -z-10 opacity-90 mix-blend-screen"
    />
  )
}
