import cookie from 'cookie';

export function setCookie(res, token) {
  res.setHeader('Set-Cookie', cookie.serialize('altezza_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 30 * 24 * 60 * 60, // 30 días
    sameSite: 'lax',
    path: '/',
  }));
}

export function getCookie(req) {
  const cookies = cookie.parse(req.headers.cookie || '');
  return cookies.altezza_token || null;
}
