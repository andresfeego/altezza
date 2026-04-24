# Component Rules

## Forms

- labels go above fields
- use inline validation for field-specific issues
- use toast for submit outcome
- keep a premium editorial rhythm, not dense default forms
- do not rely only on toast for invalid field feedback
- label + input spacing: 8px
- between form fields: 16px
- for simple toggles or boolean options, prefer a clean switch row over checkbox plus explanatory paragraph
- do not wrap simple switches in tinted cards or helper blocks unless the control truly needs extra context
- avoid helper text under a field when the control label is already self-explanatory

## Tables

- use refined traditional tables by default
- keep row actions visible when they are core to the workflow
- only move secondary actions to menus when density requires it
- spacing inside cards: 16px
- spacing between cards: 16-24px
- spacing between major sections: 32-64px
- when a modal or detail block needs member lists, prefer editorial rows with single dividers over mini-cards per row
- when a secondary picker list inside a modal can grow too much, prefer an accordion or collapsible section with internal scroll instead of letting the modal grow indefinitely

## Cards

- cards should start with an `h3` as the primary title element
- keep card titles visually below section `h2` scale
- current working guidance for card `h3`: around 1.2rem unless the module requires a tighter or larger variant
- cards are not the default answer for every nested level; if a parent surface is already a card, children should usually be rows, lists, or flat text blocks
- feed summary cards should stay terse
- avoid eyebrow text like `Resumen del modulo` in feed previews
- avoid long helper paragraphs in feed previews when the metrics already tell the story
- if the whole card is clickable, do not add a redundant fixed CTA label at the bottom
- keep the internal gap between title block and metrics compact; current working baseline for feed previews is `var(--ag-space-3)` at the main card content level
- when multiple status/action icons appear in the same card row, unify their base container geometry; semantics should come from tone and tooltip, not from changing shape between icons

## Primary actions

- the primary action for an admin module should use a filled primary button style
- the primary action should use the available width instead of a tiny floating control
- a leading icon is valid when it improves scanability
- home and dashboard previews should live in separate components, not inline inside the main home/dashboard component
- shared admin module actions should come from the transversal shell before introducing local button variants

## Heading rules

- all new `h1`, `h2`, `h3`, and `h4` usage must map to official heading tokens
- do not introduce new heading sizes with hardcoded values in new modules
- use `h1` for page or module main title
- use `h2` for section titles
- use `h3` for card titles
- use `h4` for minor subsection titles
- when multiple admin modules share the same title pattern, use shell heading classes instead of per-module heading CSS

## Color rules

- all new UI colors must come from project tokens
- do not hardcode colors in new modules, screens, or components
- semantic badges must use semantic token families
- for category badges, use token-derived surfaces or `color-mix(...)` from tokens instead of one-off custom hues
- when a status is neutral, pending, or unconfirmed, prefer `--ag-gray-*` tokens over ad hoc mixed grays

## Tooltips and icon actions

- icon-only actions should expose meaning through `aria-label` and a visual tooltip on desktop hover
- avoid relying on the browser native `title` tooltip when the interface already uses a governed tooltip pattern
- non-clickable informational pills should not look like text selections or links; use neutral cursor behavior

## Toasts

- use compact toasts by default
- action-rich toasts are valid for copy, retry, or contextual quick actions
- position remains top-center unless a future governance update changes it

## States

- loading must use a shared pattern
- empty states should feel guided and human
- success and error should be visible without overwhelming the screen

## Accessibility baseline

- visible focus states
- sufficient text/background contrast
- labels present for inputs
- keyboard-friendly forms
- toasts should not be the only place where important validation appears
- honor prefers-reduced-motion when motion is used
- action menus must close predictably on outside click and remain keyboard-escapable as they evolve

## Validation checklist

Before delivering UI:

- spacing values must be multiples of 8
- container padding and gaps must follow the responsive density map
- typography should stay inside the approved scale unless a justified exception exists
- motion must be functional, subtle, and within approved duration values
- avoid eyebrow text that repeats the same meaning as the title
- avoid nested card visuals when a flatter structure improves clarity
