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
  save_the_date_calendar: { message: 'Reserva configurada' },
  event_details: { ceremonyAddress: 'Dirección de ceremonia', receptionAddress: 'Dirección de recepción', ceremonyMessage: 'Frase de ceremonia', receptionMessage: 'Frase de recepción', ceremonyMapUrl: 'https://maps.example/legacy' },
  attendance_confirm: { title: 'Asistencia configurada', helperText: 'Frase de asistencia\nInstrucciones configuradas' },
};
const modules = Object.entries(configs).map(([type, config], index) => ({ type, config, enabled: true, order: index + 1 }));
const attendanceState = { guests: [], options: [], closed: false };
const render = (key, input) => renderToStaticMarkup(React.createElement(templates[key].default, {
  resolvedModules: buildResolvedModules(input, { ...payload, evento: { ...payload.evento, templateKey: key } }, key), attendanceState,
}));

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
