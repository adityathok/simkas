export const useUserStore = defineStore('user', () => {  
    
    const { isAuthenticated, user, refreshIdentity } = useSanctumAuth()

    const isLogin = isAuthenticated;
    const currentUser = ref(user)

    const refreshUser = async () => {
        await refreshIdentity()
        currentUser.value = user
    }
  
    return { 
        isLogin, 
        currentUser,
        refreshUser
    }
})