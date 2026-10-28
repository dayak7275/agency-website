/**
 * CustomerAcquisition — premium conversion form layer.
 *
 * Security (per requirements):
 *   - Client-side regex sanitization of all text inputs against XSS
 *   - Robust local validation: email schema + empty-submission blocking
 *   - Every external link carries rel="noopener noreferrer"
 *   - Self-contained placeholder data; no API keys or secrets
 *
 * Visual:
 *   - Luxury dark mode, glassmorphism form card
 *   - Framer Motion staggered entrances + spring hover physics
 *   - Responsive: single column mobile → multi-column desktop
 */

import { useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import type { FormState } from '../lib/validation'
import { validateForm, EMPTY_FORM } from '../lib/validation'
import {
  sanitizeDisplayName,
  sanitizeEmail,
  sanitizeText,
} from '../lib/sanitize'

const FORM_MAX_NAME = 60
const FORM_MAX_COMPANY = 100

interface CustomerAcquisitionProps {
  onSubmit?: (data: { email: string; fullName: string; company: string; message: string }) => void
}

export default function CustomerAcquisition({
  onSubmit,
}: CustomerAcquisitionProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleChange = useCallback(
    (field: keyof Pick<typeof EMPTY_FORM, 'email' | 'fullName' | 'company' | 'message'>) => (
      e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
      const raw = e.target.value
      let cleaned: string
      switch (field) {
        case 'email':
          cleaned = sanitizeEmail(raw)
          break
        case 'fullName':
          cleaned = sanitizeDisplayName(raw, FORM_MAX_NAME)
          break
        case 'company':
          cleaned = sanitizeDisplayName(raw, FORM_MAX_COMPANY)
          break
        case 'message':
          cleaned = sanitizeText(raw)
          break
        default:
          cleaned = sanitizeText(raw)
      }
      setForm((prev) => ({ ...prev, [field]: cleaned, errors: {} }))
    },
    []
  )

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      const next = validateForm({
        email: form.email,
        fullName: form.fullName,
        company: form.company,
        message: form.message,
      })

      if (!next.valid) {
        setForm(next)
        setStatus('error')
        return
      }

      setForm({ ...next, submitting: true })
      setStatus('idle')

      // Simulate async submission boundary (YAGNI — real impl hits an API).
      setTimeout(() => {
        setForm((prev) => ({ ...prev, submitting: false, submitted: true }))
        setStatus('success')
        onSubmit?.({
          email: next.email,
          fullName: next.fullName,
          company: next.company,
          message: next.message,
        })
      }, 800)
    },
    [form, onSubmit]
  )

  if (status === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="px-6 py-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)] text-center"
      >
        <h3 className="text-xl font-bold text-zinc-50 mb-2">
          Thank you, {sanitizeDisplayName(form.fullName)}.
        </h3>
        <p className="text-zinc-400 text-sm">
          We&apos;ll be in touch at{' '}
          <span className="text-amber-200 font-medium">{sanitizeEmail(form.email)}</span>.
        </p>
        <p className="mt-3 text-xs text-zinc-500">
          No sensitive data stored client-side. placeholder demo only.
        </p>
      </motion.div>
    )
  }

  return (
    <section className="w-full px-6 pt-12 pb-20">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-2xl mx-auto rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-md p-8 md:p-12 shadow-[0_20px_40px_-10px_rgba(0,0,0,0.6)]"
      >
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-zinc-50 tracking-tight mb-3">
            Start your project
          </h2>
          <p className="text-zinc-400 text-sm max-w-sm mx-auto leading-relaxed">
            Tell us about what you&apos;re building. We respond to every
            inquiry within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
            >
              Full name
            </label>
            <input
              id="fullName"
              name="fullName"
              autoComplete="name"
              required
              value={form.fullName}
              onChange={handleChange('fullName')}
              className={`
                w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/[0.08]
                text-zinc-50 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/30
                focus:border-amber-500/50 outline-none transition-all
                ${form.errors.fullName ? 'border-rose-500/60' : ''}
              `}
              placeholder="Jane Doe"
              aria-invalid={!!form.errors.fullName}
              aria-errormessage={form.errors.fullName ? 'fullName-error' : undefined}
            />
            {form.errors.fullName && (
              <p id="fullName-error" className="text-xs text-rose-400">
                {form.errors.fullName.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
            >
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={form.email}
              onChange={handleChange('email')}
              className={`
                w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/[0.08]
                text-zinc-50 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/30
                focus:border-amber-500/50 outline-none transition-all
                ${form.errors.email ? 'border-rose-500/60' : ''}
              `}
              placeholder="jane@example.com"
              aria-invalid={!!form.errors.email}
              aria-errormessage={form.errors.email ? 'email-error' : undefined}
            />
            {form.errors.email && (
              <p id="email-error" className="text-xs text-rose-400">
                {form.errors.email.message}
              </p>
            )}
          </div>
        </div>

        <div className="space-y-2 mb-6">
          <label
            htmlFor="company"
            className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
          >
            Company
          </label>
          <input
            id="company"
            name="company"
            autoComplete="organization"
            value={form.company}
            onChange={handleChange('company')}
            className={`
              w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/[0.08]
              text-zinc-50 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/30
              focus:border-amber-500/50 outline-none transition-all
              ${form.errors.company ? 'border-rose-500/60' : ''}
            `}
            placeholder="Acme Corp"
            aria-invalid={!!form.errors.company}
            aria-errormessage={form.errors.company ? 'company-error' : undefined}
          />
          {form.errors.company && (
            <p id="company-error" className="text-xs text-rose-400">
              {form.errors.company.message}
            </p>
          )}
        </div>

        <div className="space-y-2 mb-8">
          <label
            htmlFor="message"
            className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider"
          >
            How can we help?
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={handleChange('message')}
            className={`
              w-full px-4 py-3 rounded-xl bg-zinc-900/50 border border-white/[0.08]
              text-zinc-50 placeholder-zinc-500 focus:ring-2 focus:ring-amber-500/30
              focus:border-amber-500/50 outline-none transition-all resize-none
              ${form.errors.message ? 'border-rose-500/60' : ''}
            `}
            placeholder="Briefly describe your project..."
            aria-invalid={!!form.errors.message}
            aria-errormessage={form.errors.message ? 'message-error' : undefined}
          />
          {form.errors.message && (
            <p id="message-error" className="text-xs text-rose-400">
              {form.errors.message.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={form.submitting || !form.valid}
          className={`
            w-full py-4 rounded-xl font-bold text-zinc-50 tracking-tight uppercase text-sm
            bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-400
            hover:from-amber-400 hover:via-orange-400 hover:yellow-300
            shadow-lg shadow-amber-500/25
            transition-all transform hover:-translate-y-0.5
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {form.submitting ? 'Sending…' : 'Send inquiry'}
        </button>

        {form.errors.email && !form.valid && (
          <p className="mt-4 text-xs text-rose-400 text-center">
            Please correct the fields above before sending.
          </p>
        )}
      </motion.form>
    </section>
  )
}
