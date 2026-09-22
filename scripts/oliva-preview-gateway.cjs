const http = require('node:http');
// Public previews use the optimized build, avoiding development's large icon
// bundles and Fast Refresh reloads. Port 3002 remains an explicit editing opt-in.
const upstreamPort = Number(process.env.OLIVA_PREVIEW_UPSTREAM_PORT || 3004);
const invitation = '/invitacion/mysprueba/910171';
const api = '/api/responseAltezza/public/invitaciones/mysprueba';
const coverAssets = new Set([
  '/scrAppaltezza/invitations/bodmys/cover/fondo01portrait-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/cover/fondo01wide-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/cover/fondo-sobre-loop-web-v1.mp4',
  '/scrAppaltezza/invitations/bodmys/cover/sobre-cerrado-sin-fondo-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/cover/monograma-MS-transparente-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/hero/floral-relief-v1-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/photos/mayra-samuel-fondo-desenfocado-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/couple_names/jardin-luz-natural-v1-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/gift_envelopes/sobre-botanico-v1-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/dresscode/grupo-vestidos-acuarela-v1-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/dresscode/paleta-telas-referencia-v1-web-v1.webp',
  '/scrAppaltezza/invitations/bodmys/audio/ELENA%20ROSE%20%26%20Rawayana%20-%20Luna%20de%20Miel%20-%20ELENA%20ROSE-web-v1.mp3',
  '/scrAppaltezza/invitations/bodmys/cover/fondo-sobre-loop.mp4',
  '/scrAppaltezza/invitations/bodmys/cover/fondo01.png',
  '/scrAppaltezza/invitations/bodmys/cover/fondo01wide.png',
  '/scrAppaltezza/invitations/bodmys/cover/fondo01portrait.png',
  '/scrAppaltezza/invitations/bodmys/cover/sobre-cerrado-sin-fondo.png',
  '/scrAppaltezza/invitations/bodmys/cover/monograma-MS-transparente.png',
  '/scrAppaltezza/invitations/bodmys/audio/ELENA%20ROSE%20%26%20Rawayana%20-%20Luna%20de%20Miel%20-%20ELENA%20ROSE.mp3',
  '/scrAppaltezza/invitations/bodmys/hero/floral-relief-v1.png',
  '/scrAppaltezza/invitations/bodmys/photos/mayra-samuel-fondo-desenfocado.webp',
  '/scrAppaltezza/invitations/bodmys/photos/003.jpeg',
  '/scrAppaltezza/invitations/bodmys/photos/004.jpeg',
  '/scrAppaltezza/invitations/bodmys/instant_photos/sello-lacre-MS-v1.webp',
  '/scrAppaltezza/invitations/bodmys/dresscode/grupo-vestidos-acuarela-v1.png',
  '/scrAppaltezza/invitations/bodmys/dresscode/paleta-telas-referencia-v1.png',
  '/scrAppaltezza/invitations/bodmys/dresscode/tela-marfil-v1.webp',
  '/scrAppaltezza/invitations/bodmys/dresscode/tela-beige-v1.webp',
  '/scrAppaltezza/invitations/bodmys/gift_envelopes/sobre-botanico-v1.png',
  '/scrAppaltezza/invitations/bodmys/couple_names/jardin-luz-natural-v1.png',
]);
const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { res.writeHead(400).end(); return; }
  const pathname = url.pathname;
  const read = req.method === 'GET' || req.method === 'HEAD';
  if (read && pathname === '/') { res.writeHead(302, { Location: invitation }).end(); return; }
  const resource = coverAssets.has(pathname) || ['/fonts/', '/images/', '/invitations/oliva/', '/_next/static/'].some(prefix => pathname.startsWith(prefix));
  const imageUrl = url.searchParams.get('url') || '';
  const optimizedImage = pathname === '/_next/image' && imageUrl.startsWith('/images/')
    && new URL(imageUrl, 'http://localhost').pathname.startsWith('/images/');
  const allowed = (read && (pathname === invitation || pathname === `${api}/910171` || resource || pathname === '/favicon.ico' || optimizedImage))
    || (req.method === 'PUT' && pathname === `${api}/confirmacion`);
  if (!allowed || /%2e|%2f|%5c|\\/i.test(pathname)) { res.writeHead(404).end('Not found'); return; }
  const headers = { ...req.headers };
  for (const name of Object.keys(headers)) {
    if (name.startsWith('x-middleware-') || name.startsWith('x-nextjs-')) delete headers[name];
  }
  const upstream = http.request({ hostname: '127.0.0.1', port: upstreamPort, method: req.method, path: pathname + url.search, headers }, response => {
    res.writeHead(response.statusCode, { ...response.headers, 'x-robots-tag': 'noindex, nofollow' });
    response.pipe(res);
  });
  upstream.on('error', () => { if (!res.headersSent) res.writeHead(502); res.end('Local preview unavailable'); });
  req.pipe(upstream);
});
server.on('upgrade', (req, socket, head) => {
  if (req.url !== '/_next/webpack-hmr') { socket.destroy(); return; }
  const upstream = http.request({ hostname: '127.0.0.1', port: upstreamPort, path: req.url, headers: req.headers });
  upstream.on('upgrade', (response, peer, peerHead) => {
    const lines = [`HTTP/1.1 ${response.statusCode} ${response.statusMessage}`];
    for (const [name, value] of Object.entries(response.headers)) lines.push(`${name}: ${value}`);
    socket.write(lines.join('\r\n') + '\r\n\r\n');
    if (peerHead.length) socket.write(peerHead);
    if (head.length) peer.write(head);
    socket.pipe(peer).pipe(socket);
    socket.on('error', () => peer.destroy());
    peer.on('error', () => socket.destroy());
  });
  upstream.on('error', () => socket.destroy());
  upstream.end();
});
server.listen(3003, '127.0.0.1', () => console.log(`Oliva preview gateway listening on 127.0.0.1:3003 -> 127.0.0.1:${upstreamPort}`));
