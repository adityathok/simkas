import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {

    const opensidebar = ref(false)
    function toggelsidebar() {
        opensidebar.value = !opensidebar.value
    }

    const client = useSanctumClient(); 
    const configApp = reactive({} as any)
    const loading = ref(false as any);
    const error = ref('' as any);

    // Action untuk mengambil data dari API
    const setConfig = async () => {
        loading.value = true;
        error.value = null;

        try {
            const res = await client('/api/config_app')
            configApp.value = res
        } catch(er){
            error.value = er
        } finally {
            loading.value = false;
        }
    }

    return {
        opensidebar,
        toggelsidebar,
        setConfig,
        configApp
    }
})