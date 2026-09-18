const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const babel = require('@babel/core');

// Compile the actual resolvers/views for SSR without starting Next or writing a build.
const root = path.resolve(__dirname, '..');
const originalJS = Module._extensions['.js'];
const originalResolve = Module._resolveFilename;
Module._resolveFilename = function (request, ...args) {
  return originalResolve.call(this, request.startsWith('@/') ? path.join(root, request.slice(2)) : request, ...args);
};
Module._extensions['.js'] = (module, filename) => {
  if (!filename.startsWith(path.join(root, 'components') + path.sep)) return originalJS(module, filename);
  const { code } = babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, babelrc: false, configFile: false,
    presets: [[require.resolve('@babel/preset-react'), { runtime: 'automatic' }]],
    plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  });
  module._compile(code, filename);
};
for (const ext of ['.scss', '.css']) {
  Module._extensions[ext] = (module, filename) => {
    const keys = [...fs.readFileSync(filename, 'utf8').matchAll(/\.([A-Za-z][\w-]*)/g)].map((match) => match[1]);
    module.exports = Object.fromEntries(keys.map((key) => [key, key]));
  };
}
for (const ext of ['.png', '.jpg', '.jpeg', '.webp', '.svg']) Module._extensions[ext] = (module, filename) => { module.exports = filename; };

const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const { buildResolvedModules, resolveModuleDataByTemplate } = require('../components/invitaciones-publicas/registry/moduleDataResolvers');
const templates = Object.fromEntries(['classic', 'terracota', 'oliva'].map((key) => [
  `wedding_${key}`, require(`../components/invitaciones-publicas/templates/wedding-${key}`),
]));
const payload = {
  evento: { nombre: 'Pareja de prueba', imagenPrincipal: '/event.webp' },
  invitacion: {
    nombreEvento: 'Pareja de prueba', label: 'Familia de prueba',
    fechaHoraCeremonia: '2030-11-28T20:00:00.000Z', fechaHoraRecepcion: '2030-11-29T21:30:00.000Z',
    lugarCeremonia: 'Capilla de prueba', lugarRecepcion: 'Salón de prueba',
    ceremonyMapUrl: 'https://maps.example/ceremony', receptionMapUrl: 'https://maps.example/reception',
  },
  invitadoActual: { nombre: 'Invitado de prueba' }, listaInvitados: [],
};
const configs = {
  envelop_intro: { brideName: 'Ana', groomName: 'Luis' },
  hero_image_1: { text1: 'Hero configurado', backgroundImage: '/background.webp', logoImage: '/logo.png' },
  hero_image_2: { coupleNames: 'Nombres configurados', backgroundImage: '/background.webp', imageSrc: '/couple.webp' },
  simple_image: { imageSrc: '/simple.webp', alt: 'Foto configurada' },
  biblical_quote: { passageText: 'Pasaje configurado', passageReference: 'Referencia configurada' },
  countdown_image: { backgroundImage: '/countdown.webp', enableConfetti: false },
  parallax_image_date: { backgroundImage: '/parallax.webp' },
  dresscode: { attireLabel: 'Vestimenta configurada', imageSrc: '/attire.webp', suggestedColors: ['#123456'] },
  gift_envelopes: { imageSrc: '/gift.webp', leadText: 'Regalo configurado' },
  adults_only_notice: { title: 'Aviso configurado', text: 'Texto del aviso' },
  closing_message: { message: 'CIERRE_CONFIGURADO' },
  welcome_message: { title: 'Bienvenida configurada', subtitle: 'Introducción configurada' },
  music_player: { audioSrc: '/music.mp3', title: 'Canción configurada' },
  photo_slider: { images: ['/photo.webp'] },
  image_slider_sepia: { title: 'Galería configurada', images: ['/sepia.webp'] },
  countdown: { title: 'Contador configurado' },
  couple_family: { coupleLabel: 'Presentación de familia configurada', parentsBride: ['Madre de prueba'], godparents: [{ name: 'Padrino de prueba', isDeceased: true }] },
  couple_names: { brideName: 'Novia configurada', groomName: 'Novio configurado' },
  save_the_date_calendar: { message: 'Reserva configurada' },
  event_details: { ceremonyAddress: 'Dirección de ceremonia', receptionAddress: 'Dirección de recepción', ceremonyMessage: 'Frase de ceremonia', receptionMessage: 'Frase de recepción', ceremonyMapUrl: 'https://maps.example/legacy' },
  attendance_confirm: { title: 'Asistencia configurada', helperText: 'Frase de asistencia\nInstrucciones configuradas' },
};
const modules = Object.entries(configs).map(([type, config], index) => ({ type, config, enabled: true, order: index + 1 }));
const attendanceState = { guests: [], options: [], closed: false };
const render = (key, input) => renderToStaticMarkup(React.createElement(templates[key].default, {
  resolvedModules: buildResolvedModules(input, { ...payload, evento: { ...payload.evento, templateKey: key } }, key), attendanceState,
}));

