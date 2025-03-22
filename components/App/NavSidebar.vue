<template>
  <div class="h-full left-0 top-0 w-64 fixed bg-slate-50 z-6 border-r border-border px-4">
    
    <div class="py-6 px-2 flex justify-center brand-logo overflow-hidden">
       <AppLogo />    
    </div>

    <ScrollPanel style="width: 100%; height: calc(100vh - 7rem)">
        <PanelMenu
        :model="items"
        class="w-full border-none rounded-none gap-0!"
        :pt="{
            panel: (options) => ({
                class: [
                    'border-none!',
                    'bg-transparent!'
                ]
            }),
            rootList: (options) => ({
                class: [
                    'ps-0!',
                ]
            })
        }"
        v-model:expandedKeys="expandedKeys"
        >
        <template #item="{ item }">

                <button v-if="item.items" :class="classLink">
                    <div class="flex justify-between items-center w-full">
                        <span class="flex justify-start items-center w-full">
                            <Icon v-if="item.icon" :name="item.icon"  :ssr="true" class="mr-2"/>
                            <span>{{ item.label }}</span>
                        </span>                    
                        <Icon v-if="expandedKeys[item.key!]" name="lucide:chevron-down"  :ssr="true"/>
                        <Icon v-else name="lucide:chevron-up"  :ssr="true"/>
                    </div>
                </button>
                <NuxtLink v-else :to="item.route" :class="[classLink,{'bg-blue-500! text-white!':isActive(item.route)}]" @click="useGlobal.toggelsidebar">
                    <span class="flex justify-start items-center w-full">
                        <Icon v-if="item.icon" :name="item.icon"  :ssr="true" class="mr-2"/>
                        <Icon v-else name="lucide:circle" size="8"  :ssr="true" class="mr-2"/>
                        <span>{{ item.label }}</span>
                    </span>
                </NuxtLink>
                                    
            </template>
        </PanelMenu>
    </ScrollPanel>
    
  </div>
</template>

<script setup lang="ts">

const useGlobal = useGlobalStore()

//route, cek halaman aktif
const route = useRoute()
const isActive = (path: string) => {
  return route.path === path
}

//expand menu
const expandedKeys = ref({} as any);
const expandNode = (node : any) => {
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
                if(route.path === child.route){   
                    expandedKeys.value[node.key] = true;
                } else {
                    expandedKeys.value[node.key] = false;
                }
            }
        }
    }
})

watch(() => expandedKeys, () => {
    //expand menu active
    for (let node of items.value) {
        if(node.items){
            for (let child of node.items) {                
                if(route.path === child.route){   
                    expandedKeys.value[node.key] = true;
                }
            }
        }
    }
})

//class untuk tombol menu
const classLink = 'w-full flex items-center justify-start rounded-md px-2.5 py-2.5 mb-0.5 gap-3 text-start leading-[normal] font-normal hover:bg-blue-100 hover:text-blue-800 text-link bg-transparent group/link cursor-pointer';

//daftar menu
const items = ref([
    {
        key: 'dashboard',
        label: 'Dashboard',
        icon: 'lucide:layout-grid',
        route:'/',
    },
    {
        key: 'akuntansi',
        label: 'Akuntansi',
        icon: 'lucide:calculator',
        items: [
            {
                key: 'akun_pendapatan',
                label: 'Akun Pendapatan',
                route:'/akunpendapatan',
            },
            {
                key: 'akun_pengeluaran',
                label: 'Akun Biaya',
                route:'/akunpengeluaran',
            },
            {
                key: 'jurnlkas',
                label: 'Jurnal',
                route:'/jurnalkas',
            },
            {
                key: 'akun_rekening',
                label: 'Akun Rekening',
                route:'/akunrekening',
            },
        ]
    },
    {
        key: 'siswa',
        label: 'Siswa',
        icon: 'lucide:users',
        items: [
            {
                key: 'siswa_data',
                label: 'Data Siswa',
                route:'/siswa',
            },
            {
                key: 'siswa_tambah',
                label: 'Tambah Siswa',
                route:'/siswa/create',
            },
            {
                key: 'siswa_naik',
                label: 'Naik Kelas',
                route:'/siswa/naikkelas',
            },
            {
                key: 'siswa_import',
                label: 'Import Siswa',
                route:'/siswa/import',
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
                label: 'Semua Unit',
                route:'/unitsekolah',
            },
            {
                key: 'unit_kelas',
                label: 'Kelas',
                route:'/kelas',
            },
        ]
    },
    {
        key: 'pegawai',
        label: 'Pegawai',
        icon: 'lucide:circle-user',
        items: [
            {
                key: 'pegawai_all',
                label: 'Semua Pegawai',
                route:'/pegawai',
            },
            {
                key: 'pegawai_add',
                label: 'Tambah Pegawai',
                route:'/pegawai/add',
            },
        ]
    },
    {
        key: 'pengaturan',
        label: 'Pengaturan',
        icon: 'lucide:settings',
        // route:'/pengaturan',
        items: [
            {
                key: 'pengaturan_lembaga',
                label: 'Lembaga',
                route:'/pengaturan',
            },
            {
                key: 'pengaturan_tahunajaran',
                label: 'Tahun Ajaran',
                route:'/pengaturan/tahunajaran',
            },
            {
                key: 'pengaturan_jenjang',
                label: 'Jenjang',
                route:'/pengaturan/jenjang',
            },
            {
                key: 'pengaturan_jabatan',
                label: 'Jabatan',
                route:'/pengaturan/jabatan',
            },
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
                route:'/users',
            },
            {
                key: '3_1',
                label: 'Tambah User',
                route:'/users/create',
            }
        ]
    },
]);
</script>
