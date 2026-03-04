# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build (SSG — all pages pre-rendered)
npm run start     # Serve the production build
npm run lint      # Next.js lint
```

No test framework is configured.

## Architecture

**NewHome.ge** is a Georgian-language furniture and lighting e-commerce site built with **Next.js 16 App Router** (SSG). All data is hardcoded — no backend API.

**Stack:** Next.js 16 + TypeScript, React-Bootstrap + Bootstrap 5, Tailwind CSS v4 (via `@tailwindcss/postcss`), `motion/react` for animations, `lucide-react` for icons.

> Bootstrap and Tailwind are both active. Bootstrap handles components; Tailwind provides utility classes. Don't mix their grid systems.

---

### File structure

```
src/
  app/                          ← Next.js App Router
    layout.tsx                  ← Root layout: global metadata, Bootstrap CSS, Providers, Header/Footer
    globals.css                 ← All custom CSS + Tailwind import
    page.tsx + HomePage.tsx     ← Each route: thin server wrapper + client UI component
    about/
    products/ + products/[category]/
    product/[id]/               ← generateStaticParams + generateMetadata + ProductJsonLd
    services/ + service/[id]/
    projects/ + project/[id]/
    contact/
    sitemap.ts                  ← Auto-generated /sitemap.xml
    robots.ts                   ← Auto-generated /robots.txt
  components/
    Header.tsx                  ← 'use client' — sticky nav, CartDrawer offcanvas
    Footer.tsx                  ← 'use client'
    ProductCard.tsx             ← 'use client' — wishlist toggle, color swatches
    HeroSlider.tsx              ← 'use client' — Bootstrap Carousel + motion
    Providers.tsx               ← 'use client' — wraps AppProvider for layout
    ProductJsonLd.tsx           ← Server-safe — Schema.org JSON-LD for product pages
  context/
    AppContext.tsx              ← 'use client' — cart + wishlist state, localStorage
  lib/
    data.ts                     ← ALL hardcoded data (products, services, projects) + getter functions
public/
  logo.png                      ← Static logo served at /logo.png
```

---

### Page pattern (server wrapper + client UI)

Every route follows this two-file pattern:

```tsx
// src/app/about/page.tsx  ← SERVER component
export const metadata: Metadata = { title: '...' };
export default function Page() { return <AboutPage />; }

// src/app/about/AboutPage.tsx  ← CLIENT component
'use client';
// ...actual UI with motion, react-bootstrap, etc.
```

Dynamic routes (product, service, project) additionally export `generateStaticParams` and `generateMetadata`. The server page passes data as props to the client component — the client component does NOT call `useParams`.

---

### Data layer — `src/lib/data.ts`

Single source of truth for all content. Key exports:
- `allProducts`, `getAllProducts()`, `getProductById(id)`
- `allServices`, `getAllServices()`, `getServiceById(id)`
- `allProjects`, `getAllProjects()`, `getProjectById(id)`

When adding new products/services/projects, **only edit `src/lib/data.ts`** — sitemap, static params, and metadata all derive from these arrays automatically.

---

### Styling conventions

- CSS custom properties in `globals.css`: `--primary-color: #0F2E47` (dark blue), `--accent-color: #CC7A50` (terracotta)
- Bootstrap classes override via `globals.css` (`.btn-primary`, `.bg-primary`, `.navbar`, etc.)
- `article-*` classes implement Article.com-style product listing aesthetic
- Font: `Noto Serif Georgian` loaded via `next/font/google` in `layout.tsx`; all UI text is in Georgian (ka)

---

### SEO features

- **Per-page metadata**: `generateMetadata` in every dynamic route
- **Static metadata**: exported `metadata` object in static routes
- **JSON-LD**: `<ProductJsonLd>` renders Schema.org `Product` markup on product pages; `FurnitureStore` org schema in root `layout.tsx`
- **Sitemap**: `/sitemap.xml` auto-generated from all products/services/projects
- **Robots**: `/robots.txt` blocks `/checkout`, `/account`, `/cart`, `/api/`
- **OG / Twitter Cards**: configured in root layout + per-page metadata
- **hreflang**: `ka` locale declared in root metadata
