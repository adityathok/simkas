import { defineStore } from 'pinia'

export const useConfigStore = defineStore('config', () => {

    const opensidebar = ref(false)
    function toggelsidebar() {
        opensidebar.value = !opensidebar.value
    }

    const client = useSanctumClient(); 
    const loading = ref(false as any);
    const error = ref('' as any);
    const configApp = reactive({} as any)
    
    const config = ref({
        year: new Date().getFullYear(),
        app_name: '',
        app_description: '',
        app_logo: '',
        app_favicon: '',
        user: {
            avatar: '',
            name: 'User',
            id: '',
        },
        role: 'user',
        roles: [],
        permissions: [],
        app_menus: []
    } as any)

    // Action untuk mengambil data dari API
    const setConfig = async () => {
        loading.value = true;
        error.value = null;

        try {
            const res = await client('/api/config_app')
            configApp.value = res

            config.value.app_logo = res.app_logo
            config.value.app_name = res.app_name
            
            config.value.user.avatar = res.user.avatar
            config.value.user.name = res.user.name
            config.value.user.id = res.user.id

            config.value.roles = res.roles
            config.value.permissions = res.permissions
            config.value.app_menus = res.app_menus

        } catch(er){
            error.value = er
        } finally {
            loading.value = false;
        }
    }

    return {
        opensidebar,
        toggelsidebar,
        configApp,
        setConfig,
        config
    }
})