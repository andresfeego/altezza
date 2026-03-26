# Design Tokens

## Visual direction

- tone: luxury modern
- expression: sober
- density: airy
- color temperature: warm
- quality bar: premium

## Token strategy

Use semantic tokens, not raw hex values in screen components.

### Brand

- `--ag-brand-rose`
- `--ag-brand-rose-strong`
- `--ag-brand-wine`
- `--ag-brand-wine-strong`

### Surface

- `--ag-surface-page`
- `--ag-surface-card`
- `--ag-surface-card-alt`
- `--ag-surface-soft`

### Text

- `--ag-text-strong`
- `--ag-text-base`
- `--ag-text-muted`
- `--ag-text-soft`

### Border

- `--ag-border-soft`
- `--ag-border-strong`

### States

- `--ag-success`
- `--ag-success-soft`
- `--ag-warning`
- `--ag-warning-soft`
- `--ag-danger`
- `--ag-danger-soft`
- `--ag-info`
- `--ag-info-soft`

### Radius

- `--ag-radius-sm`
- `--ag-radius-md`
- `--ag-radius-lg`
- `--ag-radius-pill`

### Shadows

- `--ag-shadow-soft`
- `--ag-shadow-card`
- `--ag-shadow-lifted`

### Spacing

Base spacing rule: 8px scale.

- use named spacing tokens only
- minimum general visible spacing in Altezza UI is 16px
- 8px is reserved for micro-spacing such as label/input separation or tight inline groupings
- forbidden spacing values: 10px, 14px, 18px, 22px, 30px

- `--ag-space-0` = 0px
- `--ag-space-1` = 8px
- `--ag-space-2` = 16px
- `--ag-space-3` = 24px
- `--ag-space-4` = 32px
- `--ag-space-5` = 40px
- `--ag-space-6` = 48px
- `--ag-space-7` = 64px
- `--ag-space-8` = 96px
- `--ag-space-9` = 128px

### Typography

- titles: elegant sans with strong hierarchy
- body: elegant sans
- large titles allowed on key screens, not mandatory for every admin module
- prefer high line-height and generous white space
- allowed type sizes: 12, 14, 16, 20, 24, 32, 40, 48
- allowed line-heights: 16, 20, 24, 32, 40, 48, 56, 64
- allowed weights: 400, 500, 600, 700
- avoid 13, 15, 17 and avoid 300 or 800+ unless justified

Suggested semantic mapping:

- caption: 12/16 regular
- label: 14/20 medium
- body: 16/24 regular
- card title: 20/32 semibold
- page title: 32/40 bold
- hero title: 40-48 bold only on key surfaces

Suggested typography token names:

- `--ag-text-caption-size`
- `--ag-text-caption-line`
- `--ag-text-caption-weight`
- `--ag-text-label-size`
- `--ag-text-label-line`
- `--ag-text-label-weight`
- `--ag-text-body-size`
- `--ag-text-body-line`
- `--ag-text-body-weight`
- `--ag-text-card-title-size`
- `--ag-text-card-title-line`
- `--ag-text-card-title-weight`
- `--ag-text-page-title-size`
- `--ag-text-page-title-line`
- `--ag-text-page-title-weight`
- `--ag-text-hero-title-size`
- `--ag-text-hero-title-line`
- `--ag-text-hero-title-weight`

Heading token names:

- `--ag-heading-h1-size`
- `--ag-heading-h1-line`
- `--ag-heading-h1-weight`
- `--ag-heading-h2-size`
- `--ag-heading-h2-line`
- `--ag-heading-h2-weight`
- `--ag-heading-h3-size`
- `--ag-heading-h3-line`
- `--ag-heading-h3-weight`
- `--ag-heading-h4-size`
- `--ag-heading-h4-line`
- `--ag-heading-h4-weight`

### Motion

- durations: 150ms, 200ms, 250ms, 300ms
- easing: ease-out or cubic-bezier(0.4, 0, 0.2, 1)
- no infinite animation in critical UI
- respect prefers-reduced-motion

Suggested motion token names:

- `--ag-motion-duration-fast`
- `--ag-motion-duration-base`
- `--ag-motion-duration-medium`
- `--ag-motion-duration-slow`
- `--ag-motion-ease-standard`
- `--ag-motion-ease-out`

## Usage rules

- brand color should be measured, not dominant
- warm neutrals should carry most of the interface
- error, warning, success, and info must remain clearly distinguishable
- avoid introducing one-off colors in modules
- all new colors in implementation must come from tokens
- all new heading sizes in implementation must come from official heading tokens
