import { defineStore } from 'pinia'

export const useTagihanStore = defineStore('tagihan', () => {
 
    const tagihans = ref([])
    function setTagihans(data:any) {
        tagihans.value = data 
    }
    
    return {
        tagihans,
        setTagihans
    }
})