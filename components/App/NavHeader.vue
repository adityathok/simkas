<template>
  <header class="sticky top-0 shadow-xs z-5 bg-white w-full py-4 px-4 sm:px-6">
          <div class="flex items-center justify-between">

              <div class="flex items-center justify-start">
                  
                  <div class="xl:hidden ms-1">
                      <Button @click="useGlobal.toggelsidebar()" size="small" severity="secondary" variant="link">
                          <Icon name="lucide:menu"  size="1.5rem"/>
                      </Button>
                  </div>
                  <span class="hidden md:block">
                      <Button severity="secondary" variant="text" @click="$router.back()">
                          <Icon name="lucide:move-left"  />
                      </Button>
                  </span>
                  <span class="hidden md:block">
                      <Button severity="secondary" variant="text" label="Show Search" @click="visibleSearch = true">
                          <Icon name="lucide:search"  />
                      </Button>

                      <Dialog v-model:visible="visibleSearch" modal header="Pencarian" :closeOnEscape="true" :dismissableMask="true" :style="{ width: '50rem' }">
                        <AppNavCariSiswa @openSiswa="visibleSearch = false"/>
                      </Dialog>
                  </span>
                  <span class="md:hidden">
                      <AppLogo />
                  </span>

              </div>

              <div class="flex items-center justify-end">
                  <Button class="me-2 bg-transparent! text-slate-600! border-none!" variant="text">
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bell"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
                  </Button>
                  
                  <img v-if="avatar" :src="avatar" alt="" class="rounded-full aspect-square object-cover" width="32" height="32" @click="toggleAvatar">
                  <Avatar v-else :label="firstName(user.name)" shape="circle" class="cursor-pointer" @click="toggleAvatar" />

                  <Menu ref="menu" id="avatar_menu" :model="menuAvatar" :popup="true" />

              </div>
          </div>

  </header>
  
</template>

<script setup>
const useGlobal = useGlobalStore()
const useUser = useUserStore()
const user = useSanctumUser();
const visibleSearch = ref(false);

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