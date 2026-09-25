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
const templates = Object.fromEntries(['classic', 'terracota', 'oliva', 'lemoncello'].map((key) => [
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
  recommendations: { title: 'Hospedaje', text1: 'Una opción cercana', text2: 'Hotel\n[318 393 1186](https://wa.me/573183931186)', imageSrc: '/hotel.webp', imageAlt: 'Hotel en acuarela', linkUrl: 'https://hoteldescansoreal.com/', linkLabel: 'Ver web' },
  adults_only_notice: { title: 'Aviso configurado', text: 'Texto del aviso' },
  closing_message: { message: 'CIERRE_CONFIGURADO' },
  welcome_message: { title: 'Bienvenida configurada', subtitle: 'Introducción configurada' },
  music_player: { audioSrc: '/music.mp3', title: 'Canción configurada' },
  photo_slider: { images: ['/photo.webp'] },
  instant_photos: { images: [{ imageSrc: '/003.jpeg', imageAlt: 'Foto uno' }, { imageSrc: '/004.jpeg', imageAlt: 'Foto dos' }], sealImageSrc: '/seal.webp', sealImageAlt: 'Monograma MS' },
  image_slider_1: { title: 'Galería configurada', images: ['/sepia.webp'] },
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

test('music starts at presentation readiness, retries blocked gestures and preserves an explicit mute', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="music-test"></div>', { url: 'http://localhost' });
  const globals = ['window', 'document', 'Event', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = Object.fromEntries(globals.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window; globalThis.document = dom.window.document;
  globalThis.Event = window.Event; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  const mediaState = new WeakMap();
  const state = audio => { if (!mediaState.has(audio)) mediaState.set(audio, { paused: true }); return mediaState.get(audio); };
  let calls = 0, failures = 0;
  Object.defineProperty(window.HTMLMediaElement.prototype, 'paused', { get() { return state(this).paused; } });
  window.HTMLMediaElement.prototype.play = async function () {
    calls++;
    if (failures > 0) { failures--; throw new window.DOMException('Gesture required', 'NotAllowedError'); }
    state(this).paused = false; this.dispatchEvent(new Event('play'));
  };
  window.HTMLMediaElement.prototype.pause = function () { state(this).paused = true; this.dispatchEvent(new Event('pause')); };
  const Music = require('../components/invitaciones-publicas/module-views/MusicPlayerView').default;
  const testRoot = require('react-dom/client').createRoot(document.getElementById('music-test'));
  const data = { audioSrc: '/song.mp3', autoplay: true, initiallyMuted: false };
  const mount = (key, playbackReady, waitForStart = false) => testRoot.render(React.createElement(Music, { key, data, playbackReady, waitForStart, styles: {} }));
  const gesture = name => React.act(async () => window.dispatchEvent(new Event(name)));
  try {
    await React.act(async () => mount('allowed', false));
    assert.equal(calls, 0, 'preloading must not start music underneath the loader');
    assert.equal(document.querySelector('audio').preload, 'auto');
    await React.act(async () => mount('allowed', true));
    assert.equal(calls, 1, 'ready starts music without opening the envelope');
    assert.equal(document.querySelector('button').getAttribute('aria-label'), 'Silenciar sonido');
    const audio = document.querySelector('audio');
    audio.currentTime = 18;
    await React.act(async () => document.querySelector('button').click());
    assert.equal(audio.muted, true);
    await gesture('pointerup');
    await gesture('envelopIntro:open');
    assert.equal(audio.muted, true, 'opening and navigation preserve a chosen mute');
    await React.act(async () => document.querySelector('button').click());
    assert.equal(audio.muted, false);
    assert.equal(audio.currentTime, 18, 'toggling does not restart the track');

    failures = 2;
    const before = calls;
    await React.act(async () => mount('blocked', true));
    assert.equal(calls, before + 1);
    assert.equal(document.querySelector('button').getAttribute('aria-label'), 'Activar sonido');
    await gesture('pointerup');
    assert.equal(calls, before + 2);
    await gesture('touchend');
    assert.equal(calls, before + 3, 'a failed first gesture does not consume the fallback');
    assert.equal(document.querySelector('button').getAttribute('aria-label'), 'Silenciar sonido');
    await gesture('click');
    assert.equal(calls, before + 3, 'successful playback removes automatic gesture listeners');

    failures = 1;
    await React.act(async () => mount('button', true));
    const buttonCalls = calls;
    await React.act(async () => document.querySelector('button').click());
    assert.equal(calls, buttonCalls + 1, 'the sound button activates once after a blocked autoplay');
    assert.equal(document.querySelector('audio').muted, false);

    const waitingCalls = calls;
    await React.act(async () => mount('start-arrow', true, true));
    await gesture('pointerup'); await gesture('click'); await gesture('keydown');
    assert.equal(calls, waitingCalls, 'the intro arrow gate prevents autoplay and unrelated touches');
    await React.act(async () => window.__invMusicControls.playUnmute());
    assert.equal(calls, waitingCalls + 1, 'the start arrow can play within its original gesture');
    document.querySelector('audio').currentTime = 9;
    await React.act(async () => mount('start-arrow', true, true));
    assert.equal(document.querySelector('audio').currentTime, 9, 'revealing the controls does not remount audio');
    await React.act(async () => testRoot.unmount());
    const lastCalls = calls;
    await gesture('envelopIntro:open'); await gesture('touchend');
    assert.equal(calls, lastCalls);
    assert.equal(window.__invMusicControls, undefined);
  } finally {
    await React.act(async () => testRoot.unmount()); dom.window.close();
    for (const key of globals) { if (saved[key]) Object.defineProperty(globalThis, key, saved[key]); else delete globalThis[key]; }
  }
});

test('recommendations preserve their generic fields and safe contact links across templates', () => {
  const { JSDOM } = require('jsdom');
  const input = [{ type: 'recommendations', config: configs.recommendations }];
  let shared;
  for (const key of Object.keys(templates)) {
    const data = buildResolvedModules(input, payload, key)[0].data;
    if (shared) assert.deepEqual(data, shared); else shared = data;
    const dom = new JSDOM(render(key, input));
    const section = dom.window.document.querySelector('[data-recommendations]');
    assert.equal(section.querySelector('h2').textContent, 'Hospedaje');
    assert.deepEqual([...section.querySelectorAll('a')].map(a => [a.textContent, a.getAttribute('href')]), [
      ['318 393 1186', 'https://wa.me/573183931186'], ['Ver web', 'https://hoteldescansoreal.com/'],
    ]);
    assert.equal(section.querySelector('img').getAttribute('src'), '/hotel.webp');
    dom.window.close();
    assert.equal(buildResolvedModules([{ ...input[0], config: {} }], payload, key).length, 0);
    assert.equal(buildResolvedModules([{ ...input[0], enabled: false }], payload, key).length, 0);
    const unsafe = new JSDOM(render(key, [{ type: 'recommendations', config: {
      text2: '<script>test</script> [contact](javascript:alert) [mail](data:text/html,test)',
      imageSrc: '//external.invalid/image.jpg', linkUrl: 'javascript:alert(1)',
    } }]));
    const unsafeSection = unsafe.window.document.querySelector('[data-recommendations]');
    assert.equal(unsafeSection.querySelectorAll('a,script,img').length, 0);
    assert.ok(unsafeSection.textContent.includes('<script>test</script> contact mail'));
    unsafe.window.close();
  }
});

test('image_slider_1 accepts the legacy name across all templates and preserves every slider setting', () => {
  const config = { title: 'Nuestros recuerdos', images: ['/one.jpg', '/two.jpg'], intervalMs: 4500, imageAdjustments: { 'one.jpg': { positionX: 30, positionY: 60, zoom: 1.2 } }, sectionBackground: { imageSrc: '/garden.png' } };
  for (const key of Object.keys(templates)) {
    const old = { type: 'image_slider_sepia', order: 7, enabled: true, config };
    const next = { ...old, type: 'image_slider_1' };
    assert.deepEqual(buildResolvedModules([old], payload, key), buildResolvedModules([next], payload, key));
    assert.equal(buildResolvedModules([old], payload, key)[0].type, 'image_slider_1');
    assert.equal(render(key, [old]), render(key, [next]));
    assert.deepEqual(resolveModuleDataByTemplate(old, payload, key).imageAdjustments, config.imageAdjustments);
    assert.equal(resolveModuleDataByTemplate(old, payload, key).intervalMs, 4500);
    assert.equal(buildResolvedModules([{ ...old, enabled: false }], payload, key).length, 0);
  }
});

test('instant photos preserve the selected pair and seal across templates without inventing missing photos', () => {
  const { JSDOM } = require('jsdom');
  for (const key of Object.keys(templates)) {
    const input = [{ type: 'instant_photos', config: configs.instant_photos }];
    const dom = new JSDOM(render(key, input));
    const section = dom.window.document.querySelector('[data-instant-photos]');
    assert.deepEqual([...section.querySelectorAll('figure img')].map((img) => [img.getAttribute('src'), img.alt]), [['/003.jpeg', 'Foto uno'], ['/004.jpeg', 'Foto dos']]);
    assert.equal(section.querySelector('img[alt="Monograma MS"]').getAttribute('src'), '/seal.webp');
    for (const image of section.querySelectorAll('img')) assert.equal(image.getAttribute('loading'), 'lazy');
    dom.window.close();
    for (const images of [[], [configs.instant_photos.images[0]], [{ imageSrc: '' }, configs.instant_photos.images[1]]]) {
      assert.equal(buildResolvedModules([{ ...input[0], config: { images } }], payload, key).length, 0);
    }
    assert.ok(!render(key, [{ ...input[0], enabled: false }]).includes('data-instant-photos'));
    assert.ok(!render(key, [{ ...input[0], config: { ...configs.instant_photos, sealImageSrc: '' } }]).includes('/seal.webp'));
  }
});

test('closing can omit custom or default ornaments while keeping the message in every template', () => {
  const { JSDOM } = require('jsdom');
  for (const key of Object.keys(templates)) {
    for (const frameImage of ['', '/custom-floral.webp']) {
      const input = [{ type: 'closing_message', config: { ...configs.closing_message, frameImage, showFrame: false } }];
      const dom = new JSDOM(render(key, input));
      assert.ok(dom.window.document.body.textContent.includes('CIERRE_CONFIGURADO'));
      assert.equal(dom.window.document.querySelectorAll('img:not([data-closing-landscape]), svg').length, 0);
      dom.window.close();
      if (frameImage) assert.ok(render(key, [{ ...input[0], config: { ...input[0].config, showFrame: true } }]).includes(frameImage));
    }
  }
});

test('closing keeps the optional content image separate from its ornamental frame in all templates', () => {
  const { JSDOM } = require('jsdom');
  const module = { type: 'closing_message', config: { message: 'Te esperamos', imageSrc: '/monogram.png', imageAlt: 'Monograma de la pareja', frameImage: '/ornament.png', showFrame: false } };
  const resolved = Object.keys(templates).map(key => resolveModuleDataByTemplate(module, payload, key));
  for (const data of resolved) assert.deepEqual(data, resolved[0]);
  for (const key of Object.keys(templates)) {
    const dom = new JSDOM(render(key, [module]));
    assert.equal(dom.window.document.querySelector('img[alt="Monograma de la pareja"]').getAttribute('src'), '/monogram.png');
    assert.equal(dom.window.document.querySelector('img[src="/ornament.png"]'), null);
    assert.ok(dom.window.document.body.textContent.includes('Te esperamos'));
    dom.window.close();
    assert.equal(buildResolvedModules([{ ...module, config: { ...module.config, message: '' } }], payload, key).length, 0);
  }
});

test('instant photos support optional multiline copy and keep Oliva relief inside their section', () => {
  const { JSDOM } = require('jsdom');
  for (const key of Object.keys(templates)) {
    const config = { ...configs.instant_photos, message: 'Con mucho cariño,\nMayra & Samuel', reliefImageSrc: '/relief.png' };
    const input = [{ type: 'instant_photos', config, order: 1 }, { type: 'closing_message', enabled: false, config: { message: config.message }, order: 2 }];
    const dom = new JSDOM(render(key, input));
    const section = dom.window.document.querySelector('[data-instant-photos]');
    assert.equal(section.querySelector('[data-instant-photos-message]').textContent, config.message);
    assert.equal(dom.window.document.querySelectorAll('[data-instant-photos-message]').length, 1);
    assert.equal(dom.window.document.querySelectorAll('footer').length, 0);
    if (key === 'wedding_oliva') {
      assert.equal(section.querySelectorAll('[data-floral-relief]').length, 1);
      assert.equal(section.querySelector('[data-floral-relief]').getAttribute('aria-hidden'), 'true');
      assert.ok(section.querySelector('[data-floral-relief]').getAttribute('style').includes('/relief.png'));
    } else assert.equal(section.querySelectorAll('[data-floral-relief]').length, 0);
    dom.window.close();
    const empty = render(key, [{ type: 'instant_photos', config: { ...config, message: '', reliefImageSrc: '' } }]);
    assert.ok(!empty.includes('data-instant-photos-message'));
    assert.ok(!empty.includes('data-floral-relief'));
  }
});

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
      if (['wedding_oliva', 'wedding_lemoncello'].includes(key)) assert.match(element.textContent, /Confirma hasta el 18 de noviembre de 2030/);
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
    assert.match(withReference, /<p[^>]*>Referencia elegida<\/p>/);
    const empty = buildResolvedModules([{ ...input[0], config: { passageText: '', passageReference: '' } }], payload, key);
    assert.equal(empty.length, 0, key);
  }
});

test('Lemoncello hero preserves event identity, configured copy and custom media', () => {
  const input = [{ type: 'hero_image_1', config: configs.hero_image_1, order: 1 }];
  const html = render('wedding_lemoncello', input);
  assert.match(html, /<img[^>]*src="\/logo.png"[^>]*alt="Pareja de prueba"/);
  assert.ok(html.includes('/background.webp'));
  assert.ok(html.includes('Hero configurado'));
  assert.ok(html.includes('28 de noviembre de 2030'));
  const withoutLogo = render('wedding_lemoncello', [{ ...input[0], config: { text1: '' } }]);
  assert.match(withoutLogo, /<span class="names">Pareja de prueba<\/span>/);
  assert.ok(!withoutLogo.includes('Nos casamos'));
  assert.ok(!withoutLogo.includes('Laura'));
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
    if (key === 'wedding_lemoncello') {
      // Overlay DOM position is independent of the ordered camera stops.
      const { JSDOM } = require('jsdom');
      const dom = new JSDOM(html);
      assert.equal(dom.window.document.querySelector('[data-module="closing_message"]').dataset.visible, 'true');
      assert.equal(dom.window.document.querySelector('[data-module="hero_image_1"]').getAttribute('aria-hidden'), 'true');
      dom.window.close();
    } else assert.ok(html.indexOf('CIERRE_CONFIGURADO') < html.indexOf('Hero configurado'));
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

test('Lemoncello retains canonical envelope identity and hero/quote data when switching templates', () => {
  const fixture = require('../components/invitaciones-publicas/templates/wedding-lemoncello/preview.json');
  const source = { ...fixture, invitacion: { ...fixture.invitacion, label: 'Familia de prueba con etiqueta dinámica' } };
  const results = Object.keys(templates).map(key => buildResolvedModules(fixture.modules, source, key));
  // Templates may supply different default decorative backgrounds when none is configured.
  const content = result => result.map(({ type, data }) => ({ type, data: type === 'hero_image_1' ? { text1: data.text1, text2: data.text2, text3: data.text3, logoImage: data.logoImage } : data }));
  for (const result of results) assert.deepEqual(content(result), content(results[0]));
  assert.equal(results[0][0].data.invitationLabel, source.invitacion.label);
  assert.equal(results[0][0].data.eventDate, '19.12.26');
  assert.equal(results[0][1].data.text1, 'Nos casamos');
  assert.equal(results[0][1].data.logoImage, '/scrAppaltezza/invitations/bodlauser/cover/laura-sergio-monogram.png');
  assert.deepEqual(results[0].map(module => module.type), ['envelop_intro', 'hero_image_1', 'biblical_quote', 'image_slider_1', 'countdown', 'save_the_date_calendar', 'event_details', 'gift_envelopes', 'recommendations', 'dresscode', 'attendance_confirm', 'closing_message', 'music_player']);
  const quote = results[0].find(module => module.type === 'biblical_quote');
  assert.equal(quote.data.passageReference, '');
  assert.equal(quote.data.passageText, 'Celebramos nuestro amor y queremos compartirlo con nuestras personas favoritas.');
  const { sceneCell } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/SceneCanvas');
  const cells = Array.from({ length: 10 }, (_, i) => sceneCell(i));
  assert.deepEqual(cells[0], { column: 0, row: 0 });
  assert.equal(new Set(cells.map(cell => `${cell.column},${cell.row}`)).size, 10);
  assert.ok(cells.every(cell => cell.row === 0), 'all scene transitions stay horizontal');
  assert.equal(cells[1].column, 2, 'the quote follows the connecting promenade');
  assert.equal(cells[2].column, 4, 'the villa promenade connects quote and photos');
  for (let i = 3; i < cells.length; i++) assert.equal(cells[i].column - cells[i-1].column, 1);
});

test('Lemoncello composes adjacent date modules into one stop without changing either contract', () => {
  const { groupSceneModules } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/sceneModules');
  const fixture = require('../components/invitaciones-publicas/templates/wedding-lemoncello/preview.json');
  const input = buildResolvedModules(fixture.modules, fixture, 'wedding_lemoncello').filter(m => !['envelop_intro', 'music_player'].includes(m.type));
  const snapshot = structuredClone(input);
  const scenes = groupSceneModules(input);
  assert.equal(scenes.length, 11);
  assert.equal(scenes[3].type, 'countdown');
  assert.deepEqual(scenes[3].data, input[3].data);
  assert.deepEqual(scenes[3].companions, [input[4]]);
  assert.deepEqual(input, snapshot);
  assert.deepEqual(scenes.slice(4, 6).map(scene => scene.eventStage), ['ceremony', 'reception']);
  assert.equal(scenes[6].type, 'gift_envelopes');
  assert.equal(scenes[7].type, 'recommendations');
  assert.equal(scenes[8].type, 'dresscode');
  assert.equal(scenes[9].type, 'attendance_confirm');
  assert.equal(scenes[10].type, 'closing_message');
  assert.equal(scenes[4].data, scenes[5].data, 'both stops read the same shared module data');
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM(renderToStaticMarkup(React.createElement(templates.wedding_lemoncello.default, { resolvedModules: input, attendanceState })));
  assert.equal(dom.window.document.querySelectorAll('[data-date-scene]').length, 1);
  assert.equal(dom.window.document.querySelectorAll('[data-date-board]').length, 0);
  assert.equal(dom.window.document.querySelector('[data-countdown-date]').getAttribute('aria-label'), 'sábado, 19 de diciembre de 2026');
  assert.equal(dom.window.document.querySelector('[data-event-day]').textContent, '19');
  assert.equal(dom.window.document.querySelectorAll('[data-module="save_the_date_calendar"]').length, 1);
  assert.ok(dom.window.document.body.textContent.includes('Cada instante nos acerca a compartir este día contigo.'));
  dom.window.close();
  assert.equal(groupSceneModules([input[3], input[0], input[4]]).length, 3, 'unrelated modules are never reordered to combine the date');
  const withoutCalendar = buildResolvedModules(fixture.modules.map(m => m.type === 'save_the_date_calendar' ? { ...m, enabled: false } : m), fixture, 'wedding_lemoncello');
  assert.equal(groupSceneModules(withoutCalendar).find(s => s.type === 'countdown').companions.length, 0);
});

test('Lemoncello umbrellas cover every viewport edge and enter fully from outside it', () => {
  const { umbrellaLayout } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/umbrellaTransition');
  for (const [width, height] of [[320, 568], [390, 844], [440, 766], [480, 1080], [480, 320]]) {
    const canopies = umbrellaLayout(width, height);
    for (const progress of [.48, .5, .52]) {
      for (let iy = 0; iy <= 40; iy++) {
        for (let ix = 0; ix <= 40; ix++) {
          const x = ix * width / 40, y = iy * height / 40;
          assert.ok(canopies.some(p => Math.hypot(p.x + p.offset.x * (1 - 2 * progress) - x, p.y + p.offset.y * (1 - 2 * progress) - y) <= p.diameter * .4), `uncovered pixel at ${x},${y} in ${width}x${height} at ${progress}`);
        }
      }
    }
    for (const p of canopies) {
      for (const direction of [1, -1]) {
        const x = p.x + p.offset.x * direction, y = p.y + p.offset.y * direction, radius = p.diameter / 2;
        assert.ok(x + radius < 0 || x - radius > width || y + radius < 0 || y - radius > height, 'each canopy starts and finishes entirely outside the viewport');
      }
    }
  }
});

test('Lemoncello camera centers the referenced chapel and preserves fixed landscape geometry', () => {
  const { gardenGeometry, projectGardenSign } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/gardenCamera');
  const { sign, paper, landscape } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/gardenComposition.json');
  const project = (point, pose) => ({ x: point.x * pose.scale + pose.x, y: point.y * pose.scale + pose.y });
  for (const [width, height] of [[320, 740], [390, 844], [440, 766], [480, 900]]) {
    const geometry = gardenGeometry(width, height, 4);
    const { surface, wide, close } = geometry;
    const chapel = project({ x: geometry.left + landscape.chapelCenterX * geometry.scale, y: geometry.top }, wide);
    assert.ok(Math.abs(chapel.x - width / 2) < .001, 'the new chapel stays centered instead of using the retired sign anchor');
    assert.ok(Math.abs(chapel.y) < .001, 'the panorama fills the viewport height without a top gap');
    const skyBottom = project({ x: geometry.left + landscape.chapelCenterX * geometry.scale, y: geometry.top + landscape.skyBottom * geometry.scale }, geometry.sky);
    assert.ok(Math.abs(skyBottom.y - height) < .001, 'the sky crop ends above the chapel cross');
    assert.ok(geometry.sky.scale > wide.scale);
    const closeTopLeft = project(surface, close);
    const closeBottomRight = project({ x: surface.x + surface.width, y: surface.y + surface.height }, close);
    assert.ok(closeTopLeft.x >= 15.999 && closeBottomRight.x <= width - 15.999);
    assert.ok(closeTopLeft.y >= 39.999 && closeBottomRight.y <= height - 39.999);
    assert.ok(close.scale > wide.scale, 'the camera approaches the physical sign');
    assert.ok(Math.abs((closeBottomRight.x - closeTopLeft.x) / (closeBottomRight.y - closeTopLeft.y) - surface.width / surface.height) < .001, 'the camera never distorts the paper');
    // The directly painted sign must stay registered to the landscape for the
    // entire camera move, including reversal, not only the final close-up.
    for (const from of [wide, { x: -width * 4, y: 0, scale: 1 }]) {
      for (const progress of [0, .1, .25, .5, .75, 1]) {
        const lerp = (a, b) => Object.fromEntries(['x', 'y', 'scale'].map(key => [key, a[key] + (b[key] - a[key]) * progress]));
        const camera = lerp(from, close);
        const direct = lerp(projectGardenSign(geometry, from), projectGardenSign(geometry, close));
        const paperOrigin = project({ x: paper.left * sign.designWidth, y: paper.top * sign.designWidth * sign.imageHeight / sign.imageWidth }, direct);
        const worldOrigin = project(surface, camera);
        assert.ok(Math.abs(paperOrigin.x - worldOrigin.x) < .00001);
        assert.ok(Math.abs(paperOrigin.y - worldOrigin.y) < .00001);
        assert.ok(Math.abs(paper.width * sign.designWidth * direct.scale - surface.width * camera.scale) < .00001);
      }
    }
  }
});

test('Lemoncello details use shared places, times, links and visibility, and only adjacent date/details share depth', () => {
  const fixture = require('../components/invitaciones-publicas/templates/wedding-lemoncello/preview.json');
  const { sceneCell } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/SceneCanvas');
  const { groupSceneModules } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/sceneModules');
  const resolved = buildResolvedModules(fixture.modules, fixture, 'wedding_lemoncello').filter(m => m.type !== 'envelop_intro');
  const scenes = groupSceneModules(resolved);
  assert.deepEqual(sceneCell(3, scenes), sceneCell(4, scenes));
  assert.deepEqual(sceneCell(4, scenes), sceneCell(5, scenes), 'ceremony and reception share exactly the same camera position');
  const standalone = scenes.filter(m => m.type !== 'countdown');
  assert.ok(sceneCell(3, standalone).column > sceneCell(2, standalone).column);
  const module = resolved.find(m => m.type === 'event_details');
  const View = templates.wedding_lemoncello.MODULE_COMPONENTS.event_details;
  const html = renderToStaticMarkup(React.createElement(View, { data: module.data }));
  assert.match(html, /Capilla Señora del Rosario del Pantano de Vargas/);
  assert.match(html, /Villa Germana Paipa/);
  assert.match(html, /2:30 p\. m\./);
  assert.match(html, /4:30 p\. m\./);
  assert.equal((html.match(/19 de diciembre de 2026/g) || []).length, 1);
  assert.match(html, /Ver ubicación de recepción/);
  assert.match(html, /Ver ubicación de ceremonia/);
  assert.ok(html.includes('https://maps.app.goo.gl/ULysqgZLGN33vxTv9?g_st=ic'));
  assert.doesNotMatch(html, /RECEPTION TIME TO REPLACE/);
  const alternate = renderToStaticMarkup(React.createElement(View, { data: { ...module.data, showCeremony: false, receptionAddress: 'Avenida de prueba', receptionMessage: 'Mensaje editable' } }));
  assert.doesNotMatch(alternate, /Capilla Señora/);
  assert.match(alternate, /Avenida de prueba/);
  assert.match(alternate, /Mensaje editable/);
  const ceremony = renderToStaticMarkup(React.createElement(View, { data: module.data, eventStage: 'ceremony' }));
  const reception = renderToStaticMarkup(React.createElement(View, { data: module.data, eventStage: 'reception' }));
  assert.match(ceremony, /Capilla Señora/);
  assert.doesNotMatch(ceremony, /Villa Germana|4:30 p\. m\./);
  assert.match(reception, /Villa Germana Paipa/);
  assert.doesNotMatch(reception, /Capilla Señora|2:30 p\. m\./);
  const onlyReception = groupSceneModules([{ ...module, data: { ...module.data, showCeremony: false } }]);
  assert.deepEqual(onlyReception.map(scene => scene.eventStage), ['reception']);
  assert.equal(onlyReception[0].data.showCeremony, false);
  const onlyCeremony = groupSceneModules([{ ...module, data: { ...module.data, showReception: false } }]);
  assert.deepEqual(onlyCeremony.map(scene => scene.eventStage), ['ceremony']);
  const unrelatedEvents = groupSceneModules([
    { ...module, data: { ...module.data, showReception: false } },
    { ...module, data: { ...module.data, showCeremony: false } },
  ]);
  assert.notDeepEqual(sceneCell(0, unrelatedEvents), sceneCell(1, unrelatedEvents), 'separate source modules are not merged even if their order values match');
});

test('Lemoncello quote renders only the shared passage and optional reference, without a personalized greeting', () => {
  const fixture = require('../components/invitaciones-publicas/templates/wedding-lemoncello/preview.json');
  const View = require('../components/invitaciones-publicas/templates/wedding-lemoncello/QuoteLemoncello').default;
  const module = fixture.modules.find(module => module.type === 'biblical_quote');
  const data = resolveModuleDataByTemplate(module, fixture, 'wedding_lemoncello');
  const html = renderToStaticMarkup(React.createElement(View, { data }));
  assert.ok(html.includes(module.config.passageText));
  assert.ok(!html.includes('TEST GUEST'));
  assert.ok(!html.includes('Para '));
  assert.ok(!html.includes('class="reference"'));
  const withReference = renderToStaticMarkup(React.createElement(View, { data: { ...data, passageReference: 'Referencia elegida' } }));
  assert.ok(withReference.includes('Referencia elegida'));
});

test('Lemoncello waits for its start arrow, travels for 6 seconds and supports reduced motion and failed art', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="test-root"></div>', { url: 'http://localhost' });
  const keys = ['window', 'document', 'IS_REACT_ACT_ENVIRONMENT', 'setTimeout', 'clearTimeout'];
  const saved = Object.fromEntries(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let reduce = false, failed = false, stalled = false, now = 0, serial = 0, opens = 0, music = 0, starts = 0;
  const lateImages = [];
  const listeners = new Set(), timers = new Map();
  window.matchMedia = () => ({ get matches() { return reduce; }, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) });
  window.Image = class { set src(value) {
    if (stalled) lateImages.push(this);
    else queueMicrotask(() => failed ? this.onerror?.() : this.onload?.());
  } };
  window.ResizeObserver = class { observe() {} disconnect() {} };
  window.addEventListener('envelopIntro:open', () => music++);
  globalThis.setTimeout = (fn, ms) => { const id = ++serial; timers.set(id, { fn, at: now + ms }); return id; };
  globalThis.clearTimeout = id => timers.delete(id);
  const tick = async ms => {
    now += ms;
    await React.act(async () => { for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); } });
  };
  const { createRoot } = require('react-dom/client');
  const root = createRoot(document.getElementById('test-root'));
  const Envelope = templates.wedding_lemoncello.MODULE_COMPONENTS.envelop_intro;
  const mount = (key, presentationReady = true) => root.render(React.createElement(Envelope, { key, presentationReady, data: { invitationLabel: 'FAMILIA DINÁMICA', eventDate: '19.12.26' }, onStart: () => starts++, onOpen: () => opens++ }));
  const phase = () => document.querySelector('[data-envelope-phase]').dataset.envelopePhase;
  const startButton = () => document.querySelector('button[aria-label="Comenzar invitación"]');
  const openButton = () => document.querySelector('button[aria-label="Abrir invitación"]');
  try {
    await React.act(async () => mount('normal', false));
    await tick(10000);
    assert.equal(phase(), 'waiting');
    assert.equal(startButton(), null, 'the start control waits for the global loader');
    await React.act(async () => mount('normal', true));
    await tick(10000);
    assert.equal(phase(), 'waiting', 'the scooter stays still until the arrow is pressed');
    assert.equal(music, 0);
    const startControl = startButton();
    await React.act(async () => { startControl.click(); startControl.click(); });
    assert.equal(starts, 1);
    assert.equal(music, 1);
    assert.equal(startButton(), null, 'the arrow disappears when travel starts');
    assert.equal(phase(), 'travel');
    assert.equal(document.querySelector('button').disabled, true);
    await tick(5999);
    assert.equal(phase(), 'travel');
    await tick(1);
    assert.equal(phase(), 'arrived');
    assert.ok(document.body.textContent.includes('FAMILIA DINÁMICA'));
    assert.ok(document.body.textContent.includes('19.12.26'));
    await React.act(async () => { document.querySelector('button').click(); document.querySelector('button').click(); });
    assert.equal(music, 2, 'opening can retry music without duplicating the start gesture');
    assert.equal(opens, 0);
    await tick(1800);
    assert.equal(opens, 0, 'the previous opening duration must only reach the midpoint');
    await tick(1799);
    assert.equal(opens, 0);
    await tick(1);
    assert.equal(opens, 1);
    reduce = true;
    await React.act(async () => mount('reduced'));
    assert.equal(phase(), 'waiting');
    await React.act(async () => startButton().click());
    assert.equal(phase(), 'arrived');
    assert.equal(document.activeElement, openButton());
    await React.act(async () => openButton().click());
    assert.equal(opens, 2);
    reduce = false; failed = true;
    await React.act(async () => mount('failed'));
    assert.equal(phase(), 'waiting');
    await React.act(async () => startButton().click());
    assert.equal(phase(), 'arrived');
    await React.act(async () => document.querySelector('button').click());
    assert.equal(opens, 3);
    failed = false; stalled = true;
    await React.act(async () => mount('stalled'));
    await tick(10000);
    assert.equal(phase(), 'waiting');
    assert.equal(document.querySelector('[data-envelope-phase]').dataset.failed, 'true');
    await React.act(async () => lateImages.forEach(image => image.onload?.()));
    assert.equal(phase(), 'waiting', 'late downloads must not restart the scene after its deadline');
    assert.equal(document.querySelector('[data-envelope-phase]').dataset.failed, 'true');
    stalled = false;
    await React.act(async () => mount('unmount-during-travel'));
    await React.act(async () => startButton().click());
    assert.equal(phase(), 'travel');
  } finally {
    await React.act(async () => root.unmount());
    assert.equal(timers.size, 0);
    assert.equal(listeners.size, 0);
    dom.window.close();
    for (const [key, descriptor] of Object.entries(saved)) descriptor ? Object.defineProperty(globalThis, key, descriptor) : delete globalThis[key];
  }
});

