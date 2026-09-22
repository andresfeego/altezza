const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const babel = require('@babel/core');
const { getEventListeners } = require('node:events');

for (const ext of ['.webp', '.png', '.svg']) Module._extensions[ext] = (module, filename) => { module.exports = filename; };
function load(relative) {
  const filename = path.resolve(__dirname, '..', relative);
  const compiled = new Module(filename, module);
  compiled.filename = filename;
  compiled.paths = Module._nodeModulePaths(path.dirname(filename));
  compiled._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
    filename, babelrc: false, configFile: false, plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
  }).code, filename);
  return compiled.exports;
}
const { prepareInvitationMedia, waitForImage, waitForMediaData, waitForMountedMedia } = load('components/invitaciones-publicas/prepareInvitationMedia.js');
const { collectOlivaMedia, replacePreparedSources } = load('components/invitaciones-publicas/templates/wedding-oliva/olivaMedia.js');
const tick = () => new Promise(setImmediate);
function deferred() { let resolve, reject; const promise = new Promise((a, b) => { resolve = a; reject = b; }); return { promise, resolve, reject }; }
function fixture() {
  const images = [], revoked = [], blobs = [];
  class Image extends EventTarget {
    constructor() { super(); this.complete = false; this.naturalWidth = 0; this.loading = 'lazy'; images.push(this); }
    decode() { return Promise.resolve(); }
    load() { this.complete = true; this.naturalWidth = 100; this.dispatchEvent(new Event('load')); }
    getAttribute(name) { return this[name]; }
  }
  return { images, revoked, blobs, view: { Image, URL: { createObjectURL(blob) { blobs.push(blob); return `blob:${blobs.length}`; }, revokeObjectURL(url) { revoked.push(url); } }, fetch: async () => ({ ok: true, blob: async () => ({ size: 100 }) }), requestAnimationFrame: (callback) => callback() } };
}

test('manifest includes hidden module images, CSS masks, backgrounds and both responsive sources once; disabled modules are excluded', () => {
  const modules = [
    { type: 'envelop_intro', data: { envelopeSrc: '/envelope.png', monogramSrc: '/mask.png', backgroundSrc: '/mobile.png', backgroundDesktopSrc: '/desktop.png', backgroundVideoSrc: '/loop.mp4' } },
    { type: 'dresscode', data: { imageSrc: '/clothes.png', suggestedColors: [{ imageSrc: '/palette.png' }, { imageSrc: '/palette.png' }] } },
    { type: 'instant_photos', data: { images: [{ imageSrc: '/one.jpg' }, { imageSrc: '/two.jpg' }], sealImageSrc: '/seal.png', reliefImageSrc: '/relief.png' } },
    { type: 'couple_names', config: { sectionBackground: { imageSrc: '/garden.png' } }, data: { brideName: 'Ana' } },
    { type: 'biblical_quote', data: { passageText: 'Frase' } },
    { type: 'attendance_confirm', data: {} },
    { type: 'music_player', data: { audioSrc: '/song.mp3' } },
    { type: 'simple_image', enabled: false, data: { imageSrc: '/disabled.png' } },
  ];
  const resources = collectOlivaMedia(modules);
  for (const src of ['/envelope.png','/mask.png','/mobile.png','/desktop.png','/clothes.png','/palette.png','/one.jpg','/two.jpg','/seal.png','/relief.png','/garden.png']) assert.ok(resources.some(r => r.src === src && r.kind === 'image'), src);
  assert.equal(resources.filter(r => r.src === '/palette.png').length, 1);
  assert.ok(resources.some(r => r.src.includes('quote-floral-corner')));
  assert.ok(resources.some(r => r.src.includes('cotton-paper')));
  assert.ok(resources.some(r => r.src === '/loop.mp4' && r.kind === 'video'));
  assert.ok(resources.some(r => r.src === '/song.mp3' && r.kind === 'audio'));
  assert.ok(!resources.some(r => r.src === '/disabled.png'));
});

test('binary sources remain unset until downloaded and unrelated content is preserved', () => {
  const input = { audioSrc: '/song.mp3', backgroundVideoSrc: '/loop.mp4', imageSrc: '/photo.png', message: '/loop.mp4', nested: { title: 'Hola' } };
  assert.deepEqual(replacePreparedSources(input, {}), { ...input, audioSrc: '', backgroundVideoSrc: '' });
  assert.deepEqual(replacePreparedSources(input, { '/loop.mp4': 'blob:video', '/song.mp3': 'blob:audio' }), { ...input, audioSrc: 'blob:audio', backgroundVideoSrc: 'blob:video' });
  assert.equal(input.audioSrc, '/song.mp3');
});

