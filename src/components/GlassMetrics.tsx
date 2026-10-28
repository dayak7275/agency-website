/**
 * GlassMetrics — frosted-glass customer metric cards.
 *
 * Visual design (per requirements):
 *   - backdrop-blur-md, bg-white/[0.03], border-white/[0.08]
 *   - Smooth box-shadows, high-contrast gradient keyword emphasis
 *   - Luxury dark mode: zinc-950 base, zinc-50 text
 */

import { motion } from 'framer-motion'
import { CUSTOMER_RECORDS } from '../data/customers'

interface GlassCardProps {
  record: (typeof CUSTOMER_RECORDS)[number]
  delay: number
}

export function GlassCard({ record, delay }: GlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: 'easeOut' }}
      whileHover={{ y: -4 }}
      className="relative p-6 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300"
    >
      <div
        className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${record.logoColor}`}
      >
        <span className="text-white font-bold text-sm tracking-tight">
          {record.company.charAt(0)}
        </span>
      </div>
      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">
        {record.metric}
      </p>
      <p className="text-2xl font-bold text-zinc-50 tracking-tight">
        {record.value}
      </p>
    </motion.div>
  )
}

export default function GlassMetrics() {
  return (
    <section className="w-full px-6">
      <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {CUSTOMER_RECORDS.map((record, i) => (
          <GlassCard key={record.id} record={record} delay={i * 0.1} />
        ))}
      </div>
    </section>
  )
}
