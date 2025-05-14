import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useUsuarioStore = create(
  persist(
    (set, get) => ({
      usuario: null,
      setUsuario: (usuario) => set({ usuario }),
      clearUsuario: () => set({ usuario: null }),

      dataUsuario: null,
      setDataUsuario: (data) => set({ dataUsuario: data }),
      clearDataUsuario: () => set({ dataUsuario: null }),

      uiPermisos: [],
      setUiPermisos: (permisos) => set({ uiPermisos: permisos }),
      clearUiPermisos: () => set({ uiPermisos: [] }),
    }),

    {
      name: 'altezza-usuario', // 👈 clave diferente a 'mako-usuario'
      partialize: (state) => ({
        usuario: state.usuario,
        uiPermisos: state.uiPermisos,
      }),
    }
  )
);

export default useUsuarioStore;
