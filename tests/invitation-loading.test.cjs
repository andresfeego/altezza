const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const { getEventListeners } = require('node:events');
const babel = require('@babel/core');

const filename = path.resolve(__dirname, '../components/invitaciones-publicas/waitForInitialAssets.js');
const compiled = new Module(filename, module);
compiled._compile(babel.transformSync(fs.readFileSync(filename, 'utf8'), {
  filename, babelrc: false, configFile: false,
  plugins: [require.resolve('@babel/plugin-transform-modules-commonjs')],
}).code, filename);
const { waitForInitialAssets, INITIAL_ASSET_WAIT_MS } = compiled.exports;

function image(overrides = {}) {
  return Object.assign(new EventTarget(), {
    complete: false, naturalWidth: 0, loading: 'eager',
    closest: () => null,
    getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 100, right: 100, width: 100, height: 100 }),
  }, overrides);
}
function root(images = [], ready = Promise.resolve()) {
  return {
    ownerDocument: { defaultView: { innerHeight: 800, innerWidth: 400 }, fonts: { ready } },
    querySelectorAll: () => images,
  };
}
const never = new Promise(() => {});

test('hidden, lazy and below-screen images never hold the first screen', async () => {
  const images = [
    image({ loading: 'lazy' }),
    image({ closest: () => ({ hidden: true }) }),
    image({ getBoundingClientRect: () => ({ top: 900, bottom: 1000, left: 0, right: 100, width: 100, height: 100 }) }),
    image({ complete: true, naturalWidth: 100, decode: () => Promise.resolve() }),
  ];
  await waitForInitialAssets(root(images));
  for (const img of images) assert.equal(getEventListeners(img, 'load').length, 0);
});

test('an already failed image does not wait for an error event that already fired', async () => {
  const broken = image({ complete: true, naturalWidth: 0 });
  await waitForInitialAssets(root([broken]));
  assert.equal(getEventListeners(broken, 'error').length, 0);
});

test('explicit scene assets wait even offscreen or before intrinsic dimensions are known', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const offscreen = image({
    hasAttribute: name => name === 'data-invitation-preload',
    getBoundingClientRect: () => ({ top: 0, left: 1400, bottom: 100, right: 1500, width: 100, height: 100 }),
  });
  const noSizeYet = image({
    hasAttribute: name => name === 'data-invitation-preload',
    getBoundingClientRect: () => ({ top: 0, left: 0, bottom: 0, right: 400, width: 400, height: 0 }),
  });
  let ready = false;
  const pending = waitForInitialAssets(root([offscreen, noSizeYet]), { timeoutMs: 10000 }).then(() => { ready = true; });
  t.mock.timers.tick(3000);
  await Promise.resolve();
  assert.equal(ready, false, 'the cinematic template uses its extended bounded loading window');
  offscreen.dispatchEvent(new Event('load'));
  await Promise.resolve();
  assert.equal(ready, false, 'all required layers must finish');
  noSizeYet.dispatchEvent(new Event('load'));
  await pending;
  assert.equal(ready, true);
  for (const img of [offscreen, noSizeYet]) {
    assert.equal(getEventListeners(img, 'load').length, 0);
    assert.equal(getEventListeners(img, 'error').length, 0);
  }
});

test('visible images finish on load or error and release their listeners', async () => {
  for (const event of ['load', 'error']) {
    const img = image();
    const ready = waitForInitialAssets(root([img]));
    assert.equal(getEventListeners(img, event).length, 1);
    img.dispatchEvent(new Event(event));
    await ready;
    assert.equal(getEventListeners(img, 'load').length, 0);
    assert.equal(getEventListeners(img, 'error').length, 0);
  }
});

test('the global deadline releases even stalled fonts and images', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const img = image();
  let ready = false;
  const waiting = waitForInitialAssets(root([img], never)).then(() => { ready = true; });
  t.mock.timers.tick(INITIAL_ASSET_WAIT_MS - 1);
  await Promise.resolve();
  assert.equal(ready, false);
  t.mock.timers.tick(1);
  await waiting;
  assert.equal(ready, true);
  assert.equal(getEventListeners(img, 'load').length, 0);
  assert.equal(getEventListeners(img, 'error').length, 0);
});

test('a stalled image decode also obeys the global deadline', async (t) => {
  t.mock.timers.enable({ apis: ['setTimeout'] });
  const ready = waitForInitialAssets(root([image({ complete: true, naturalWidth: 100, decode: () => never })]));
  await Promise.resolve();
  t.mock.timers.tick(INITIAL_ASSET_WAIT_MS);
  await ready;
});

test('unmount or navigation cancels the wait and removes all listeners', async () => {
  const img = image();
  const controller = new AbortController();
  const ready = waitForInitialAssets(root([img], never), { signal: controller.signal });
  controller.abort();
  await ready;
  assert.equal(getEventListeners(img, 'load').length, 0);
  assert.equal(getEventListeners(img, 'error').length, 0);
  assert.equal(getEventListeners(controller.signal, 'abort').length, 0);
  await waitForInitialAssets(root([img], never), { signal: controller.signal });
  assert.equal(getEventListeners(img, 'load').length, 0);
});
