export const useGlobalStore = defineStore('global', () => {
    const config = useSanctumConfig();
    const client = useSanctumClient();

    const opensidebar = ref(false)

    function toggelsidebar() {
        opensidebar.value = !opensidebar.value
    }

    const urlStorage = config.baseUrl+'/storage/'

    //fungsi infoApp
    const infoApp = ref({
        lembaga: ''
    })

    //set infoApp
    function setInfoApp(data) {
        infoApp.value = data
    }

    return { 
        opensidebar,
        toggelsidebar,
        urlStorage,
        setInfoApp,
        infoApp
    }
})