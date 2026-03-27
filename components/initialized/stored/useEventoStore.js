import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { buildClientModuleState, getDefaultClientModuleState } from '@/components/constants/clientModules';

const initialModules = getDefaultClientModuleState();

const useEventoStore = create(
  persist(
    (set) => ({
      idEventoActivo: null,
      modulosCliente: initialModules,
      loadingModulosCliente: false,
      hasResolvedModulosCliente: false,
      errorModulosCliente: null,

      setEventoActivo: ({ idEventoActivo, modulosCliente }) =>
        set((state) => ({
          idEventoActivo: idEventoActivo || null,
          modulosCliente: modulosCliente ? buildClientModuleState(modulosCliente) : state.modulosCliente,
          hasResolvedModulosCliente: modulosCliente ? true : state.hasResolvedModulosCliente,
          errorModulosCliente: null,
        })),

      setEventoActivoById: (idEventoActivo) =>
        set({
          idEventoActivo: idEventoActivo || null,
          modulosCliente: initialModules,
          loadingModulosCliente: false,
          hasResolvedModulosCliente: false,
          errorModulosCliente: null,
        }),

      setLoadingModulosCliente: (loadingModulosCliente) => set({ loadingModulosCliente }),

      setErrorModulosCliente: (errorModulosCliente) => set({
        errorModulosCliente,
        hasResolvedModulosCliente: true,
      }),

      clearEventoActivo: () =>
        set({
          idEventoActivo: null,
          modulosCliente: initialModules,
          loadingModulosCliente: false,
          hasResolvedModulosCliente: false,
          errorModulosCliente: null,
        }),
    }),
    {
      name: 'altezza-evento',
      partialize: (state) => ({
        idEventoActivo: state.idEventoActivo,
        modulosCliente: state.modulosCliente,
        hasResolvedModulosCliente: state.hasResolvedModulosCliente,
      }),
    }
  )
);

export default useEventoStore;
