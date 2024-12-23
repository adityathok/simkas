<template>
    <div class="flex items-center justify-between mb-2">

        <div class="flex items-center justify-start">
            <div class="md:hidden">
                <Button @click="$router.back()" size="small" severity="secondary" variant="link">
                    <Icon name="lucide:arrow-left" />
                </Button>
            </div>
            <div class="md:hidden ms-1">
                <Button @click="useGlobal.toggelsidebar()" size="small" severity="secondary" variant="link">
                    <Icon name="lucide:menu" />
                </Button>
            </div>
        </div>

        <div class="flex items-center justify-end">
            <Button class="me-2 !bg-transparent !text-slate-600 !border-none" variant="text">
                <Icon name="bi:bell" />
            </Button>
            
            <Avatar :image="avatar" shape="circle" class="object-cover" @click="toggleAvatar" />
            <Menu ref="menu" id="avatar_menu" :model="menuAvatar" :popup="true" />

        </div>
    </div>
    
</template>

<script setup>
const useGlobal = useGlobalStore()
const useUser = useUserStore()

const { toLogout } = useAuth()
const avatar = useUser.currentUser.avatar ? useGlobal.urlStorage+useUser.currentUser.avatar : '~/assets/img/ava-man.jpg';
const menu = ref();
const toggleAvatar = (event) => {
    menu.value.toggle(event);
};

 // Daftar Menu dengan label dinamis menggunakan user.name
 const menuAvatar = computed(() => {
    return [
        {
            label: useUser.currentUser.name,
            items: [
                {
                    label: 'Profile',
                    icon: 'pi pi-user',
                    command: () => navigateTo('/users/edit?id='+useUser.currentUser.id) 
                },
                { 
                    label: 'Logout',
                    icon: 'pi pi-sign-out',
                    command: () => toLogout() 
                }
            ]
        }
    ];
});

</script>