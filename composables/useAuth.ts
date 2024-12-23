export const useAuth = () => {   
    const { isAuthenticated,logout,login } = useSanctumAuth()

    const isLogin = isAuthenticated;
    
    const toLogout = async () => {
        try {
            await logout()
            navigateTo('/login')
        } catch (error) {
            console.error('Logout failed:', error);
        }
    }

    const toLogin = login;

    return {
        isLogin,
        toLogout,
        toLogin,
    };
}