test('Lemoncello horizontal journey locks repeated input, focuses arrival, supports return and reduced motion', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="scene-test"></div>', { url: 'http://localhost' });
  dom.window.HTMLCanvasElement.prototype.getContext = () => null;
  const keys = ['window', 'document', 'IS_REACT_ACT_ENVIRONMENT', 'requestAnimationFrame', 'cancelAnimationFrame'];
  const saved = Object.fromEntries(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window;
  globalThis.document = dom.window.document;
  globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  globalThis.requestAnimationFrame = callback => { callback(); return 1; };
  globalThis.cancelAnimationFrame = () => {};
  let reduced = false, now = 0, serial = 0;
  const listeners = new Set(), timers = new Map();
  window.matchMedia = () => ({ get matches() { return reduced; }, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) });
  window.setTimeout = (fn, delay) => { const id = ++serial; timers.set(id, { fn, at: now + delay }); return id; };
  window.clearTimeout = id => timers.delete(id);
  const tick = async ms => {
    now += ms;
    await React.act(async () => { for (const [id, timer] of [...timers]) if (timer.at <= now) { timers.delete(id); timer.fn(); } });
  };
  const { default: Scene, ESCORT_MS, PHOTO_JOURNEY_MS, RECEPTION_MS, CEREMONY_MS, SKY_MS } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/SceneCanvas');
  const { UMBRELLA_MS, UMBRELLA_COVER_MS } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/umbrellaTransition');
  const { createRoot } = require('react-dom/client');
  const root = createRoot(document.getElementById('scene-test'));
  const fixture = require('../components/invitaciones-publicas/templates/wedding-lemoncello/preview.json');
  const modules = buildResolvedModules(fixture.modules, fixture, 'wedding_lemoncello').filter(m => !['envelop_intro', 'music_player'].includes(m.type));
  const props = { modules, views: templates.wedding_lemoncello.MODULE_COMPONENTS, viewStyles: {}, attendanceState, focusRef: { current: null } };
  const viewport = () => document.querySelector('[data-scene-index]');
  const next = () => document.querySelector('button[aria-label="Ir a la frase"]');
  const click = element => element.dispatchEvent(new window.MouseEvent('click', { bubbles: true }));
  try {
    await React.act(async () => root.render(React.createElement(Scene, { ...props, opened: false })));
    assert.equal(next().disabled, true);
    await React.act(async () => click(next()));
    assert.equal(viewport().dataset.sceneMoving, 'false');
    await React.act(async () => root.render(React.createElement(Scene, { ...props, opened: true })));
    await React.act(async () => { click(next()); click(next()); });
    assert.equal(viewport().dataset.sceneIndex, '0');
    assert.equal(viewport().dataset.sceneMoving, 'true');
    assert.equal(next().disabled, true);
    assert.equal(timers.size, 1);
    await React.act(async () => document.querySelector('.waiterFrames').dispatchEvent(new window.Event('animationend', { bubbles: true })));
    assert.equal(viewport().dataset.sceneMoving, 'true', 'child animation events cannot finish the camera');
    await tick(ESCORT_MS - 10);
    assert.equal(viewport().dataset.sceneIndex, '0');
    await tick(160);
    assert.equal(viewport().dataset.sceneIndex, '1');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'biblical_quote');
    assert.equal(document.querySelector('[data-module="hero_image_1"]').hasAttribute('inert'), true);
    const photos = () => document.querySelector('button[aria-label="Ir a las fotos"]');
    await React.act(async () => { click(photos()); click(photos()); });
    assert.equal(viewport().dataset.sceneGuide, 'bird');
    assert.equal(photos().disabled, true);
    assert.equal(timers.size, 1);
    assert.equal(viewport().style.getPropertyValue('--journey-duration'), `${PHOTO_JOURNEY_MS}ms`);
    assert.equal(PHOTO_JOURNEY_MS, 3000);
    assert.ok(document.querySelector('[data-scene-camera]').classList.contains('photoJourney'));
    await React.act(async () => document.querySelector('.birdGuideFrames').dispatchEvent(new window.Event('animationend', { bubbles: true })));
    await tick(PHOTO_JOURNEY_MS / 2);
    assert.equal(viewport().dataset.sceneIndex, '1');
    assert.equal(viewport().dataset.sceneMoving, 'true');
    await tick(PHOTO_JOURNEY_MS / 2 + 150);
    assert.equal(viewport().dataset.sceneIndex, '2');
    assert.equal(viewport().dataset.sceneGuide, undefined);
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'image_slider_1');
    await React.act(async () => click(document.querySelector('button[aria-label="Ir a la cuenta regresiva"]')));
    assert.equal(viewport().dataset.sceneTransition, 'umbrellas');
    assert.equal(viewport().dataset.sceneZoom, undefined);
    assert.equal(viewport().dataset.scenePresented, '2');
    const photoPose = viewport().style.getPropertyValue('--camera-from');
    assert.equal(photoPose, viewport().style.getPropertyValue('--camera-to'), 'camera stays still while umbrellas enter');
    assert.equal(document.querySelector('[data-umbrella-transition]').dataset.running, 'true');
    assert.equal(timers.size, 2, 'covered swap and finish each have one fallback');
    await React.act(async () => document.querySelector('[data-umbrella] img').dispatchEvent(new window.Event('animationend', { bubbles: true })));
    assert.equal(viewport().dataset.scenePresented, '2', 'a rotating child cannot switch the scene');
    await tick(UMBRELLA_COVER_MS - 10);
    assert.equal(viewport().dataset.scenePresented, '2');
    await tick(10);
    assert.equal(viewport().dataset.scenePresented, '3', 'switch only while all umbrellas cover the viewport');
    assert.equal(viewport().dataset.sceneIndex, '2', 'navigation remains locked during reveal');
    assert.equal(viewport().dataset.sceneMoving, 'true');
    assert.notEqual(viewport().style.getPropertyValue('--camera-from'), photoPose);
    assert.equal(document.querySelector('.dateOverlay').dataset.visible, 'true');
    await tick(UMBRELLA_MS - UMBRELLA_COVER_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '3');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'countdown');
    assert.equal(document.querySelectorAll('[data-date-scene]').length, 1);
    assert.equal(document.querySelectorAll('[data-date-board]').length, 0, 'date content is no longer on an easel');
    assert.ok(document.querySelector('[data-date-branch]'));
    assert.equal(document.querySelectorAll('.sceneNavigation button').length, 2, 'calendar shares the date stop; details follow');
    const details = () => document.querySelector('button[aria-label="Ver ceremonia"]');
    await React.act(async () => { click(details()); click(details()); });
    assert.equal(viewport().dataset.sceneTransition, 'umbrellas');
    assert.equal(viewport().dataset.scenePresented, '3');
    const sky = () => document.querySelector('[data-module="event_details"]');
    assert.equal(sky().dataset.visible, 'false', 'sky text waits until the landscape switches');
    assert.equal(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'), 'there is no zoom toward the church');
    assert.equal(timers.size, 2);
    await tick(UMBRELLA_COVER_MS);
    assert.equal(viewport().dataset.sceneIndex, '3');
    assert.equal(viewport().dataset.scenePresented, '4');
    assert.equal(document.querySelector('.dateOverlay').dataset.visible, 'false');
    assert.equal(sky().dataset.visible, 'true', 'ceremony text appears with the chapel under full cover');
    assert.equal(sky().dataset.revealWithLandscape, 'true');
    assert.equal(sky().hasAttribute('inert'), true, 'navigation stays locked while umbrellas leave');
    await tick(UMBRELLA_MS - UMBRELLA_COVER_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '4');
    assert.equal(sky().dataset.visible, 'true', 'completion preserves text already on screen');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'event_details');
    assert.equal(viewport().dataset.depth, 'wide');
    const wind = document.querySelector('[data-chapel-wind]');
    assert.ok(wind, 'the visible chapel runs its localized breeze');
    assert.equal(document.querySelectorAll('[data-chapel-wind]').length, 1);
    const daylight = document.querySelector('[data-garden-painting]');
    assert.equal(viewport().dataset.skyNight, 'false', 'both events keep the daylight illustration');
    assert.equal(wind.dataset.windReady, 'false', 'the original img remains the fallback when acceleration is unavailable');
    assert.equal(document.querySelectorAll('.sceneNavigation button').length, 2);
    const reception = () => document.querySelector('[data-event-stage="reception"]');
    const toReception = () => document.querySelector('button[aria-label="Ver recepción"]');
    assert.equal(reception().dataset.visible, 'false');
    await React.act(async () => { click(toReception()); click(toReception()); });
    assert.equal(viewport().dataset.eventTransition, 'reception');
    assert.equal(document.querySelector('[data-chapel-wind]'), wind, 'the breeze continues uninterrupted while event text changes');
    assert.equal(sky().dataset.visible, 'false', 'ceremony leaves before the spark');
    assert.equal(reception().dataset.visible, 'false', 'reception waits for the complete firework transition');
    assert.equal(timers.size, 1);
    assert.ok(document.querySelector('[data-event-spark]'));
    assert.equal(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'), 'the landscape never moves during the firework transition');
    await tick(RECEPTION_MS - 10);
    assert.equal(reception().dataset.visible, 'false');
    await tick(160);
    assert.equal(viewport().dataset.sceneIndex, '5');
    assert.equal(reception().dataset.visible, 'true');
    assert.equal(sky().dataset.visible, 'false');
    assert.equal(document.activeElement.closest('[data-event-stage]').dataset.eventStage, 'reception');
    assert.equal(document.querySelector('[data-event-spark]'), null);
    assert.equal(document.querySelector('[data-garden-painting]'), daylight);
    assert.equal(viewport().dataset.skyNight, 'false');
    assert.equal(reception().querySelector('[data-event-details]').hasAttribute('data-night'), false, 'reception keeps the readable navy day text');
    const gifts = () => document.querySelector('[data-module="gift_envelopes"]');
    const toGifts = () => document.querySelector('button[aria-label="Ver lluvia de sobres"]');
    await React.act(async () => { click(toGifts()); click(toGifts()); });
    assert.equal(reception().dataset.visible, 'false');
    assert.equal(gifts().dataset.visible, 'false', 'gift content waits for the sky ascent');
    assert.equal(viewport().dataset.skyNight, 'true', 'night starts at the same time as the camera ascends');
    assert.notEqual(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'));
    assert.equal(viewport().style.getPropertyValue('--sky-fade-duration'), `${SKY_MS}ms`);
    assert.equal(timers.size, 1, 'repeated input cannot restart the sky transition');
    await tick(SKY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '6');
    assert.equal(gifts().dataset.visible, 'true');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'gift_envelopes');
    assert.equal(document.querySelectorAll('[data-sky-spotlights] > div').length, 4);
    assert.equal(viewport().dataset.depth, 'sky');
    const recommendations = () => document.querySelector('[data-module="recommendations"]');
    const stars = document.querySelector('[data-night-stars]');
    assert.ok(stars.querySelectorAll('circle').length >= 80);
    await React.act(async () => click(document.querySelector('button[aria-label="Ver recomendaciones"]')));
    assert.equal(viewport().dataset.skyNight, 'true', 'hotel descent preserves the same night');
    assert.equal(gifts().dataset.visible, 'false');
    assert.equal(recommendations().dataset.visible, 'false', 'hotel text waits for descent');
    assert.ok(document.querySelector('[data-hotel-painting]'));
    assert.notEqual(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'));
    await tick(SKY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '7');
    assert.equal(recommendations().dataset.visible, 'true');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'recommendations');
    assert.equal(document.querySelector('[data-night-stars]'), stars, 'stars stay in the same landscape layer');
    const { DRESS_FIREWORKS_MS, DRESS_COVER_MS, DRESS_RETURN_MS, DRESS_RETURN_COVER_MS, HOTEL_FIREWORKS, FIREWORK_RISE_MS, FIREWORK_BLOOM_MS } = require('../components/invitaciones-publicas/templates/wedding-lemoncello/dressCodeTransition');
    const dress = () => document.querySelector('[data-module="dresscode"]');
    const toDress = () => document.querySelector('button[aria-label="Ver vestuario"]');
    assert.ok(Math.max(...HOTEL_FIREWORKS.map(f => f[4])) + FIREWORK_RISE_MS + FIREWORK_BLOOM_MS < DRESS_COVER_MS, 'the final firework finishes before the opaque wash');
    await React.act(async () => { click(toDress()); click(toDress()); });
    assert.equal(document.querySelectorAll('[data-hotel-firework]').length, 10);
    assert.equal(viewport().dataset.sceneTransition, 'fireworks');
    assert.equal(recommendations().dataset.visible, 'false');
    assert.equal(dress().dataset.visible, 'false');
    assert.equal(timers.size, 2, 'only the coverage and completion clocks run');
    assert.equal(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'), 'the hotel remains fixed during fireworks');
    await tick(DRESS_COVER_MS - 1);
    assert.equal(dress().dataset.visible, 'false', 'the white stationery never jumps ahead of coverage');
    await tick(1);
    assert.equal(dress().dataset.visible, 'true');
    assert.equal(dress().dataset.ready, 'false', 'copy waits until the wash clears');
    assert.ok(dress().hasAttribute('inert'));
    await tick(DRESS_FIREWORKS_MS - DRESS_COVER_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '8');
    assert.equal(dress().dataset.ready, 'true');
    assert.equal(document.querySelector('[data-dress-transition]'), null);
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'dresscode');
    const rsvp = () => document.querySelector('[data-module="attendance_confirm"]');
    const toAttendance = () => document.querySelector('button[aria-label="Ir a asistencia"]');
    await React.act(async () => { click(toAttendance()); click(toAttendance()); });
    assert.equal(viewport().dataset.sceneTransition, 'vertical-scroll');
    assert.equal(timers.size, 1);
    assert.equal(document.querySelector('[data-dress-transition]'), null);
    assert.equal(document.querySelector('[data-umbrella-transition]').dataset.running, 'false');
    assert.equal(dress().dataset.ready, 'true', 'dress copy stays visible while scrolling away');
    assert.equal(rsvp().dataset.visible, 'true');
    assert.ok(rsvp().hasAttribute('inert'), 'the entering form waits for arrival');
    assert.equal(document.querySelector('[data-paper-stack]').style.getPropertyValue('--paper-to'), '-100%');
    assert.equal(viewport().style.getPropertyValue('--camera-from'), viewport().style.getPropertyValue('--camera-to'), 'only the paper stack scrolls');
    await tick(1050);
    assert.equal(viewport().dataset.sceneIndex, '9');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'attendance_confirm');
    assert.equal(rsvp().hasAttribute('inert'), false);
    assert.equal(document.querySelectorAll('.sceneNavigation button').length, 2);
    const scroll = document.querySelector('[data-attendance-scroll]');
    await React.act(async () => scroll.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })));
    assert.equal(viewport().dataset.sceneMoving, 'false', 'list keys never move the scene');
    const toClosing = () => document.querySelector('button[aria-label="Ver mensaje final"]');
    await React.act(async () => { click(toClosing()); click(toClosing()); });
    assert.equal(viewport().dataset.sceneTransition, 'horizontal-scroll');
    assert.equal(document.querySelector('[data-paper-stack]').style.getPropertyValue('--paper-from'), '-100%');
    assert.equal(document.querySelector('[data-paper-stack]').style.getPropertyValue('--paper-to'), '-100%');
    assert.equal(document.querySelector('[data-paper-stack]').style.getPropertyValue('--paper-to-x'), '-100%');
    assert.equal(timers.size, 1);
    await tick(1050);
    assert.equal(viewport().dataset.sceneIndex, '10');
    assert.equal(document.activeElement.closest('[data-module]').dataset.module, 'closing_message');
    assert.equal(document.querySelectorAll('.sceneNavigation button').length, 1, 'the final scene has only a back arrow');
    assert.ok(document.querySelector('[data-closing-scene]').textContent.includes('Te esperamos'));
    assert.equal(document.querySelector('[data-closing-water]').dataset.waterReady, 'false', 'without WebGL the water layer stays hidden');
    assert.ok(document.querySelector('[data-closing-landscape]'), 'the original painting remains available without WebGL');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(document.querySelector('[data-closing-water]'), null, 'leaving the scene releases the water renderer');
    assert.equal(viewport().dataset.sceneTransition, 'horizontal-scroll');
    await tick(1050);
    assert.equal(viewport().dataset.sceneIndex, '9');

    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneTransition, 'vertical-scroll');
    assert.equal(document.querySelector('[data-paper-stack]').style.getPropertyValue('--paper-to'), '0%');
    await tick(1050);
    assert.equal(viewport().dataset.sceneIndex, '8');

    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneTransition, 'return');
    assert.equal(document.querySelectorAll('[data-hotel-firework]').length, 0);
    await tick(DRESS_RETURN_COVER_MS);
    assert.equal(dress().dataset.visible, 'false');
    assert.ok(document.querySelector('[data-hotel-painting]'));
    await tick(DRESS_RETURN_MS - DRESS_RETURN_COVER_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '7');
    assert.equal(recommendations().dataset.visible, 'true');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.ok(document.querySelector('[data-hotel-painting]'), 'hotel stays visible while rising back to sky');
    await tick(SKY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '6');
    assert.equal(viewport().dataset.skyNight, 'true');
    assert.equal(gifts().dataset.visible, 'true');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(gifts().dataset.visible, 'false');
    assert.equal(viewport().dataset.skyNight, 'false');
    await tick(SKY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '5');
    assert.equal(reception().dataset.visible, 'true');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.eventTransition, 'ceremony');
    assert.equal(reception().dataset.visible, 'false');
    await tick(CEREMONY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '4');
    assert.equal(document.querySelector('[data-garden-painting]'), daylight);
    assert.equal(sky().dataset.visible, 'true');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneTransition, 'umbrellas');
    assert.equal(sky().dataset.visible, 'false');
    await tick(UMBRELLA_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '3');
    assert.equal(viewport().dataset.depth, 'close');
    await React.act(async () => { reduced = true; listeners.forEach(fn => fn()); });
    await React.act(async () => click(details()));
    assert.equal(viewport().dataset.sceneIndex, '4');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(viewport().dataset.depth, 'wide');
    assert.equal(sky().dataset.visible, 'true', 'reduced motion reveals text immediately');
    assert.equal(document.querySelector('[data-chapel-wind]'), null, 'reduced motion removes the wind animation');
    assert.equal(timers.size, 0);
    await React.act(async () => click(toReception()));
    assert.equal(viewport().dataset.sceneIndex, '5');
    assert.equal(reception().dataset.visible, 'true');
    assert.equal(document.querySelector('[data-event-spark]'), null);
    assert.equal(timers.size, 0);
    await React.act(async () => click(toGifts()));
    assert.equal(viewport().dataset.sceneIndex, '6');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(gifts().dataset.visible, 'true');
    assert.equal(timers.size, 0);
    await React.act(async () => click(document.querySelector('button[aria-label="Ver recomendaciones"]')));
    assert.equal(viewport().dataset.sceneIndex, '7');
    assert.equal(recommendations().dataset.visible, 'true');
    assert.equal(viewport().dataset.skyNight, 'true');
    assert.equal(timers.size, 0);
    await React.act(async () => click(toDress()));
    assert.equal(viewport().dataset.sceneIndex, '8');
    assert.equal(dress().dataset.ready, 'true');
    assert.equal(document.querySelector('[data-dress-transition]'), null);
    assert.equal(timers.size, 0);
    await React.act(async () => click(toAttendance()));
    assert.equal(viewport().dataset.sceneIndex, '9');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(timers.size, 0);
    await React.act(async () => click(toClosing()));
    assert.equal(viewport().dataset.sceneIndex, '10');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(document.querySelector('[data-closing-water]'), null, 'reduced motion preserves the still painting');
    assert.equal(timers.size, 0);
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneIndex, '9');

    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneIndex, '8');

    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(viewport().dataset.sceneIndex, '4');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await React.act(async () => { reduced = false; listeners.forEach(fn => fn()); });
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await tick(UMBRELLA_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '2');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await tick(PHOTO_JOURNEY_MS + 150);
    assert.equal(viewport().dataset.sceneIndex, '1');
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await tick(1050);
    assert.equal(viewport().dataset.sceneIndex, '0');
    await React.act(async () => { reduced = true; listeners.forEach(fn => fn()); });
    await React.act(async () => click(next()));
    assert.equal(viewport().dataset.sceneIndex, '1');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(timers.size, 0);
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    await React.act(async () => { reduced = false; listeners.forEach(fn => fn()); });
    await React.act(async () => click(next()));
    assert.equal(timers.size, 1);
    await React.act(async () => { reduced = true; listeners.forEach(fn => fn()); });
    assert.equal(timers.size, 0, 'changing motion preference completes an ongoing guide');
    await React.act(async () => click(photos()));
    await React.act(async () => { reduced = false; listeners.forEach(fn => fn()); });
    await React.act(async () => click(document.querySelector('button[aria-label="Ir a la cuenta regresiva"]')));
    assert.equal(timers.size, 2);
    await tick(UMBRELLA_COVER_MS);
    await React.act(async () => { reduced = true; listeners.forEach(fn => fn()); });
    assert.equal(viewport().dataset.sceneIndex, '3');
    assert.equal(viewport().dataset.sceneMoving, 'false');
    assert.equal(timers.size, 0, 'motion preference cancels both umbrella clocks and reveals the destination');
    await React.act(async () => { reduced = false; listeners.forEach(fn => fn()); });
    await React.act(async () => click(document.querySelector('button[aria-label="Volver a la escena anterior"]')));
    assert.equal(timers.size, 2);
    await React.act(async () => root.unmount());
    assert.equal(timers.size, 0);
    assert.equal(listeners.size, 0);
  } finally {
    if (document.getElementById('scene-test').hasChildNodes()) await React.act(async () => root.unmount());
    dom.window.close();
    for (const key of keys) { if (saved[key]) Object.defineProperty(globalThis, key, saved[key]); else delete globalThis[key]; }
  }
});

