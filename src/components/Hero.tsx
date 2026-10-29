/**
 * Hero — premium luxury agency hero section.
 *
 * Composes:
 *   - HeroCanvas (@react-three/fiber particle sphere, mobile-off below 768px)
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
import { motion } from 'framer-motion'
import HeroCanvas from '../sections/Hero/HeroCanvas'
import GlassMetrics from './GlassMetrics'
import CustomerAcquisition from './CustomerAcquisition'

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

export default function Hero() {
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

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 pt-20 pb-32 max-w-7xl mx-auto">
        {/* Navigation */}
        <motion.nav
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="absolute top-8 left-8 flex gap-8 z-20"
        >
          <a
            href="#work"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-50 transition-colors tracking-[0.1em] uppercase focus-underline"
          >
            Work
          </a>
          <a
            href="#studio"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-50 transition-colors tracking-[0.1em] uppercase focus-underline"
          >
            Studio
          </a>
          <a
            href="#contact"
            className="text-xs font-semibold text-zinc-400 hover:text-zinc-50 transition-colors tracking-[0.1em] uppercase focus-underline"
          >
            Contact
          </a>
        </motion.nav>

        {/* Brand chip */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse shadow-[0_0_8px_#f59e0b]"></span>
          <span className="text-[10px] font-bold text-zinc-400 tracking-[0.2em] uppercase">
            Creative Agency
          </span>
        </motion.div>

        {/* Editorial headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
          className="mt-10 md:mt-16 text-center px-4"
        >
          <span className="block text-5xl md:text-7xl lg:text-8xl font-extrabold text-zinc-50 leading-tight tracking-tighter">
            Design{' '}
            <span className="bg-gradient-to-r from-amber-200 via-orange-400 to-yellow-200 bg-clip-text text-transparent">
              intelligence
            </span>{' '}
            <span className="text-zinc-300">in motion.</span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mt-8 md:mt-10 text-lg md:text-xl text-zinc-400 max-w-[600px] text-center leading-relaxed px-6"
        >
          Bespoke digital experiences shaped with canvas, motion, and purpose.
          From concept to production&#8212;without the bloat.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0, duration: 0.6 }}
          className="mt-12 md:mt-16 flex flex-wrap justify-center gap-4 px-4"
        >
          <a
            href="#start"
            className="px-9 py-4 bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400 hover:from-amber-400 hover:via-orange-400 hover:to-yellow-300 text-zinc-950 font-bold rounded-2xl shadow-xl shadow-amber-500/30 transition-all transform hover:-translate-y-0.5 hover:shadow-amber-500/50 track-wide uppercase text-sm focus-underline"
          >
            Start a project
          </a>
          <a
            href="#work"
            className="px-9 py-4 bg-transparent border border-white/[0.12] hover:border-white/[0.35] text-zinc-300 font-bold rounded-2xl transition-all transform hover:-translate-y-0.5 track-wide uppercase text-sm focus-underline"
          >
            View work
          </a>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{
            opacity: [0, 1, 1, 0],
            y: [14, 0, 0, 14],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.3, 0.7, 1],
          }}
          className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-zinc-500 uppercase tracking-[0.2em]">
            scroll down
          </span>
          <div className="w-[1px] h-4 rounded-full bg-zinc-500/30"></div>
        </motion.div>
      </div>

      {/* Customer Acquisition layer — glass metrics + form */}
      <main className="relative z-10">
        <GlassMetrics />
        <CustomerAcquisition onSubmit={handleInquiry} />
      </main>
    </section>
  )
}
