# NewHome Engineering Notes

## Stack

- Next.js `16+`
- App Router only
- React `19`
- TypeScript

## Rules

- Follow current Next.js `16+` documentation and patterns.
- Prefer Server Components by default.
- Use Client Components only when browser interactivity is required.
- Do not introduce legacy Pages Router patterns.
- Do not add `middleware.ts`.
- If request interception or edge routing is needed, use `proxy` patterns supported by current Next.js guidance instead of middleware.
- Avoid `styled-jsx` inside Server Components.
- Prefer plain CSS modules, global CSS, or existing project styling patterns.

## Data Flow

- `frontend/newhome` consumes Laravel CMS data from `/api/web/*`.
- Block rendering must treat backend block types as the source of truth.
- When block names evolve, keep frontend aliases backward-compatible until old DB content is migrated.

## Homepage Blocks

- Multiple `main_banner` blocks must be merged into one slider.
- If there are no banner slides, homepage should render no hero slider.
- `items_grid` is the current frontend alias for the page services/items block.

## Routing

- Keep App Router routes under `src/app`.
- Use route-level `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx` where needed.
- Prefer `generateMetadata` for SEO instead of client-side title handling.

## Implementation Constraints

- Preserve build compatibility with Next.js `16+`.
- Keep browser-only code out of Server Components.
- Be careful with third-party packages that depend on client-only behavior.
