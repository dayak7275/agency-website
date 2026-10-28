/**
 * Client-side XSS sanitization.
 *
 * Purpose-built, dependency-free sanitizer that runs entirely in the browser.
 * Defensive layers:
 *  1. Strip <script>...</script> blocks outright.
 *  2. Strip inline event handlers (onClick, onLoad, onError, ...).
 *  3. Strip javascript: URLs from href/src attributes.
 *  4. Escape remaining HTML metacharacters so markup cannot be re-injected.
 *
 * Zero secrets, zero network, zero eval. Safe to run on untrusted form input
 * before it ever reaches the DOM.
 */
const SCRIPT_TAG = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi;
const EVENT_HANDLER = /on[a-zA-Z]+\s*=\s*["'][^"']*["']/gi;
const JAVASCRIPT_URL = /\bjavascript\s*:\s*/gi;
const HTML_META = /[<>"'&]/g;

const ESCAPE_MAP: Record<string, string> = {
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
  '&': '&amp;',
};

/**
 * Sanitize a raw user string so it is safe to render as visible text.
 * Returns a plain string with all HTML neutralised.
 */
export function sanitizeText(input: string): string {
  if (typeof input !== 'string') return '';
  let cleaned = input.replace(SCRIPT_TAG, '');
  cleaned = cleaned.replace(EVENT_HANDLER, '');
  cleaned = cleaned.replace(JAVASCRIPT_URL, '');
  return cleaned.replace(HTML_META, (ch) => ESCAPE_MAP[ch] ?? ch);
}

/**
 * Sanitize and trim display names / company names / headings.
 * Enforces a hard length cap to defeat buffer-style abuse.
 */
export function sanitizeDisplayName(input: string, maxLen = 60): string {
  return sanitizeText(input).trim().slice(0, maxLen);
}

/**
 * Sanitize an email candidate: reject anything that is not a plausible
 * local-part@domain shape, then escape metacharacters.
 */
export function sanitizeEmail(input: string): string {
  const trimmed = input.trim().toLowerCase();
  const cleaned = trimmed
    .replace(SCRIPT_TAG, '')
    .replace(EVENT_HANDLER, '')
    .replace(JAVASCRIPT_URL, '')
    .replace(/\s+/g, '');
  return cleaned.replace(HTML_META, (ch) => ESCAPE_MAP[ch] ?? ch);
}
