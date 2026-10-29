# GLOSSARY — agency-website

Naming conventions and vocabulary shared across UI components, variables, and animations. Keep this file in sync with the codebase; rename in code first, then update here.

## Components

| Name | File | Responsibility |
|------|------|----------------|
| `App` | `src/App.tsx` | Root page wrapper; renders the hero section |
| `HeroSection` | `src/sections/Hero/HeroSection.tsx` | Container structural component: ambient glows, mobile detection, composition of sub-components |
| `HeroTypography` | `src/sections/Hero/HeroTypography.tsx` | Staggered Framer Motion foreground layout: nav, brand chip, headline, subheadline, CTAs, scroll hint |
| `HeroCanvas` | `src/sections/Hero/HeroCanvas.tsx` | Isolated React Three Fiber 3D particle sphere; disabled below mobile breakpoint |
| `GlassMetrics` | `src/components/GlassMetrics.tsx` | Frosted-glass customer metric cards from `src/data/customers.ts` |
| `GlassCard` | `src/components/GlassMetrics.tsx` | Single metric card (named export from GlassMetrics) |
| `CustomerAcquisition` | `src/components/CustomerAcquisition.tsx` | XSS-sanitized, validated conversion form |
| `main` | `src/main.tsx` | React DOM entry point; renders `App` in StrictMode |

## Variables & Hooks

| Name | Location | Meaning |
|------|----------|---------|
| `isMobile` | `HeroSection.tsx` (`useIsMobile`) | Boolean from `window.matchMedia('(max-width: 640px)')`; gates 3D canvas mount |
| `handleInquiry` | `HeroSection.tsx` | Placeholder form submit handler (`void data`; real endpoint TBD) |
| `mouseTarget` / `mouseCurrent` | `HeroCanvas.tsx` | `useRef` Tracked/lerped pointer position for particle ripple |
| `PARTICLE_COUNT` | `HeroCanvas.tsx` | `6000` — sphere node count, held steady for 60fps |

## Animation & Motion

| Name | Value | Used in |
|------|-------|---------|
| `float` | `8s ease-in-out infinite` | Ambient glow blobs (staggered by delay) |
| `float-delayed` | Tailwind extension | Secondary glow layer |
| `blob` | Tailwind keyframes | Organic shape motion |
| Entrance stagger | `0.2s → 1.0s` delays | `HeroTypography` motion elements |
| CTA hover | `hover:-translate-y-0.5` + shadow grow | Primary/secondary CTAs |

## Colors (dark mode)

| Token | Value | Usage |
|-------|-------|-------|
| Background | `bg-zinc-950` / `text-zinc-50` | Root hero section |
| Accent gradient | `from-amber-500 via-orange-500 to-yellow-400` | Primary CTA button |
| Keyword gradient | `from-amber-200 via-orange-400 to-yellow-200` `bg-clip-text text-transparent` | "intelligence" in headline |
| Glow blobs | `bg-amber-950/20`, `bg-orange-950/20`, `bg-yellow-950/10` | Ambient background, `-z-10` layer |
| Brand chip | `bg-white/[0.03] border border-white/[0.08] backdrop-blur-md` | Inline-flex pill |
| Glass card | `bg-white/[0.03] border border-white/[0.08] backdrop-blur-md shadow-[0_20px_40px_-10px_rgba(0,0,0,0.5)]` | Metric cards + form |

## Data

| Name | Source | Notes |
|------|--------|-------|
| `CUSTOMER_RECORDS` | `src/data/customers.ts` | 6 readonly customer records (Nebula Studio, Vertex Labs, ...) |
| `AGENCY_METRICS` | `src/data/customers.ts` | Declared, not imported (placeholder: 412 projects, 99.99% uptime, 3.1x ROI, 8 years) |
| `sanitizeText/DisplayName/Email` | `src/lib/sanitize.ts` | Client-side XSS sanitizer; runs on every form keystroke |
| `validateForm` / `FormState` / `EMPTY_FORM` | `src/lib/validation.ts` | Pure form validation (required name/email, max lengths) |

## File Layout (target)

```
src/
├── assets/          # Global styles (styles.css) + static vectors
├── components/      # Reusable UI primitives (GlassMetrics, CustomerAcquisition)
├── sections/        # Main page sections (Hero/HeroSection, HeroTypography, HeroCanvas)
│   ├── Hero/
│   │   ├── HeroSection.tsx   # container
│   │   ├── HeroTypography.tsx # staggered motion layout
│   │   └── HeroCanvas.tsx    # R3F 3D particle sphere
├── App.tsx          # page wrapper
├── main.tsx         # entry point
.data/
.lib/                # sanitize.ts, validation.ts
```

## Rules

- Component names are `PascalCase`; files match component name exactly (`HeroSection.tsx` → `HeroSection`).
- Sections live under `src/sections/`; reusable primitives under `src/components/`.
- Global styles under `src/assets/`.
- No API keys, secrets, or network calls in client components (`handleInquiry` is a stub).
- All form input is sanitized via `src/lib/sanitize` before state and before echo-back.
