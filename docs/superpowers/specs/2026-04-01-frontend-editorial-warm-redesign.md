# Frontend Editorial Warm Redesign Design

## 1. Goal
Refactor the frontend UI to a premium, cohesive, and expressive experience while preserving existing API contracts and business behavior. Login, register, and todo pages must all be redesigned.

## 2. Scope
In scope:
- Visual redesign of `/login`, `/register`, `/todos`
- Reusable UI foundation (buttons, cards, inputs, tokens, motion)
- Responsive behavior for desktop and mobile
- Interaction polish (hover/active/focus/enter/exit transitions)

Out of scope:
- Backend API or auth protocol changes
- Data model changes
- New business features unrelated to existing auth/todo flow

## 3. Visual Direction
Theme: **Editorial Warm Pro**

Design intent:
- Warm editorial atmosphere with modern product polish
- Multi-accent color system (not single-tone)
- Strong typography hierarchy and card depth
- Motion that feels lively but controlled

## 4. Design Tokens
Create CSS tokens to centralize visual language.

### 4.1 Color tokens
- Background layers:
  - warm paper cream
  - light apricot
  - soft cool gray-green blend for contrast
- Semantic palette:
  - primary (amber brown)
  - accent-1 (coral orange)
  - accent-2 (teal blue)
  - success (olive green)
  - danger (brick red)
- Text palette:
  - headline dark
  - body medium-dark
  - secondary muted

### 4.2 Radius and shadow tokens
- Radius levels: 12 / 16 / 24
- Shadow levels: soft / medium / lift

### 4.3 Motion tokens
- Fast: 120ms
- Base: 180ms
- Enter/exit: 240ms
- Ease curves for button press and card reveal

## 5. Layout and Page Design

### 5.1 Login/Register pages
- Two-panel responsive layout on desktop:
  - Left panel: brand statement and decorative abstract shapes
  - Right panel: glass-like auth card with form
- Mobile fallback:
  - single-column card-first layout with preserved spacing rhythm
- Inputs:
  - clear focus ring, smoother placeholder transition
- Error feedback:
  - inline alert styling with consistent semantic colors

### 5.2 Todo page
- Section hierarchy:
  - Header (title + summary badges)
  - Composer card (new task)
  - Task list cards
- Task card behavior:
  - status chip and quick actions grouped clearly
  - completed items visually distinct but readable

## 6. Interaction and Motion
- Primary button behavior:
  - default gradient + subtle inner glow
  - hover: slight lift and shadow increase
  - active: press-down rebound
- Secondary and destructive buttons use distinct states
- Task transitions:
  - add: fade + upward reveal
  - delete: fade + collapse
  - status toggle: smooth color/icon transition

## 7. Component Architecture
Add UI primitives and keep business logic unchanged.

New UI layer:
- `src/theme/tokens.css`
- `src/theme/motion.css`
- `src/components/ui/Button.tsx`
- `src/components/ui/Card.tsx`
- `src/components/ui/Input.tsx`

Refactor existing pages/components to consume primitives:
- `src/pages/LoginPage.tsx`
- `src/pages/RegisterPage.tsx`
- `src/pages/TodoPage.tsx`
- `src/components/TodoForm.tsx`
- `src/components/TodoList.tsx`

## 8. Accessibility and UX Requirements
- Keep contrast at accessible levels for text and controls
- Full keyboard navigation for forms and todo actions
- Visible focus states on all interactive components
- Respect reduced motion preference where applicable

## 9. Testing Strategy
- Preserve existing routing/auth/todo tests as baseline behavior checks
- Add focused UI interaction tests where logic changed:
  - auth page renders new structure and keeps submit behavior
  - todo actions still call API methods and update UI state correctly
- Verify `npm test` and `npm run build` pass after redesign

## 10. Risks and Mitigations
- Risk: visual redesign may break interaction flows
  - Mitigation: keep API and route contracts untouched; run existing tests continuously
- Risk: over-animated UI reduces readability
  - Mitigation: motion tokens with restrained durations and reduced-motion support
- Risk: inconsistent style drift
  - Mitigation: enforce token usage and shared UI primitives

## 11. Success Criteria
- Login/register/todo pages look visually cohesive and premium
- Buttons and interactions feel lively and deliberate
- Color system is diverse but controlled
- Existing core behavior remains intact (tests green)
- Desktop and mobile experience both usable and polished
