# Component Rules

## Forms

- labels go above fields
- use inline validation for field-specific issues
- use toast for submit outcome
- keep a premium editorial rhythm, not dense default forms
- do not rely only on toast for invalid field feedback
- label + input spacing: 8px
- between form fields: 16px

## Tables

- use refined traditional tables by default
- keep row actions visible when they are core to the workflow
- only move secondary actions to menus when density requires it
- spacing inside cards: 16px
- spacing between cards: 16-24px
- spacing between major sections: 32-64px

## Cards

- cards should start with an `h3` as the primary title element
- keep card titles visually below section `h2` scale
- current working guidance for card `h3`: around 1.2rem unless the module requires a tighter or larger variant

## Heading rules

- all new `h1`, `h2`, `h3`, and `h4` usage must map to official heading tokens
- do not introduce new heading sizes with hardcoded values in new modules
- use `h1` for page or module main title
- use `h2` for section titles
- use `h3` for card titles
- use `h4` for minor subsection titles

## Color rules

- all new UI colors must come from project tokens
- do not hardcode colors in new modules, screens, or components

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

## Validation checklist

Before delivering UI:

- spacing values must be multiples of 8
- container padding and gaps must follow the responsive density map
- typography should stay inside the approved scale unless a justified exception exists
- motion must be functional, subtle, and within approved duration values