test('images with no layout size are awaited, decode must finish and three seconds cannot declare success', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const f = fixture(), decoding = deferred(); let ready = false;
  const work = prepareInvitationMedia([{ kind: 'image', src: '/envelope.png' }, { kind: 'image', src: '/envelope.png' }], { view: f.view }).then(result => { ready = true; return result; });
  assert.equal(f.images.length, 1);
  t.mock.timers.tick(3001); await tick(); assert.equal(ready, false);
  f.images[0].decode = () => decoding.promise;
  f.images[0].load(); await tick(); assert.equal(ready, false);
  decoding.resolve(); const result = await work; assert.equal(ready, true); result.dispose();
});

test('video and music wait for their entire response body; blob URLs are reused and revoked on cleanup', async () => {
  const f = fixture(), body = deferred(); let ready = false;
  f.view.fetch = async () => ({ ok: true, blob: () => body.promise });
  const work = prepareInvitationMedia([{ kind: 'video', src: '/loop.mp4' }, { kind: 'audio', src: '/song.mp3' }], { view: f.view }).then(result => { ready = true; return result; });
  await tick(); assert.equal(ready, false); assert.equal(f.blobs.length, 0);
  body.resolve({ size: 1234 }); const result = await work;
  assert.equal(Object.keys(result.blobs).length, 2); assert.equal(f.blobs.length, 2);
  result.dispose(); assert.deepEqual(f.revoked.sort(), ['blob:1','blob:2']);
});

test('a failed resource aborts other workers and cannot be reported ready', async () => {
  const f = fixture(); let progress = 0;
  f.view.fetch = async () => ({ ok: false, status: 404 });
  const work = prepareInvitationMedia([{ kind: 'image', src: '/pending.png' }, { kind: 'video', src: '/missing.mp4' }], { view: f.view, onProgress: () => progress++ });
  await assert.rejects(work, /404/);
  assert.equal(progress, 0);
  assert.equal(getEventListeners(f.images[0], 'load').length, 0);
  f.images[0].load(); await tick(); assert.equal(progress, 0);
});

test('broken images and decode failures reject; cancellation removes all listeners', async () => {
  const f = fixture(); const broken = new f.view.Image(); broken.complete = true;
  await assert.rejects(waitForImage(broken), /imagen/);
  const corrupt = new f.view.Image(); corrupt.complete = true; corrupt.naturalWidth = 100; corrupt.decode = () => Promise.reject(new Error('Corrupt data'));
  await assert.rejects(waitForImage(corrupt), /Corrupt/);
  const controller = new AbortController(), pending = new f.view.Image();
  const work = waitForImage(pending, controller.signal);
  controller.abort(); await assert.rejects(work, { name: 'AbortError' });
  assert.equal(getEventListeners(pending, 'load').length, 0);
  assert.equal(getEventListeners(pending, 'error').length, 0);
});

test('mounted verification forces deferred images to load and waits for decoded video data, not metadata alone', async () => {
  const f = fixture(), image = new f.view.Image(); image.src = '/hidden.jpg';
  const video = Object.assign(new EventTarget(), { tagName: 'VIDEO', readyState: 0, error: null, preload: 'metadata' });
  const root = { querySelectorAll: selector => selector === 'img' ? [image] : [video] };
  let ready = false;
  const work = waitForMountedMedia(root, { view: f.view }).then(() => { ready = true; });
  assert.equal(image.loading, 'eager'); assert.equal(video.preload, 'auto');
  image.load(); video.readyState = 1; video.dispatchEvent(new Event('loadedmetadata')); await tick(); assert.equal(ready, false);
  video.readyState = 2; video.dispatchEvent(new Event('loadeddata')); await work; assert.equal(ready, true);
  assert.equal(getEventListeners(video, 'loadeddata').length, 0);
});

test('media decode errors reject, and retries can prepare a fresh resource', async () => {
  const video = Object.assign(new EventTarget(), { tagName: 'VIDEO', readyState: 0, error: { code: 4 } });
  await assert.rejects(waitForMediaData(video), /video/);
  video.error = null; video.readyState = 2;
  await waitForMediaData(video);
});