test('optional section backgrounds render for every module in all templates without changing resolved content', () => {
  const { JSDOM } = require('jsdom');
  for (const key of Object.keys(templates)) {
    for (const module of modules) {
      const withBackground = { ...module, config: { ...module.config, sectionBackground: { imageSrc: '/event-garden.png', overlayOpacity: .78 } } };
      assert.deepEqual(resolveModuleDataByTemplate(withBackground, payload, key), resolveModuleDataByTemplate(module, payload, key));
      const dom = new JSDOM(render(key, [withBackground]));
      const surface = dom.window.document.querySelector('[data-section-background]');
      assert.ok(surface, `${key}/${module.type} supports the common background`);
      assert.equal(surface.dataset.sectionBackground, '/event-garden.png');
      assert.equal(surface.style.getPropertyValue('--module-background-opacity'), '0.78');
      assert.ok(!render(key, [module]).includes('data-section-background'));
      assert.ok(!render(key, [{ ...withBackground, enabled: false }]).includes('data-section-background'));
      dom.window.close();
    }
    const names = modules.find(m => m.type === 'couple_names');
    const legacy = render(key, [names]);
    assert.equal(render(key, [{ ...names, config: { ...names.config, sectionBackground: { imageSrc: '' } } }]), legacy);
    assert.equal(render(key, [{ ...names, config: { ...names.config, sectionBackground: { imageSrc: 'javascript:alert(1)' } } }]), legacy);
    assert.equal(render(key, [{ ...names, config: { ...names.config, backgroundImage: '/legacy.png' } }]), legacy);
  }
});

test('section backgrounds validate sources and preserve zero/full overlay opacity', () => {
  const { normalizeSectionBackground: normalize } = require('../components/invitaciones-publicas/ModuleSurface');
  for (const value of [null, [], {}, { imageSrc: '//example.com/a.png' }, { imageSrc: 'data:text/html,bad' }, { imageSrc: 'file:///a.png' }, { imageSrc: '/a\\b.png' }]) assert.equal(normalize(value), null);
  assert.deepEqual(normalize({ imageSrc: ' /garden.png ', overlayOpacity: 0 }), { imageSrc: '/garden.png', overlayOpacity: 0 });
  assert.equal(normalize({ imageSrc: 'https://example.com/a.png', overlayOpacity: 1 }).overlayOpacity, 1);
  assert.equal(normalize({ imageSrc: '/a.png', overlayOpacity: -2 }).overlayOpacity, 0);
  assert.equal(normalize({ imageSrc: '/a.png', overlayOpacity: 2 }).overlayOpacity, 1);
  assert.equal(normalize({ imageSrc: '/a.png', overlayOpacity: 'bad' }).overlayOpacity, .8);
});

