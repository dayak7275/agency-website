/**
 * HeroSection — premium luxury agency hero section (container).
 *
 * Composes:
 *   - HeroCanvas (@react-three/fiber particle sphere, mobile-off below 640px)
 *   - HeroTypography (staggered Framer Motion foreground layout)
 *   - GlassMetrics (frosted-glass customer metric cards)
 *   - CustomerAcquisition (XSS-sanitized, validated conversion form)
 *
 * Design system (per UI/UX Pro Max + visual spec):
 *   - High-end dark mode: bg-zinc-950, text-zinc-50
 *   - Editorial oversized sans-serif typography
 *   - Keyword emphasis: from-amber-200 via-orange-400 to-yellow-200 + tracking-tight
 *   - Framer Motion staggered entrances + spring hover physics
 *   - Responsive grid: 1 col mobile → 3 col desktop
 */

import { useState, useEffect } from 'react'
import HeroCanvas from './HeroCanvas'
import HeroTypography from './HeroTypography'
import GlassMetrics from '../../components/GlassMetrics'
import CustomerAcquisition from '../../components/CustomerAcquisition'

/** Detect mobile viewport so the 3D canvas can swap to static CSS. */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | null>(null)
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${640}px)`)
    setIsMobile(mq.matches)
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return isMobile ?? false
}

export default function HeroSection() {
  const isMobile = useIsMobile()

  const handleInquiry = (data: {
    email: string
    fullName: string
    company: string
    message: string
  }) => {
    // Placeholder hook — wired to a real endpoint in production.
    // No API keys or secrets stored client-side.
    void data
  }

  return (
    <section className="relative min-h-screen bg-zinc-950 text-zinc-50 overflow-x-hidden selection:bg-amber-500/30 selection:text-zinc-950">
      {/* Ambient background glow (falls back to canvas on desktop) */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <div
          className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] bg-amber-950/20 rounded-full blur-[140px] opacity-50"
          style={{ animation: 'float 8s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] bg-orange-950/20 rounded-full blur-[140px] opacity-50"
          style={{ animation: 'float 8s ease-in-out infinite', animationDelay: '3000ms' }}
        />
        <div
          className="absolute top-[20%] left-[20%] w-[40vw] h-[40vw] bg-yellow-950/10 rounded-full blur-[120px] opacity-40"
          style={{ animation: 'float 10s ease-in-out infinite', animationDelay: '1500ms' }}
        />
      </div>

      {/* 3D interactive particle canvas — off on mobile */}
      {!isMobile && <HeroCanvas disabled={false} />}

      {/* Foreground typography layout */}
      <HeroTypography />

      {/* Customer Acquisition layer — glass metrics + form */}
      <main className="relative z-10">
        <GlassMetrics />
        <CustomerAcquisition onSubmit={handleInquiry} />
      </main>
    </section>
  )
}
