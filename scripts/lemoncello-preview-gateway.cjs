const http = require('node:http');
const upstreamPort = Number(process.env.LEMONCELLO_PREVIEW_UPSTREAM_PORT || 3002);
const invitation = '/invitacion/lausprueba/910175';
const api = '/api/responseAltezza/public/invitaciones/lausprueba';
const coverAssets = new Set();
const server = http.createServer((req, res) => {
  let url;
  try { url = new URL(req.url, 'http://localhost'); } catch { res.writeHead(400).end(); return; }
  const pathname = url.pathname;
  const read = req.method === 'GET' || req.method === 'HEAD';
  if (read && pathname === '/') { res.writeHead(302, { Location: invitation }).end(); return; }
  const resource = coverAssets.has(pathname) || ['/fonts/', '/images/', '/_next/static/'].some(prefix => pathname.startsWith(prefix));
  const imageUrl = url.searchParams.get('url') || '';
  const optimizedImage = pathname === '/_next/image' && imageUrl.startsWith('/images/')
    && new URL(imageUrl, 'http://localhost').pathname.startsWith('/images/');
  const allowed = (read && (pathname === invitation || pathname === `${api}/910175` || resource || pathname === '/favicon.ico' || optimizedImage));
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
server.listen(3005, '127.0.0.1', () => console.log('Lemoncello preview gateway listening on 127.0.0.1:3005'));