test('dresscode mixes legacy color codes and image URLs in every template with labels and optional crops', () => {
  const input = { type: 'dresscode', config: {
    title: 'Vestuario elegido', imageSrc: '/group.png',
    suggestedColorsTitle: 'Paleta del evento', avoidedColorsTitle: 'Reservado',
    suggestedColors: ['#123456', 'https://example.com/fabric.jpg', { imageSrc: '/swatches.png', label: 'Canela', crop: { x: 50, y: 70, width: 10, height: 20 } }],
    avoidedColors: [{ color: '#FFFFFF', label: 'Blanco' }],
  } };
  const { JSDOM } = require('jsdom');
  for (const key of Object.keys(templates)) {
    const data = resolveModuleDataByTemplate(input, { ...payload, evento: { ...payload.evento, templateKey: key } }, key);
    assert.deepEqual(data.suggestedColors, input.config.suggestedColors);
    const dom = new JSDOM(render(key, [input]));
    const section = dom.window.document.querySelector('[data-dresscode]');
    assert.equal(section.querySelectorAll('[data-dresscode-palette="suggested"] [role="img"]').length, 3);
    assert.equal(section.querySelectorAll('[data-dresscode-palette="suggested"] img').length, 2);
    assert.equal(section.querySelector('[aria-label="Canela"]').style.getPropertyValue('--swatch-image-x'), '-500%');
    assert.equal(section.querySelector('[aria-label="Blanco"]').textContent, '×');
    assert.match(section.textContent, /Paleta del evento/);
    assert.match(section.textContent, /Reservado/);
    const empty = render(key, [{ type: 'dresscode', config: { title: 'Solo título', suggestedColors: [], avoidedColors: [] } }]);
    assert.match(empty, /Solo título/);
    assert.ok(!empty.includes('Paleta de colores sugerida'));
    assert.ok(!empty.includes('Evita estos colores'));
    const legacy = render(key, [{ type: 'dresscode', config: { suggestedColors: ['#123456'], avoidedColors: ['#FFFFFF'] } }]);
    assert.match(legacy, /background:#123456/);
    assert.match(legacy, /Paleta de colores sugerida/);
    assert.match(legacy, /Evita estos colores/);
    const hiddenTitles = render(key, [{ ...input, config: { ...input.config, suggestedColorsTitle: '', avoidedColorsTitle: '' } }]);
    assert.ok(!hiddenTitles.includes('Paleta de colores sugerida'));
    assert.ok(!hiddenTitles.includes('Evita estos colores'));
    dom.window.close();
  }
});

test('dresscode normalizes optional swatch metadata and refuses unsafe image schemes or invalid crop geometry', () => {
  const { normalizeDressCodePalette } = require('../components/invitaciones-publicas/modules/dressCodePalette');
  assert.deepEqual(normalizeDressCodePalette(null), []);
  assert.deepEqual(normalizeDressCodePalette([' #ABC ', null, 42, {}, 'javascript:alert(1)', { imageSrc: 'data:text/html,bad' }]), ['#ABC']);
  for (const crop of [{ x: -1, y: 0, width: 10, height: 10 }, { x: 95, y: 0, width: 10, height: 10 }, { x: 0, y: 0, width: 0, height: 10 }]) {
    assert.deepEqual(normalizeDressCodePalette([{ imageSrc: '/fabric.png', label: ' Tela ', crop }]), [{ imageSrc: '/fabric.png', label: 'Tela' }]);
  }
});

test('attendance preserves guest selections, callbacks, pending/closed states and feedback across templates', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="attendance-test"></div>');
  const saved = Object.fromEntries(['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const { createRoot } = require('react-dom/client');
  const element = document.getElementById('attendance-test');
  const root = createRoot(element);
  try {
    for (const key of Object.keys(templates)) {
      const calls = [];
      const state = {
        guests: [{ id: 42, nombre: 'Invitada con nombre configurado', principal: true, confirmado: 2 }],
        options: [{ value: 1, label: 'Asistiré' }, { value: 2, label: 'Quizá' }, { value: 3, label: 'No asistiré' }],
        closed: false, isSavingGuest: () => false,
        onChange: (_event, id, value) => calls.push([id, value]),
      };
      const data = { title: 'Confirmación elegida', helperText: 'Instrucciones desde datos', deadline: '2030-11-19T05:00:00Z' };
      const draw = async (nextState) => React.act(async () => root.render(React.createElement(templates[key].MODULE_COMPONENTS.attendance_confirm, { data, styles: {}, attendanceState: nextState })));
      await draw(state);
      assert.ok(element.textContent.includes(state.guests[0].nombre));
      assert.ok(element.textContent.includes(data.helperText));
      assert.equal(element.querySelector('input:checked').id, 'attendance-42-2');
      assert.equal(element.querySelectorAll('input:disabled').length, 0);
      await React.act(async () => element.querySelector('#attendance-42-1').click());
      assert.deepEqual(calls, [[42, 1]]);
      await draw({ ...state, isSavingGuest: () => true });
      assert.equal(element.querySelectorAll('input:disabled').length, 3);
      await draw({ ...state, closed: true, feedback: { 42: { error: true, message: 'No fue posible guardar' } } });
      assert.equal(element.querySelectorAll('input:disabled').length, 3);
      assert.match(element.querySelector('[role="status"]').textContent, /plazo/);
      assert.equal(element.querySelector('[role="alert"]').textContent, 'No fue posible guardar');
      if (key === 'wedding_oliva') assert.match(element.textContent, /Confirma hasta el 18 de noviembre de 2030/);
    }
  } finally {
    await React.act(async () => root.unmount());
    dom.window.close();
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  }
});

test('countdown date is opt-in across templates, follows its target and handles invalid dates safely', () => {
  for (const key of Object.keys(templates)) {
    const input = { type: 'countdown', config: { title: 'Título elegido' } };
    for (const showDate of [undefined, false, 'false']) {
      const module = { ...input, config: { ...input.config, showDate } };
      assert.equal(resolveModuleDataByTemplate(module, payload, key).showDate, false);
      assert.ok(!render(key, [module]).includes('data-countdown-date'));
    }
    const module = { ...input, config: { ...input.config, showDate: true, target: 'fechaHoraRecepcion' } };
    assert.match(render(key, [module]), /data-countdown-date="true"/);
    assert.match(render(key, [module]), /aria-label="viernes, 29 de noviembre de 2030"/);
    for (const date of [null, 'invalid-date']) {
      const data = resolveModuleDataByTemplate(input, { invitacion: { fechaHoraCeremonia: date } }, key);
      assert.equal(data.targetDate, null);
      assert.equal(renderToStaticMarkup(React.createElement(templates[key].MODULE_COMPONENTS.countdown, { data, styles: {} })), '');
    }
  }
  const { default: CountdownDate } = require('../components/invitaciones-publicas/module-views/CountdownDate');
  const html = renderToStaticMarkup(React.createElement(CountdownDate, { value: '2027-01-01T02:00:00Z', styles: {} }));
  assert.match(html, /jueves, 31 de diciembre de 2026/);
});

test('calendar uses the event date and configured message; Oliva uses an outlined event-day marker', () => {
  const event = { invitacion: { fechaHoraCeremonia: '2026-11-28T20:00:00Z' } };
  for (const key of Object.keys(templates)) {
    const data = resolveModuleDataByTemplate({ type: 'save_the_date_calendar', config: { message: 'Día elegido' } }, event, key);
    const html = renderToStaticMarkup(React.createElement(templates[key].MODULE_COMPONENTS.save_the_date_calendar, { data, styles: {} }));
    assert.match(html, /Día elegido/);
    assert.match(html, /28 de noviembre de 2026, fecha del evento/);
    assert.equal((html.match(/data-event-day="true"/g) || []).length, 1);
    assert.ok(!html.includes('El gran día'));
    if (key === 'wedding_oliva') {
      assert.match(html, />SÁB<\/span>/);
      assert.match(html, /fill="none"/);
    }
  }
});

test('countdown completes at the actual target time and releases its interval', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="countdown-test"></div>');
  const saved = Object.fromEntries(['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  const originalNow = Date.now;
  let now = Date.parse('2030-01-01T00:00:00Z') - 500;
  let tick;
  let cleared = false;
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  Date.now = () => now;
  window.setInterval = (callback) => { tick = callback; return 123; };
  window.clearInterval = (id) => { cleared = id === 123; };
  const { createRoot } = require('react-dom/client');
  const { default: CountdownView } = require('../components/invitaciones-publicas/module-views/CountdownView');
  const element = document.getElementById('countdown-test');
  const root = createRoot(element);
  try {
    await React.act(async () => root.render(React.createElement(CountdownView, { styles: {}, data: { targetDate: '2030-01-01T00:00:00Z', message: 'Esperando', completedMessage: 'Llegó' } })));
    assert.ok(element.textContent.includes('Esperando'));
    assert.ok(!element.textContent.includes('Llegó'));
    now += 500;
    await React.act(async () => tick());
    assert.ok(element.textContent.includes('Llegó'));
    assert.ok(!element.textContent.includes('Esperando'));
  } finally {
    await React.act(async () => root.unmount());
    Date.now = originalNow;
    dom.window.close();
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  }
  assert.ok(cleared);
});

test('names-only module preserves configured names across templates, stays empty without data and never adds copy', () => {
  for (const key of Object.keys(templates)) {
    const module = { type: 'couple_names', order: 6, config: { brideName: ' Ana María ', groomName: 'José Luis' } };
    assert.deepEqual(resolveModuleDataByTemplate(module, payload, key), { brideName: 'Ana María', groomName: 'José Luis' });
    const html = render(key, [module]);
    assert.match(html, /aria-label="Ana María &amp; José Luis"/);
    assert.match(html, />Ana María<\/span>/);
    assert.match(html, />José Luis<\/span>/);
    assert.match(html, />&amp;<\/span>/);
    for (const copy of ['Mayra', 'Samuel', 'Pareja de prueba', 'Nos casamos', 'noviembre']) assert.ok(!html.includes(copy));
    assert.equal(buildResolvedModules([{ ...module, config: {} }], payload, key).length, 0);
    assert.equal(buildResolvedModules([{ ...module, config: { brideName: ' ', groomName: '' } }], payload, key).length, 0);
    assert.equal(buildResolvedModules([{ ...module, enabled: false }], payload, key).length, 0);
    const single = render(key, [{ ...module, config: { brideName: 'Ana' } }]);
    assert.match(single, /aria-label="Ana"/);
    assert.ok(!single.includes('&amp;'));
    const escaped = render(key, [{ ...module, config: { brideName: '<script>prueba</script>', groomName: 'José' } }]);
    assert.ok(!escaped.includes('<script>'));
  }
});

test('envelope image and video fields are shared; legacy cards keep their original covers', () => {
  const config = { ...configs.envelop_intro, backgroundSrc: '/portrait.jpg', backgroundDesktopSrc: '/wide.jpg', backgroundVideoSrc: ' /loop.mp4 ' };
  const results = Object.keys(templates).map((key) => resolveModuleDataByTemplate({ type: 'envelop_intro', config }, payload, key));
  assert.deepEqual(results[0], results[1]);
  assert.deepEqual(results[0], results[2]);
  assert.equal(results[0].backgroundVideoSrc, '/loop.mp4');
  for (const key of Object.keys(templates)) {
    const legacy = render(key, [{ type: 'envelop_intro', config: configs.envelop_intro }]);
    assert.ok(!legacy.includes('data-envelope-background'), key);
    assert.ok(!legacy.includes('envelopIntroWithBackground'), key);
    const image = render(key, [{ type: 'envelop_intro', config: { ...config, backgroundVideoSrc: '' } }]);
    assert.match(image, /src="\/portrait.jpg"/);
    assert.match(image, /srcSet="\/wide.jpg"/);
    assert.ok(!image.includes('<video'), key);
  }
});

test('all envelope views play muted inline video, retain image on error, and honor reduced motion', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="test-root"></div>', { url: 'http://localhost' });
  const saved = Object.fromEntries(['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'].map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const listeners = new Set();
  let reduce = false;
  window.matchMedia = () => ({ get matches() { return reduce; }, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) });
  const { createRoot } = require('react-dom/client');
  const { act } = React;
  const rootElement = document.getElementById('test-root');
  const testRoot = createRoot(rootElement);
  const EnvelopeBackground = require('../components/invitaciones-publicas/module-views/EnvelopeBackground').default;
  try {
    for (const [key, template] of Object.entries(templates)) {
      const data = resolveModuleDataByTemplate({ type: 'envelop_intro', config: { ...configs.envelop_intro, backgroundSrc: '/fallback.jpg', backgroundVideoSrc: `/${key}.mp4` } }, payload, key);
      const viewStyles = new Proxy({}, { get: (_, name) => String(name) });
      await act(async () => testRoot.render(React.createElement(template.MODULE_COMPONENTS.envelop_intro, { data, styles: viewStyles })));
      let video = rootElement.querySelector('video');
      assert.ok(video, key);
      assert.equal(video.getAttribute('src'), `/${key}.mp4`);
      assert.ok(video.autoplay && video.loop && video.muted && video.playsInline, key);
      assert.equal(video.controls, false);
      assert.ok(rootElement.querySelector('picture img[src="/fallback.jpg"]'));
      await act(async () => video.dispatchEvent(new window.Event('playing')));
      assert.ok(video.classList.contains('playing'));
      await act(async () => { reduce = true; listeners.forEach((fn) => fn()); });
      assert.equal(rootElement.querySelector('video'), null);
      await act(async () => { reduce = false; listeners.forEach((fn) => fn()); });
      video = rootElement.querySelector('video');
      await act(async () => video.dispatchEvent(new window.Event('error')));
      assert.equal(rootElement.querySelector('video'), null);
      assert.ok(rootElement.querySelector('picture img[src="/fallback.jpg"]'));
    }
    await act(async () => testRoot.render(React.createElement(EnvelopeBackground, { data: { backgroundVideoSrc: '/active.mp4', backgroundSrc: '/fallback.jpg' } })));
    assert.ok(rootElement.querySelector('video'));
    await act(async () => testRoot.render(React.createElement(EnvelopeBackground, { active: false, data: { backgroundVideoSrc: '/active.mp4', backgroundSrc: '/fallback.jpg' } })));
    assert.equal(rootElement.querySelector('video'), null);
  } finally {
    await act(async () => testRoot.unmount());
    assert.equal(listeners.size, 0);
    dom.window.close();
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});

test('temporary Oliva lift reveals the hero below, opens once, restores scrolling and skips reduced motion', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="trial-test"></div>', { url: 'http://localhost' });
  const globals = ['window', 'document', 'Event', 'requestAnimationFrame', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = Object.fromEntries(globals.map((key) => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  globalThis.Event = window.Event; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const frames = [], timers = new Map(); let nextTimer = 0, reduce = false, opens = 0;
  globalThis.requestAnimationFrame = (fn) => frames.push(fn);
  window.scrollTo = () => {};
  window.setTimeout = (fn, delay) => { const id = ++nextTimer; timers.set(id, { fn, delay }); return id; };
  window.clearTimeout = (id) => timers.delete(id);
  window.matchMedia = () => ({ matches: reduce, addEventListener() {}, removeEventListener() {} });
  window.addEventListener('envelopIntro:open', () => { opens += 1; });
  const testRoot = require('react-dom/client').createRoot(document.getElementById('trial-test'));
  const fixture = [{ type: 'envelop_intro', config: configs.envelop_intro }, { type: 'hero_image_1', config: configs.hero_image_1 }];
  const mount = (key) => testRoot.render(React.createElement(templates.wedding_oliva.default, { key, resolvedModules: buildResolvedModules(fixture, payload, 'wedding_oliva'), attendanceState }));
  const tick = async (delay) => React.act(async () => { for (const [id, timer] of [...timers]) if (timer.delay === delay) { timers.delete(id); timer.fn(); } });
  try {
    document.body.style.overflow = 'clip';
    await React.act(async () => mount('normal'));
    const button = document.querySelector('button[aria-label^="Abrir invitación"]');
    button.getBoundingClientRect = () => ({ left: 16, top: 320 });
    button.style.setProperty('--oliva-paper', '#f8f5ed');
    await React.act(async () => { button.click(); button.click(); });
    assert.equal(opens, 1, 'music receives the original user gesture exactly once');
    assert.equal(button.disabled, true);
    assert.ok(document.querySelector('[data-envelope-lift-trial]'));
    assert.equal(document.querySelector('[data-envelope-light-trial]'), null);
    assert.equal(document.body.style.overflow, 'hidden');
    assert.equal(document.querySelector('.paper').hidden, false);
    assert.ok(document.querySelector('.paper').hasAttribute('inert'));
    await tick(2000);
    assert.equal(document.querySelector('.paper').hidden, false);
    assert.equal(document.querySelector('button[aria-label^="Abrir invitación"]'), null);
    frames.splice(0).forEach((fn) => fn());
    assert.ok(document.activeElement.hasAttribute('data-oliva-title'));
    assert.equal(document.querySelector('[data-envelope-lift-trial]'), null);
    assert.equal(document.querySelector('.paper').hasAttribute('inert'), false);
    assert.equal(document.body.style.overflow, 'clip');
    reduce = true;
    await React.act(async () => mount('reduced'));
    await React.act(async () => document.querySelector('button[aria-label^="Abrir invitación"]').click());
    assert.equal(document.querySelector('[data-envelope-lift-trial]'), null);
    assert.equal(document.querySelector('.paper').hidden, false);
    assert.equal(opens, 2);
    reduce = false;
    await React.act(async () => mount('cancelled'));
    await React.act(async () => document.querySelector('button[aria-label^="Abrir invitación"]').click());
    await React.act(async () => testRoot.render(null));
    assert.equal(timers.size, 0);
    assert.equal(document.body.style.overflow, 'clip');
  } finally {
    await React.act(async () => testRoot.unmount()); dom.window.close();
    for (const [key, descriptor] of Object.entries(saved)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor); else delete globalThis[key];
    }
  }
});

test('Oliva hero keeps event identity accessible when the configured logo replaces visible names', () => {
  const input = [{ type: 'hero_image_1', config: configs.hero_image_1, order: 1 }];
  const html = render('wedding_oliva', input);
  assert.match(html, /<h1[^>]*data-oliva-title[^>]*><img[^>]*src="\/logo.png"[^>]*alt="Pareja de prueba"/);
  assert.ok(html.includes('/background.webp'));
  assert.ok(html.includes('Hero configurado'));
  assert.ok(html.includes('28 de noviembre de 2030'));
  assert.ok(!html.includes('floral-garland'));
  const withoutLogo = render('wedding_oliva', [{ ...input[0], config: { text1: '' } }]);
  assert.match(withoutLogo, /<span class="names">Pareja de prueba<\/span>/);
  assert.ok(!withoutLogo.includes('Monograma del evento'));
  assert.ok(!withoutLogo.includes('Nos casamos'));
});

test('quotes omit empty references and retain configured references across all templates', () => {
  for (const key of Object.keys(templates)) {
    const input = [{ type: 'biblical_quote', enabled: true, order: 3, config: { passageText: 'Frase del evento', passageReference: '' } }];
    const withoutReference = render(key, input);
    assert.ok(withoutReference.includes('Frase del evento'), key);
    assert.ok(!withoutReference.includes('class="biblicalQuoteReference"'), key);
    assert.ok(!withoutReference.includes('class="moduleLead"'), key);
    const withReference = render(key, [{ ...input[0], config: { ...input[0].config, passageReference: 'Referencia elegida' } }]);
    assert.match(withReference, /class="biblicalQuoteReference">Referencia elegida<\/p>/);
    const empty = buildResolvedModules([{ ...input[0], config: { passageText: '', passageReference: '' } }], payload, key);
    assert.equal(empty.length, 0, key);
  }
});

test('the same hero config resolves to the same contract in every template', () => {
  for (const type of ['hero_image_1', 'hero_image_2']) {
    const data = Object.keys(templates).map((key) => resolveModuleDataByTemplate({ type, config: configs[type] }, payload, key));
    assert.deepEqual(data[0], data[1]);
    assert.deepEqual(data[0], data[2]);
    if (type === 'hero_image_1') assert.deepEqual(Object.keys(data[0]).sort(), ['backgroundImage', 'logoImage', 'text1', 'text2', 'text3']);
  }
});

for (const key of Object.keys(templates)) {
  test(`${key}: every catalog module resolves and has a view`, () => {
    const resolved = buildResolvedModules(modules, { ...payload, evento: { ...payload.evento, templateKey: key } }, key);
    assert.equal(resolved.length, modules.length);
    for (const module of resolved) assert.equal(typeof templates[key].MODULE_COMPONENTS[module.type], 'function', module.type);
  });
  test(`${key}: shared content, dates, maps and media survive a template change`, () => {
    const html = render(key, modules.filter((module) => !['envelop_intro', 'music_player'].includes(module.type)));
    for (const value of ['Hero configurado', '/background.webp', '/logo.png', '/couple.webp', '/attire.webp', 'Introducción configurada', 'Presentación de familia configurada', 'Madre de prueba', 'Padrino de prueba', 'Frase de ceremonia', 'Frase de recepción', 'Dirección de ceremonia', 'Dirección de recepción', 'https://maps.example/ceremony', 'https://maps.example/reception', '29 de noviembre', 'Frase de asistencia', 'Instrucciones configuradas', 'CIERRE_CONFIGURADO', 'Reserva configurada', 'Pasaje configurado', 'Vestimenta configurada', 'Regalo configurado', 'Texto del aviso', 'Galería configurada']) {
      assert.ok(html.includes(value), `Missing ${value}`);
    }
    assert.ok(!html.includes('https://maps.example/legacy'), 'canonical locations take precedence');
  });
  test(`${key}: closing honors enabled/order and needs no frame image`, () => {
    const input = [
      { type: 'hero_image_1', config: configs.hero_image_1, order: 2 },
      { type: 'closing_message', config: configs.closing_message, order: 1 },
    ];
    const html = render(key, input);
    assert.ok(html.indexOf('CIERRE_CONFIGURADO') < html.indexOf('Hero configurado'));
    assert.ok(!render(key, input.map((module) => module.type === 'closing_message' ? { ...module, enabled: false } : module)).includes('CIERRE_CONFIGURADO'));
  });
}

test('legacy location links remain usable and empty optional heroes do not disappear', () => {
  const data = resolveModuleDataByTemplate({ type: 'event_details', config: configs.event_details }, { invitacion: {} }, 'wedding_oliva');
  assert.equal(data.ceremonyMapUrl, 'https://maps.example/legacy');
  for (const key of Object.keys(templates)) {
    assert.ok(resolveModuleDataByTemplate({ type: 'hero_image_1', config: {} }, { evento: { nombre: 'Solo nombres' } }, key));
  }
});

test('SEO share artwork is never inferred as a hero background; empty backgrounds remain empty', () => {
  const withPoster = { ...payload, evento: { ...payload.evento, seo: { image: '/poster-with-baked-text.png' }, imagenPrincipal: '/event-poster.png' } };
  for (const key of Object.keys(templates)) {
    for (const type of ['hero_image_1', 'hero_image_2']) {
      const automatic = resolveModuleDataByTemplate({ type, config: {} }, withPoster, key);
      assert.ok(!['/poster-with-baked-text.png', '/event-poster.png'].includes(automatic.backgroundImage));
      const empty = resolveModuleDataByTemplate({ type, config: { backgroundImage: '' } }, withPoster, key);
      assert.equal(empty.backgroundImage, '');
      assert.equal(resolveModuleDataByTemplate({ type, config: { backgroundImage: '/chosen-background.png' } }, withPoster, key).backgroundImage, '/chosen-background.png');
    }
  }
});

test('custom editorial fields survive switching templates and empty fields do not inject copy', () => {
  const copy = {
    couple_family: { title: 'Titulo familiar del cliente' },
    event_details: { title: 'Titulo de lugares del cliente' },
    countdown: { message: 'Mensaje de espera del cliente', completedMessage: 'Mensaje final del cliente' },
    countdown_image: { title: 'Titulo contador con foto del cliente' },
    dresscode: { title: 'Titulo vestuario del cliente', message: 'Mensaje vestuario del cliente' },
    gift_envelopes: { title: 'Titulo regalos del cliente' },
    photo_slider: { title: 'Titulo galeria del cliente' },
  };
  for (const key of Object.keys(templates)) {
    const input = Object.entries(copy).map(([type, fields], index) => ({ type, order: index, config: { ...configs[type], ...fields } }));
    const html = render(key, input);
    for (const fields of Object.values(copy)) {
      for (const [field, value] of Object.entries(fields)) if (field !== 'completedMessage') assert.ok(html.includes(value), `${key}: ${value}`);
    }
    const cleared = input.map((module) => ({ ...module, config: { ...module.config, ...Object.fromEntries(Object.keys(copy[module.type]).map((field) => [field, ''])) } }));
    const clearedHtml = render(key, cleared);
    for (const phrase of ['Nuestras raíces', 'El día que soñamos', 'Nos encantará verte', 'Cada instante nos acerca', 'Queremos que cada uno', 'Nuestra historia en imagenes', 'Nos casamos en...']) assert.ok(!clearedHtml.includes(phrase), `${key}: fixed copy ${phrase}`);
    for (const fields of Object.values(copy)) for (const value of Object.values(fields)) assert.ok(!clearedHtml.includes(value));
    const data = resolveModuleDataByTemplate({ type: 'save_the_date_calendar', config: { message: '' } }, payload, key);
    assert.equal(data.message, '');
  }
});
