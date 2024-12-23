<template>

    <div class="fixed md:sticky top-0 overflow-y-auto md:start-0 z-20 px-2 pb-3 h-svh w-[90%] md:w-[14rem] bg-gradient-to-bl from-slate-900 to-slate-700 shadow md:shadow-none transition ease-in-out duration-100" :class="{'start-[0%]': useGlobal.opensidebar, 'start-[-100%]': !useGlobal.opensidebar}">

        <div class="flex items-center z-10 p-3 min-h-[5rem] mb-2 border-b border-zinc-500">
            <AppLogo />
        </div>

        <PanelMenu
            :model="items"
            class="w-full border-none rounded-none"
            v-model:expandedKeys="expandedKeys"
            :pt="{
                panel: (options) => ({
                    class: [
                        '!border-none',
                        '!bg-transparent'
                    ]
                }),
                rootList: (options) => ({
                    class: [
                        '!ps-0',
                    ]
                })
            }"
        >
            <template #item="{ item }">
                <button v-if="item.items" v-ripple :class="[classLink,{'bg-blue-600 text-white hover:text-slate-500 shadow' : isActive(item.href)}]">
                    <span class="flex justify-start items-center">
                        <Icon v-if="item.icon" :name="item.icon" :ssr="true" class="mr-2"/>
                        <span>{{ item.label }}</span>
                    </span>
                    <Icon v-if="item.items" name="lucide:chevron-down" />
                </button>
                <NuxtLink v-else :to="item.href" :class="[classLink,{'bg-blue-600 text-white hover:text-slate-500 shadow' : isActive(item.href)}]">
                    <span class="flex justify-start items-center">
                        <Icon v-if="item.icon" :name="item.icon" :ssr="true" class="mr-2"/>
                        <span :class="{'ml-5':item.key.includes('_')}">{{ item.label }}</span>
                    </span>
                </NuxtLink>
            </template>
        </PanelMenu>       

    </div>

    <div v-if="useGlobal.opensidebar" class="fixed md:hidden h-svh z-10 top-0 bottom-0 end-0 start-0 backdrop-blur-sm bg-white/30" @click="useGlobal.toggelsidebar"></div>
    
</template>

<script setup>
const useGlobal = useGlobalStore()

//route, cek halaman aktif
const route = useRoute()
const isActive = (path) => {
  return route.path === path
}

//expand menu
const expandedKeys = ref({});
const expandNode = (node) => {
    if (node.items && node.items.length) {
        expandedKeys.value[node.key] = true;

        for (let child of node.items) {
            expandNode(child);
        }
    }
};

onMounted(() => {
    //expand menu active
    for (let node of items.value) {
        if(node.items){
            for (let child of node.items) {                
                if(route.path === child.href){   
                    expandedKeys.value[node.key] = true;
                }
            }
        }
    }
})


//class untuk tombol menu
const classLink = 'w-full flex items-center justify-between px-4 py-2 cursor-pointer rounded text-white hover:text-slate-900 hover:bg-white hover:shadow';

//daftar menu
const items = ref([
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'lucide:layout-grid',
        href:'/',
    },
    {
        key: 'siswa',
        label: 'Siswa',
        icon: 'lucide:users',
        items: [
            {
                key: 'siswa_data',
                label: 'Data Siswa',
                href:'/siswa',
            },
            {
                key: 'siswa_tambah',
                label: 'Tambah Siswa',
                href:'/siswa/create',
            },
            {
                key: 'siswa_naik',
                label: 'Naik Kelas',
                href:'/siswa/naikkelas',
            }
        ]
    },
    {
        key: 'unit',
        label: 'Unit Sekolah',
        icon: 'lucide:school',
        items: [
            {
                key: 'unit_create',
                label: 'Daftar Unit',
                href:'/unitsekolah',
            },
            {
                key: 'unit_add',
                label: 'Tambah Unit',
                href:'/unitsekolah/create',
            },
            {
                key: 'unit_add_2',
                label: 'Naik Kelas',
                href:'/siswa/naikkelas',
            }
        ]
    },
    {
        key: 'settings',
        label: 'Pengaturan',
        icon: 'lucide:settings',
        items: [
            {
                key: 'settings_0',
                label: 'Umum',
                href:'/settings/umum',
            },
            {
                key: 'settings_1',
                label: 'Jenjang',
                href:'/settings/jenjang',
            }
        ]
    },
    {
        key: 'users',
        label: 'Users',
        icon: 'lucide:square-user',
        items: [
            {
                key: 'users_all',
                label: 'Semua User',
                href:'/users',
            },
            {
                key: '3_1',
                label: 'Tambah User',
                href:'/users/create',
            }
        ]
    },
]);

</script>