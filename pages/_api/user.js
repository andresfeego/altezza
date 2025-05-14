import { getCookie } from '@/utils/cookies';
import { verificarToken } from '@/utils/auth';

export default function handler(req, res) {
  const token = getCookie(req);
  const datos = verificarToken(token);
  if (!datos) return res.status(401).end();
  res.status(200).json({ usuario: datos });
}
