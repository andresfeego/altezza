const test = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');
const Module = require('node:module');
const { JSDOM } = require('jsdom');
const babel = require('@babel/core');

const filename = path.resolve(__dirname, '../components/invitaciones-publicas/templates/wedding-oliva/useTextRevealOliva.js');
const compiled = new Module(filename, module);
compiled.filename = filename;
compiled.paths = Module._nodeModulePaths(path.dirname(filename));
compiled._compile(babel.transformFileSync(filename, {
  babelrc: false, configFile: false, plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
}).code, filename);
const { observeTextReveals } = compiled.exports;

function fixture({ reduced = false, unsupported = false, broken = false } = {}) {
  const dom = new JSDOM(`<main>
    <div data-oliva-module="hero_image_1"><h2>Hero</h2><p>Fecha</p><img id="hero" src="/hero.jpg"></div>
    <div data-oliva-module="biblical_quote"><p id="quote">Nuestra frase</p></div>
    <div data-oliva-module="couple_names"><section data-couple-names><h2 id="names"><span>Mayra</span><span>&amp;</span><span>Samuel</span></h2></section></div>
    <div data-oliva-module="countdown"><section data-countdown><time>Fecha</time><h2>Faltan</h2><p>Mensaje</p><div id="timer"><strong>10</strong><span>Días</span></div></section></div>
    <div data-oliva-module="save_the_date_calendar"><section data-save-the-date-calendar><p>El gran día</p><div id="calendar"><h3>Noviembre</h3><span>28</span></div></section></div>
    <div data-oliva-module="event_details"><h2>Ceremonia</h2><a id="map" href="#map">Ver ubicación</a></div>
    <div data-oliva-module="gift_envelopes"><section data-gift-envelopes><div><p>Lluvia de sobres</p><img id="gift" src="/gift.png"></div></section></div>
    <div data-oliva-module="dresscode"><section data-dresscode><h2>Vestuario</h2><div id="outfits"><img src="/outfits.png"></div><div id="palette" data-dresscode-palette="suggested"><span><img src="/swatch.png"></span></div></section></div>
    <div data-oliva-module="attendance_confirm"><h2>¿Nos acompañas?</h2><p>Confirma</p><strong>Invitado</strong><div role="radiogroup"><label><input type="radio">Asistiré</label></div><p role="status">Respuesta guardada</p></div>
    <div data-oliva-module="instant_photos"><section data-instant-photos><div aria-hidden="true"><img id="relief" src="/relief.png"></div><div><figure id="rear"><img src="/003.jpg"></figure><figure id="front"><img src="/004.jpg"></figure><img id="seal" src="/seal.png"></div><p id="closing">Con mucho cariño</p></section></div>
  </main>`);
  const { window } = dom;
  const root = window.document.querySelector('main');
  const observers = [];
  const listeners = new Set();
  window.matchMedia = () => ({ matches: reduced, addEventListener: (_, cb) => listeners.add(cb), removeEventListener: (_, cb) => listeners.delete(cb) });
  if (!unsupported) window.IntersectionObserver = class {
    constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
    observe(target) { if (broken) throw new Error('Observer unavailable'); this.targets.add(target); }
    unobserve(target) { this.targets.delete(target); }
    disconnect() { this.targets.clear(); }
    enter(target, ratio = 1, bottom = 100) { this.callback([{ target, isIntersecting: ratio > 0, intersectionRatio: ratio, boundingClientRect: { bottom } }]); }
  };
  return { dom, root, observers, listeners, find: id => root.querySelector(`#${id}`) };
}

