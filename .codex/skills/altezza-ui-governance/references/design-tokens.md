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

- `--ag-space-1` = 8px
- `--ag-space-2` = 16px
- `--ag-space-3` = 24px
- `--ag-space-4` = 32px
- `--ag-space-5` = 40px
- `--ag-space-6` = 48px

### Typography

- titles: elegant sans with strong hierarchy
- body: elegant sans
- large titles allowed on key screens
- prefer high line-height and generous white space

## Usage rules

- brand color should be measured, not dominant
- warm neutrals should carry most of the interface
- error, warning, success, and info must remain clearly distinguishable
- avoid introducing one-off colors in modules
