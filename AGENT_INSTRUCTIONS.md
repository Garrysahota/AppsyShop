# AGENT_INSTRUCTIONS.md
### Instructions for any AI coding assistant (Claude Code, Cursor, Copilot, etc.) working on this repo

---

## Project Context
This is **Appsy Shop**, a portfolio React Native e-commerce app built by Parwinder Singh to showcase production-level mobile development skills (React Native, Redux Toolkit, Firebase, Stripe, clean architecture) for job applications in the Chandigarh/Mohali/Zirakpur tricity area.

Read `docs/PROJECT_DOCUMENTATION.md` before making any structural decision.

---

## Rules the agent MUST follow

1. **Never flatten the feature-based folder structure.** Every new screen/component/logic goes inside its matching `src/features/<feature>/` folder (screens, components, store, services, types). Do not dump files directly into `src/` root.

2. **Use the theme tokens only.** Never hardcode hex colors in components. Always import from `src/theme/colors.ts`. If a new color is needed, add it to the theme file first, then use it.

3. **State management pattern:**
   - Local UI state → `useState`
   - Cross-screen/shared state → Redux Toolkit slice inside that feature's `store/` folder
   - Server data (products, orders) → RTK Query, not manual `useEffect` + `fetch`

4. **No business logic inside screen components.** Screens should only: read state via hooks, call handler functions, render UI. Actual logic (calculations, API calls, validation) lives in `services/` or `store/`.

5. **TypeScript strict mode.** No `any` unless explicitly justified with a comment. Every function has typed params and return type for public/shared functions.

6. **Reusable components first.** Before building a new screen, check `src/shared/components/` for an existing Button/Input/Card that fits. Only create a new shared component if none exists — don't duplicate one-off styled buttons inside feature folders.

7. **Naming conventions:**
   - Components: `PascalCase.tsx`
   - Hooks: `useCamelCase.ts`
   - Slices: `camelCaseSlice.ts`
   - Services: `camelCaseService.ts`

8. **Imports:** always use path aliases (`@features/...`, `@shared/...`, `@theme/...`), never relative chains like `../../../../`.

9. **Every new screen must handle three states explicitly:** loading (skeleton, not spinner-only), empty (friendly empty state), error (retry action) — before "happy path" UI.

10. **Before adding a new npm package**, check if an existing dependency already covers the need. Justify any new package in the PR/commit description.

11. **Do not commit `.env`, Firebase keys, or Stripe secret keys.** Use `.env.example` with placeholder values.

12. **When unsure about a UX/architecture decision**, default to what's documented in `PROJECT_DOCUMENTATION.md` section 4–6 rather than inventing a new pattern.

13. **Commit messages:** conventional commits style — `feat(cart): add quantity stepper`, `fix(auth): handle expired token`.

---

## Definition of Done for any feature
- [ ] Follows folder structure above
- [ ] Uses theme tokens (no hardcoded colors/spacing)
- [ ] TypeScript typed, no `any`
- [ ] Loading/empty/error states handled
- [ ] Reused shared components where applicable
- [ ] No console.log left in code
- [ ] Tested manually on both iOS and Android simulators (or noted if untested)