test('Oliva reveals text once, staggers names, and leaves backgrounds and live controls outside the effect', () => {
  const f = fixture();
  const cleanup = observeTextReveals(f.root);
  try {
    assert.equal(f.observers.length, 1);
    const observer = f.observers[0];
    assert.equal(f.root.querySelector('[data-oliva-module="hero_image_1"] [data-oliva-reveal]'), null);
    assert.equal(f.root.querySelector('#hero[data-oliva-reveal], #relief[data-oliva-reveal], [role="status"][data-oliva-reveal], input[data-oliva-reveal]'), null);
    assert.equal(f.find('timer').dataset.olivaReveal, 'pending');
    assert.equal(f.find('timer').querySelector('[data-oliva-reveal]'), null);
    assert.equal(f.find('calendar').dataset.olivaReveal, 'pending');
    assert.equal(f.find('calendar').querySelector('[data-oliva-reveal]'), null);
    assert.deepEqual([...f.find('names').children].map(el => el.style.getPropertyValue('--oliva-reveal-order')), ['0', '1', '2']);
    observer.enter(f.find('quote'), .1);
    assert.equal(f.find('quote').dataset.olivaReveal, 'pending');
    observer.enter(f.find('quote'));
    observer.enter(f.find('names'));
    observer.enter(f.find('timer'));
    assert.ok(!observer.targets.has(f.find('quote')));
    assert.ok([...f.find('names').children].every(el => el.dataset.olivaReveal === 'shown'));
    f.find('timer').querySelector('strong').textContent = '09';
    observer.enter(f.find('quote'), 0);
    assert.equal(f.find('quote').dataset.olivaReveal, 'shown');
    assert.equal(f.find('timer').dataset.olivaReveal, 'shown');
    assert.equal(f.find('closing').dataset.olivaReveal, 'pending');
  } finally { cleanup(); f.dom.window.close(); }
});

test('selected media wait for their own images while text remains independent, and cleanup releases pending loads', () => {
  const f = fixture();
  const cleanup = observeTextReveals(f.root);
  try {
    const observer = f.observers[0];
    for (const id of ['gift', 'outfits', 'palette', 'rear', 'front', 'seal']) assert.ok(observer.targets.has(f.find(id)));
    assert.equal(f.find('rear').querySelector('[data-oliva-reveal]'), null, 'the print is animated once, including its photo and frame');
    observer.enter(f.find('rear'));
    assert.equal(f.find('rear').dataset.olivaReveal, 'pending');
    observer.enter(f.find('closing'));
    assert.equal(f.find('closing').dataset.olivaReveal, 'shown');
    const image = f.find('rear').querySelector('img');
    Object.defineProperty(image, 'complete', { value: true });
    image.dispatchEvent(new f.dom.window.Event('load'));
    assert.equal(f.find('rear').dataset.olivaReveal, 'shown');
    assert.ok(!observer.targets.has(f.find('rear')));
    observer.enter(f.find('seal'));
    Object.defineProperty(f.find('seal'), 'complete', { value: true });
    f.find('seal').dispatchEvent(new f.dom.window.Event('error'));
    assert.equal(f.find('seal').dataset.olivaReveal, 'shown', 'a failed asset does not leave its element hidden');
    observer.enter(f.find('front'));
    cleanup();
    f.find('front').querySelector('img').dispatchEvent(new f.dom.window.Event('load'));
    assert.equal(f.find('front').dataset.olivaReveal, 'shown');
    assert.equal(observer.targets.size, 0);
  } finally { cleanup(); f.dom.window.close(); }
});

test('reduced motion and observer failures never leave unreadable text', () => {
  for (const options of [{ reduced: true }, { unsupported: true }, { broken: true }]) {
    const f = fixture(options);
    try {
      const cleanup = observeTextReveals(f.root);
      assert.equal(f.root.querySelector('[data-oliva-reveal="pending"]'), null);
      cleanup?.();
    } finally { f.dom.window.close(); }
  }
  const f = fixture();
  const cleanup = observeTextReveals(f.root);
  try {
    f.observers[0].enter(f.find('quote'));
    f.listeners.forEach(listener => listener({ matches: true }));
    assert.equal(f.root.querySelector('[data-oliva-reveal="pending"]'), null);
    assert.equal(f.observers[0].targets.size, 0);
    assert.ok(f.find('quote').hasAttribute('data-oliva-reveal-instant'));
  } finally { cleanup(); assert.equal(f.listeners.size, 0); f.dom.window.close(); }
});

test('keyboard focus, skipped blocks and cleanup reveal immediately without replaying completed text', () => {
  const f = fixture();
  const cleanup = observeTextReveals(f.root);
  try {
    f.find('map').focus();
    assert.equal(f.find('map').dataset.olivaReveal, 'shown');
    assert.ok(f.find('map').hasAttribute('data-oliva-reveal-instant'));
    f.observers[0].enter(f.find('quote'), 0, -100);
    assert.equal(f.find('quote').dataset.olivaReveal, 'shown');
    cleanup();
    assert.equal(f.root.querySelector('[data-oliva-reveal="pending"]'), null);
    assert.equal(f.observers[0].targets.size, 0);
    const cleanAgain = observeTextReveals(f.root);
    assert.equal(f.observers[1].targets.size, 0);
    cleanAgain();
  } finally { cleanup(); f.dom.window.close(); }
});
