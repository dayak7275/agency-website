import { motion } from 'framer-motion'

interface HeroContentProps {
  navigate: (href: string) => void
}

/**
 * Foreground content for the premium Hero layout.
 * Tailwind-styled, Framer Motion staggered entrances.
 */
export default function HeroContent({ navigate }: HeroContentProps) {
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'Studio', href: '#studio' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full px-6 pt-20 pb-32 max-w-5xl mx-auto text-slate-100">

      {/* Navigation */}
      <motion.nav
        className="absolute top-8 left-8 flex gap-8 z-20"
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {navItems.map((item) => (
          <a
            key={item.label}
            href={item.href}
            onClick={() => navigate(item.href)}
            className="text-sm text-slate-400 hover:text-white transition-colors track-wide uppercase focus-underline"
          >
            {item.label}
          </a>
        ))}
      </motion.nav>

      {/* Brand chip */}
      <motion.div
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm shadow-lg shadow-black/30"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <span
          className="w-2 h-2 rounded-full bg-brand-500 animate-pulse shadow-[0_0_10px_#3b82f6]"
        ></span>
        <span className="text-xs font-medium text-slate-300 tracking-widest uppercase">
          Creative Agency
        </span>
      </motion.div>

      {/* Headline */}
      <motion.h1
        className="mt-10 md:mt-14 text-5xl md:text-8xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white via-brand-400 to-purple-300 leading-tight tracking-tighter text-center px-4"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8, ease: 'easeOut' }}
      >
        Design intelligence<br />
        <span className="text-brand-400">in motion.</span>
      </motion.h1>

      {/* Subheadline */}
      <motion.p
        className="mt-8 md:mt-10 text-lg md:text-xl text-slate-400 max-w-[640px] text-center leading-relaxed px-6"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        Bespoke digital experiences shaped with canvas, motion, and purpose.
        From concept to production — without the bloat.
      </motion.p>

      {/* CTAs */}
      <motion.div
        className="mt-12 md:mt-16 flex flex-wrap justify-center gap-5 px-4"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0, duration: 0.6 }}
      >
        <a
          href="#start"
          onClick={() => navigate('#start')}
          className="px-9 py-4 bg-brand-500 hover:bg-brand-400 text-white font-bold rounded-2xl shadow-2xl shadow-brand-500/35 transition-all transform hover:-translate-y-1 hover:shadow-brand-500/50 track-wide uppercase text-sm"
        >
          Start a project
        </a>
        <a
          href="#work"
          onClick={() => navigate('#work')}
          className="px-9 py-4 bg-transparent border border-white/20 hover:border-white/40 text-white font-bold rounded-2xl transition-all transform hover:-translate-y-1 track-wide uppercase text-sm"
        >
          View work
        </a>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
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
      >
        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em]">
          scroll down
        </span>
        <div className="w-[1px] h-4 rounded-full bg-white/25"></div>
      </motion.div>
    </div>
  )
}
