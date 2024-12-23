export const useGlobalStore = defineStore('global', () => {
    const config = useSanctumConfig();

    const opensidebar = ref(false)

    function toggelsidebar() {
        opensidebar.value = !opensidebar.value
    }

    const urlStorage = config.baseUrl+'/storage/'
  
    return { 
        opensidebar,
        toggelsidebar,
        urlStorage
    }
})