import { useState } from 'react';
import { useDataStore } from '@/components/Inicialized/store/useDataStore';

export default function LoginForm() {
  const [correo, setCorreo] = useState('');
  const [pass, setPass] = useState('');
  const setUser = useDataStore((state) => state.setUser);

  const handleLogin = async () => {
    const res = await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, pass }),
    });

    const data = await res.json();
    if (res.ok) {
      setUser(data.usuario);
    } else {
      alert('Error al iniciar sesión');
    }
  };

  return (
    <div>
      <input value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="Correo" />
      <input type="password" value={pass} onChange={(e) => setPass(e.target.value)} placeholder="Contraseña" />
      <button onClick={handleLogin}>Iniciar sesión</button>
    </div>
  );
}
