---
name: designing-savemelin-screens
description: Implements new Savemelin screens with the pixel-perfect design system. Use when creating or refactoring landing, product, and auth pages to match the homepage structure, borders, spacing, typography, buttons, navbar/footer, and responsive behavior.
---

# Designing Savemelin Screens

Use this skill when a new screen must look and behave like the current pixel-perfect homepage.

## Source of truth
- `app/pixel-perfect-page-main/page.tsx`
- `components/pixel-perfect-page-main/Navbar.tsx`
- `components/pixel-perfect-page-main/Footer.tsx`
- `components/pixel-perfect-page-main/button.tsx`
- `app/globals.css`

## Non-negotiable layout contract
1. Root wrapper:
   - `pixel-perfect-home relative min-h-screen bg-background text-foreground`
2. Global vertical rails (left/right) must span the full page (including navbar).
3. Content must stay inside body rails:
   - Main sections: `max-w-[94rem] mx-auto padding-global border-x border-border/70`
   - Navbar/Footer containers: `max-w-[90rem] mx-auto`
4. Global horizontal padding:
   - `.padding-global { padding-left: 2.5rem; padding-right: 2.5rem; }`
5. Section spacing:
   - Each section content uses `padding: 3rem`.
6. Section separators:
   - Top border on sections.
   - Horizontal divider image between sections (except between navbar and hero: only border line).

## Visual tokens and components
- Typography: Aspekta (configured in `globals.css`).
- Primary color: `--primary` (Savemelin orange).
- Secondary surface: `--section-grey` (`#fafafa`) via `bg-section-grey`.
- Buttons:
  - Primary: `variant="primary"`
  - Secondary dashed: `variant="secondary"` (same hover color, no fill jump).
- Reuse existing components before creating new ones.

## Responsive rules
- Mobile navbar menu must not overflow body rails.
- No component can exceed the bordered layout width.
- Keep CTAs compact on mobile; prioritize side-by-side placement when space allows.

## New screen workflow
1. Compose page with existing pixel-perfect primitives.
2. Apply layout contract (rails, containers, borders, separators).
3. Adapt content only (do not break spacing/token rules).
4. Validate desktop + mobile widths and overflow.
5. Match interactions already used in homepage (search, buttons, cards, states).

## Acceptance checklist
- [ ] Uses `pixel-perfect-home` wrapper and full-height vertical rails.
- [ ] Navbar + Footer included and aligned with rails.
- [ ] No overflow outside bordered body in desktop/mobile.
- [ ] Section spacing/borders/dividers match homepage.
- [ ] Colors, typography, and button styles match existing tokens/components.
- [ ] UI is visually consistent with current Savemelin homepage.