test('Lemoncello photos cycle in every direction, dismiss the hint once, cancel safely and preserve keyboard focus', async () => {
  const { JSDOM } = require('jsdom');
  const dom = new JSDOM('<div id="photos-test"></div>', { url: 'http://localhost' });
  const keys = ['window', 'document', 'IS_REACT_ACT_ENVIRONMENT'];
  const saved = Object.fromEntries(keys.map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  globalThis.window = dom.window; globalThis.document = dom.window.document; globalThis.IS_REACT_ACT_ENVIRONMENT = true;
  let reduced = false, serial = 0;
  const listeners = new Set(), timers = new Map();
  window.matchMedia = () => ({ get matches() { return reduced; }, addEventListener: (_, fn) => listeners.add(fn), removeEventListener: (_, fn) => listeners.delete(fn) });
  window.setTimeout = fn => { const id = ++serial; timers.set(id, fn); return id; };
  window.clearTimeout = id => timers.delete(id);
  const flush = () => React.act(async () => { for (const [id, fn] of [...timers]) { timers.delete(id); fn(); } });
  const Photos = require('../components/invitaciones-publicas/templates/wedding-lemoncello/PhotoStackLemoncello').default;
  const { createRoot } = require('react-dom/client');
  const root = createRoot(document.getElementById('photos-test'));
  const images = Array.from({ length: 7 }, (_, i) => `/photo-${i}.webp`);
  const mount = key => root.render(React.createElement(Photos, { key, data: { images } }));
  const deck = () => document.querySelector('[data-photo-stack]');
  const top = () => document.querySelector('[data-photo-top="true"]');
  const pointer = (type, x, y) => top().dispatchEvent(new window.MouseEvent(type, { bubbles: true, clientX: x, clientY: y, button: 0 }));
  try {
    await React.act(async () => mount('first'));
    assert.ok(deck().textContent.includes('Desliza'));
    await React.act(async () => pointer('pointerdown', 0, 0));
    await React.act(async () => pointer('pointermove', 4, 3));
    await React.act(async () => pointer('pointercancel', 4, 3));
    assert.equal(deck().dataset.photoActive, '0');
    assert.ok(deck().textContent.includes('Desliza'));
    // Releasing below the deliberate swipe distance must not advance or trigger
    // the browser's following click; short swipes still work in every direction.
    await React.act(async () => pointer('pointerdown', 0, 0));
    await React.act(async () => pointer('pointermove', 12, 0));
    await React.act(async () => pointer('pointerup', 12, 0));
    await React.act(async () => top().click());
    assert.equal(deck().dataset.photoActive, '0');
    assert.equal(deck().dataset.photoPhase, 'idle');
    assert.equal(timers.size, 0);
    const directions = [[20, 0], [-20, 0], [0, 20], [0, -20], [14, 14], [-14, -14], [14, -14], [-14, 14]];
    for (const [index, [dx, dy]] of directions.entries()) {
      top().focus();
      await React.act(async () => pointer('pointerdown', 0, 0));
      await React.act(async () => pointer('pointermove', dx, dy));
      await React.act(async () => pointer('pointerup', dx, dy));
      assert.equal(deck().dataset.photoPhase, 'leaving');
      assert.equal(timers.size, 1);
      await React.act(async () => pointer('pointerdown', 0, 0));
      assert.equal(timers.size, 1, 'repeated gestures cannot queue additional turns');
      await flush();
      assert.equal(deck().dataset.photoActive, String((index + 1) % 7));
      assert.equal(document.activeElement, top());
      assert.equal(document.querySelectorAll('[data-photo-card]').length, 7);
      assert.ok(!deck().textContent.includes('Desliza'));
    }
    await React.act(async () => mount('remounted'));
    assert.ok(!deck().textContent.includes('Desliza'), 'the instruction remains dismissed during the visit');
    await React.act(async () => { reduced = true; listeners.forEach(fn => fn()); });
    await React.act(async () => top().dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowUp', bubbles: true })));
    assert.equal(deck().dataset.photoActive, '1');
    assert.equal(deck().dataset.photoPhase, 'idle');
    assert.equal(timers.size, 0);
    await React.act(async () => { reduced = false; listeners.forEach(fn => fn()); });
    await React.act(async () => top().click());
    assert.equal(timers.size, 1);
    await React.act(async () => root.unmount());
    assert.equal(timers.size, 0);
    assert.equal(listeners.size, 0);
  } finally {
    if (document.getElementById('photos-test').hasChildNodes()) await React.act(async () => root.unmount());
    dom.window.close();
    for (const key of keys) saved[key] ? Object.defineProperty(globalThis, key, saved[key]) : delete globalThis[key];
  }
});
