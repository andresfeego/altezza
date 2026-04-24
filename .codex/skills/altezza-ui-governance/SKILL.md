---
name: altezza-ui-governance
description: Use when designing or refining Altezza frontend screens, dashboards, homes, forms, tables, cards, toasts, or responsive behavior. Applies the project's UX/UI governance, design tokens, component rules, mobile-first standards, and naming conventions for Dashboard and Home surfaces.
---

# Altezza UI Governance

Use this skill when working on frontend UI for Altezza.

## Core rules

- This skill is mandatory for all UI work in Altezza.
- Before starting any UI task in this repo, review `docs/product/reglas-desarrollo.md`. That file is the operative source for current development and UI rules.
- `Dashboard` is only for `Admin`.
- `Home` is for `Cliente`, `Organizador`, and `Colaborador`.
- Respect mobile-first layout decisions even when a screen is primarily used on desktop.
- Use shared design tokens before introducing new sizes, colors, shadows, or radii.
- Do not leave hardcoded visual sizes in new UI. Spacing, typography, icon size, and icon containers must come from project tokens.
- In vertical content lists, use a single separation strategy. Prefer only the top divider of the next item. Do not combine top and bottom separators between the same two rows.
- Avoid nested surface noise. Do not stack multiple card-looking layers when a list, divider, or flat block can solve the composition more cleanly.
- Use toast for action-level outcomes and inline messages for field-specific validation.
- If a form validates data, the field must show its own error state. Toast is complementary, not the only feedback.
- Keep the visual direction `luxury modern`, sober, warm, and premium.
- Use color sparingly. Brand color is for emphasis, not saturation.
- Prefer subtle borders, subtle shadows, and generous spacing.
- Use visible primary actions. Avoid hiding core actions behind menus unless density requires it.
- Drawer navigation is the default mobile navigation for module switching.
- When a screen needs contextual commands in the upper-right area, call that pattern `Boton de acciones de pantalla`.

## Required reading by task

- For repo-level development rules and current UI governance decisions: read `docs/product/reglas-desarrollo.md`
- For visual language and token usage: read [references/design-tokens.md](references/design-tokens.md)
- For layout, responsive behavior, and spacing: read [references/layout-and-responsive.md](references/layout-and-responsive.md)
- For forms, tables, toasts, and interaction rules: read [references/component-rules.md](references/component-rules.md)

## Working process

1. Confirm current repo rules in `docs/product/reglas-desarrollo.md` before designing or refining UI.
2. Identify the role and surface:
   - `Admin Dashboard`
   - `Cliente Home`
   - `Organizador Home`
   - `Colaborador Home`
   - module detail screen
3. Apply the correct density and hierarchy for that surface.
4. Reuse shared tokens and shared UI components first.
   - Icon containers must use spacing tokens.
   - Icon glyph size must use typography tokens.
   - Reuse the current transversal shells before inventing local headers or wrappers.
     - admin modules: shared admin shell
     - client event modules: `EventClientModuleShell`
5. Include loading, empty, error, success, and responsive states.
6. If touching forms, keep:
   - inline field validation
   - toast for submit result
7. If touching navigation, preserve the product naming convention from `docs/product`.
8. Validate spacing, typography, motion, and responsive density against the governance references before delivery.
9. Before shipping a modal or detail view, explicitly check:
   - no redundant eyebrow text above the main title
   - no card-inside-card visual smell
   - row action menus close on outside click and on action click

## Pending rule

- Autovalidated fields are not yet part of the base implementation. Treat them as a pending improvement in Fase 1 unless the task explicitly includes them.
