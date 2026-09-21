import { useEffect } from 'react';

const START_MODULES = new Set(['biblical_quote', 'couple_names', 'countdown', 'save_the_date_calendar']);
const TEXT_BLOCKS = 'h2, h3, p, time, ul, a, strong';
const MEDIA_BLOCKS = {
  dresscode: '[data-dresscode] > div',
  gift_envelopes: '[data-gift-envelopes] > div > img',
  instant_photos: '[data-instant-photos] figure, [data-instant-photos] > div > img',
};

function revealGroups(root) {
  const groups = [];
  let started = false;
  for (const frame of root.querySelectorAll('[data-oliva-module]')) {
    const type = frame.dataset.olivaModule;
    started ||= START_MODULES.has(type);
    if (!started) continue;

    if (type === 'couple_names') {
      const title = frame.querySelector('[data-couple-names] h2');
      if (title) groups.push({ trigger: title, items: [...title.children] });
      continue;
    }

    const selector = type === 'countdown'
      ? '[data-countdown] > time, [data-countdown] > h2, [data-countdown] > p, [data-countdown] > div'
      : type === 'save_the_date_calendar'
        ? '[data-save-the-date-calendar] > p, [data-save-the-date-calendar] > div'
        : TEXT_BLOCKS;
    const candidates = [...frame.querySelectorAll(selector)].filter((element) => (
      element.textContent.trim() && !element.closest('[aria-hidden="true"], [role="status"], [role="alert"], [role="radiogroup"]')
    ));
    // Animate a complete text block, never both it and its descendants.
    const blocks = candidates.filter((element) => !candidates.some((parent) => parent !== element && parent.contains(element)));
    blocks.forEach((element, index) => groups.push({ trigger: element, items: [element], order: Math.min(index, 2), side: index % 2 ? 1 : -1 }));
    if (MEDIA_BLOCKS[type]) {
      [...frame.querySelectorAll(MEDIA_BLOCKS[type])]
        .filter((element) => !element.closest('[aria-hidden="true"]'))
        .forEach((element, index) => groups.push({ trigger: element, items: [element], media: true, order: Math.min(index, 2), side: index % 2 ? 1 : -1 }));
    }
  }
  return groups;
}

// Progressive enhancement: server-rendered text and unsupported browsers stay visible.
export function observeTextReveals(root) {
  const view = root?.ownerDocument.defaultView;
  const preference = view?.matchMedia?.('(prefers-reduced-motion: reduce)');
  if (!root || !view?.IntersectionObserver || !preference || preference.matches) return undefined;

  const groups = revealGroups(root);
  const pending = new Map();
  const waitingForMedia = new Map();
  let observer;

  function reveal(group, instant = false) {
    if (group.media && !instant) {
      const images = group.items.flatMap((item) => item.matches('img') ? [item] : [...item.querySelectorAll('img')]);
      const loading = images.filter((image) => !image.complete);
      if (loading.length) {
        if (waitingForMedia.has(group)) return;
        // A slow lazy image waits locally; it never delays the invitation or text.
        const clear = () => {
          loading.forEach((image) => {
            image.removeEventListener('load', onSettled);
            image.removeEventListener('error', onSettled);
          });
          waitingForMedia.delete(group);
        };
        const onSettled = () => {
          if (loading.every((image) => image.complete)) { clear(); reveal(group); }
        };
        waitingForMedia.set(group, clear);
        loading.forEach((image) => {
          image.addEventListener('load', onSettled);
          image.addEventListener('error', onSettled);
        });
        return;
      }
    }
    waitingForMedia.get(group)?.();
    for (const item of group.items) {
      if (instant) item.dataset.olivaRevealInstant = '';
      item.dataset.olivaReveal = 'shown';
    }
    pending.delete(group.trigger);
    observer?.unobserve(group.trigger);
  }

  function finish() {
    observer?.disconnect();
    // Also cancel an in-flight animation when reduced motion is enabled.
    groups.forEach((group) => reveal(group, true));
  }

  function onPreferenceChange(event) {
    if (event.matches) finish();
  }

  function onFocus(event) {
    groups.filter((group) => group.trigger.contains(event.target)).forEach((group) => reveal(group, true));
  }

  try {
    observer = new view.IntersectionObserver((entries) => {
      for (const entry of entries) {
        const group = pending.get(entry.target);
        if (!group) continue;
        if (entry.isIntersecting && entry.intersectionRatio >= .18) reveal(group);
        // Fast scrolling can jump over a whole block between observer deliveries.
        else if (entry.boundingClientRect.bottom <= 0) reveal(group, true);
      }
    }, { threshold: .18, rootMargin: '0px 0px -6% 0px' });

    for (const group of groups) {
      if (group.items.every((item) => item.dataset.olivaReveal === 'shown')) continue;
      group.items.forEach((item, index) => {
        item.style.setProperty('--oliva-reveal-order', String(group.order ?? index));
        item.style.setProperty('--oliva-reveal-side', String(group.side ?? (index % 2 ? 1 : -1)));
        if (group.media) item.dataset.olivaRevealMedia = '';
        item.dataset.olivaReveal = 'pending';
      });
      pending.set(group.trigger, group);
      observer.observe(group.trigger);
    }
  } catch (_error) {
    finish();
    return undefined;
  }

  preference.addEventListener?.('change', onPreferenceChange);
  root.addEventListener('focusin', onFocus);
  return () => {
    finish();
    preference.removeEventListener?.('change', onPreferenceChange);
    root.removeEventListener('focusin', onFocus);
  };
}

export default function useTextRevealOliva(contentRef, opened) {
  useEffect(() => {
    if (!opened) return undefined;
    return observeTextReveals(contentRef.current);
  }, [contentRef, opened]);
}
