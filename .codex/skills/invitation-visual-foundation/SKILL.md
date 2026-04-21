---
name: invitation-visual-foundation
description: Use when improving the visual layer of modular invitation cards or invitation templates without changing logic, data contracts, module order, or functional behavior. Applies a cross-template editorial UI foundation focused on continuity, hierarchy, rhythm, and module integration so the card feels like a designed invitation instead of stacked app cards.
---

# Invitation Visual Foundation

Use this skill only for invitation-card UI work.

Apply it when the card is already functional and the task is to improve presentation, composition, spacing, hierarchy, transitions, or visual continuity.

Do not use this skill to redesign data models, change endpoints, reorder modules, or modify business behavior.

## Objective

Elevate the visual quality of modular invitation cards so the experience feels intentional, emotional, and continuous.

The result should feel like a designed invitation piece, not an admin app or a stack of widgets.

## Hard boundaries

Do not change:

- logic
- contracts
- module order
- data flow
- functional behavior
- confirmation rules
- routing

If a better visual result would require structural or behavioral changes, stop at the best UI-only solution and note the limitation.

## Core model

Treat the invitation as one continuous narrative surface.

Each module is a chapter inside the same visual story, not an isolated card.

Prioritize:

- continuity over fragmentation
- narrative scroll over component stacking
- emotional hierarchy over flat utility
- editorial composition over dashboard aesthetics

## Visual principles

### Continuity

- Avoid making every module look like an independent floating card.
- Reduce hard cuts between sections.
- Prefer shared surfaces, soft separators, repeated motifs, and gradual transitions.

### Narrative rhythm

- Design the page as a vertical sequence with variation.
- Alternate dense information, breathing space, imagery, and actions.
- Avoid repeating the same section shell over and over.

### Emotional hierarchy

The strongest emphasis should normally go to:

- couple or celebrant names
- event type
- date
- hero image or hero media

Secondary content must support, not compete.

### Editorial feel

- Avoid dashboard, settings, or form-builder aesthetics.
- Use composition, spacing, scale, and restraint to create a designed feeling.
- Prefer calm structure over noisy decoration.

### Cross-module consistency

All modules should feel related through:

- spacing system
- density
- corner logic
- container logic
- typography scale
- color continuity

## Style rules

### Background

- Avoid pure white or gray app backgrounds.
- Use soft, warm, atmospheric, or layered surfaces.
- The background should support the content without dominating it.

### Containers

- Reduce heavy card treatment.
- Avoid strong dashboard shadows or aggressive elevation.
- Prefer integrated sections, soft edges, subtle surfaces, and visual continuity.

### Spacing

- Use an 8px-based rhythm.
- Keep padding and section separation consistent.
- Give more air to hero sections and emotional content.
- Do not create random large gaps that break flow.

### Typography

- Keep title, subtitle, body, and meta levels clearly separated.
- Avoid near-identical sizes across hierarchy levels.
- Maintain consistent scale and weight logic through the page.

### Photography and media

- Images should structure the experience, not just decorate it.
- Favor hero usage, sectional breaks, immersive media, and controlled overlays.
- Avoid repeated small rectangles without visual purpose.
- Do not remove or visually demote primary media just to simplify layout.
- If the card already has photography, cover art, or video, preserve that media as a structural part of the invitation.
- Prefer invitation-like composition where imagery anchors the narrative, especially in hero or section breaks.
- When hero media is pale, illustrated, engraved, or line-art based, avoid darkening it with generic overlay gradients.
- For this kind of artwork, prefer token-based translucent solids, subtle text support, and decorative motion that complements the illustration instead of sitting on top of it as a heavy effect.

### Invitation format cues

- Favor compositions that can feel like a real invitation sheet, editorial panel, or vertical keepsake.
- On many invitation templates, a narrower and more vertically intentional composition is better than a broad app-like layout.
- If a wide responsive layout starts to feel like a product UI, compress the composition toward a more curated invitation reading experience.

### Buttons and actions

- Actions must feel integrated into the invitation language.
- Avoid default system-button appearance.
- Keep clear primary/secondary hierarchy.

### Functional modules

- Countdown, RSVP, and similar modules should not feel technical.
- Reframe utility into invitation-quality presentation through spacing, hierarchy, grouping, and calmer surfaces.

### Dividers and transitions

- Prefer space, subtle texture, soft gradients, or delicate separators.
- Avoid hard rules and aggressive visual breaks unless the template explicitly needs them.

### Template-owned styling

- Presentation decisions must live in the template stylesheet, not in shared invitation-level styling, when the effect is specific to one template.
- Do not introduce generic hero overlays resolved with `background: linear-gradient(...)` by default.
- If contrast support is needed, first try token-driven alpha surfaces, text treatment, spacing, or content placement before adding any gradient layer.

## Anti-patterns

Avoid:

- dashboard cards
- widget stacking
- flat white app surfaces
- dark or muddy overlays over delicate illustration-based hero art
- generic system buttons
- harsh shadows
- repetitive identical section shells
- visually flat hierarchy
- administrative UI language
- removing key imagery and ending up with mostly text containers
- layouts that read like a landing page or SaaS panel instead of an invitation

## Validation checklist

Before considering the UI pass complete, check:

- Does it feel like an invitation instead of an app?
- Do sections feel connected instead of stacked?
- Are names, date, and primary media clearly prioritized?
- Is the scroll rhythm varied enough?
- Is spacing intentional and consistent?
- Do images contribute structurally?
- Do buttons feel integrated?
- Does the full scroll feel fluid?

## Working guidance for Codex

When applying this skill:

1. Preserve existing module semantics and behavior.
2. Improve composition before adding decoration.
3. Use fewer, better surfaces instead of more containers.
4. Let templates own visual identity; this skill only defines the foundational quality bar.
5. If a module still looks like a technical component, simplify and recompose it.

The goal is not to impose one aesthetic.

The goal is to ensure any invitation template starts from a strong visual foundation:

- continuity
- hierarchy
- rhythm
- integration
- editorial quality
