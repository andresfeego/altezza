# Layout And Responsive

## Global layout

- mobile-first always
- content width should be fluid with limits
- dashboards can be wider than forms
- forms should remain more contained than tables or board-like screens
- container spacing must follow the responsive density map
- admin modules should reuse a shared module shell for inner container rhythm, module header, summary block, primary action row, and section card
- admin module routes should also reuse a shared outer content container instead of redefining page padding module by module
- current admin outer content baseline: desktop with menu offset; under `1024px`, `margin-left: 0` and `padding: 56px 16px 16px`

## Responsive density map

| Breakpoint | Container Padding | Gaps | Section Spacing |
| --- | ---: | ---: | ---: |
| Mobile `<640px` | `16` | `16` | `24-32` |
| Tablet `>=768px` | `24` | `24` | `32-48` |
| Desktop `>=1024px` | `32` | `32` | `48-64` |
| Large `>=1440px` | `48` | `40-48` | `64-96` |

Notes:

- under 512px, do not go below 16px as a general visible spacing value
- home and main section top padding should be at least 56px
- 96 and 128 spacing values are reserved for large sections and must be justified

## Surface patterns

### Admin Dashboard

- operational first
- summary cards
- pending actions
- visible quick actions

### Homes

- modular card system
- each eligible module can expose one summary block
- client home can be more emotional, but still useful

### Section headers

- primary section or module titles should sit outside cards
- align primary section titles to the right
- target around 80% visual width for the title block inside the header area
- use right-side breathing room based on the spacing scale
- use bottom breathing room based on the spacing scale before the next summary or content block
- internal section titles such as `h2` should come from shared shell classes when the structure is repeated across admin modules

### Summary blocks

- transversal summary blocks should use a 3-column grid
- if there are more than 3 items, let them wrap into the needed rows
- summary items should remain centered inside the card

### Filters and mobile card lists

- filter blocks should leave 32px bottom separation before the next content block
- vertical mobile card lists should use a wider gap; current rule: 24px

## Responsive behavior

- stack sections early on mobile
- preserve readable spacing
- tables may stay tabular on desktop, but require simplified mobile behavior
- drawer is the default pattern for navigation between modules
- modal padding should be 16px on small mobile, 24px on mobile/tablet, and 32px on desktop
- modal close button should be absolutely positioned relative to the modal, top 8px and right 8px
- modal title block should keep top breathing room based on the spacing scale; current rule: 16px
- modal action block should keep 64px top spacing and 32px bottom spacing

## Page actions

When a screen needs contextual actions on the top-right corner, use the pattern name:

- `Boton de acciones de pantalla`

This is a page-level action control, not row-level actions.
