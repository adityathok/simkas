<template>
    <header class="sticky z-[5] bg-white w-full py-4 sm:px-6">
            <div class="flex items-center justify-between">

                <div class="flex items-center justify-start">
                    
                    <button type="button" @click="$router.back()" class="py-1 px-2">
                        <Icon name="lucide:chevron-left" mode="svg" />
                    </button>
                    <h1 class="text-lg font-medium text-gray-900">
                        {{ $route.meta.title }}
                    </h1>
                </div>

                <div class="flex items-center justify-end">
                    <Button class="me-2 !bg-transparent !text-slate-600 !border-none" variant="text">
                        <Icon name="bi:bell" />
                    </Button>
                    
                    <img v-if="avatar" :src="avatar" alt="" class="rounded-full aspect-square object-cover" width="32" height="32" @click="toggleAvatar">
                    <Avatar v-else :label="firstName(user.name)" shape="circle" class="cursor-pointer" @click="toggleAvatar" />

                    <Menu ref="menu" id="avatar_menu" :model="menuAvatar" :popup="true" />

                    <div class="md:hidden ms-1">
                        <Button @click="useGlobal.toggelsidebar()" size="small" severity="secondary" variant="link">
                            <Icon name="lucide:menu" />
                        </Button>
                    </div>

                </div>
            </div>

    </header>
    
</template>

<script setup>
const useGlobal = useGlobalStore()
const useUser = useUserStore()
const user = useSanctumUser();

const { toLogout } = useAuth()
const avatar = user.value.avatar ? user.value.avatar : '';
const menu = ref();
const toggleAvatar = (event) => {
    menu.value.toggle(event);
};

const firstName = (name) => {
    return Array.from(name)[0];
}

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