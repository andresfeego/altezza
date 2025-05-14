import { crearToken } from '@/utils/auth';
import { setCookie } from '@/utils/cookies';
import { loginUsuario } from '@/components/inicialized/data/helpersGetDB';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { correo, pass } = req.body;

  try {
    // 🔁 Llama al helper que usa getDB para contactar el backend real
    const result = await loginUsuario(correo, pass);

    if (!result?.id) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // 🔐 Crear token y setear cookie
    const token = crearToken({ id: result.id, nombre: result.nombre });
    setCookie(res, token);

    // ✅ Respuesta exitosa
    res.status(200).json({ usuario: { id: result.id, nombre: result.nombre } });
  } catch (error) {
    console.error('[API Login] 🧨 Error al iniciar sesión:', error.message);
    res.status(500).json({ error: 'Error interno al iniciar sesión' });
  }
}
