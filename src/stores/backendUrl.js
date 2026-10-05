import { defineStore } from 'pinia';

export const useBackendUrl = defineStore({
    id: 'BackendUrl',
    state: () => ({
        //backendUrl: 'https://klinik-system.com'
        backendUrl: 'https://api.iaclinic.pk'
    }),
});

