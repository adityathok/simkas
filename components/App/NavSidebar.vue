<template>
  <div class="h-full left-0 top-0 w-64 fixed bg-slate-100 dark:bg-zinc-900 z-6 border-r border-zinc-100 dark:border-zinc-700 shadow px-4">
    
    <div class="py-6 px-2 flex justify-center brand-logo overflow-hidden">
       <AppLogo />    
    </div>
    <ScrollPanel style="width: 100%; height: calc(100vh - 7rem)">
        <PanelMenu
            v-if="items"
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
                <NuxtLink v-else :to="item.route" :class="[classLink,{'bg-blue-500! dark:bg-blue-700! text-white!':isActive(item.route)}]" @click="useGlobal.toggelsidebar">
                    <span class="flex justify-start items-center w-full">
                        <Icon v-if="item.icon" :name="item.icon"  :ssr="true" class="mr-2"/>
                        <Icon v-else name="lucide:circle" size="8"  :ssr="true" class="mr-2"/>
                        <span>{{ item.label }}</span>
                    </span>
                </NuxtLink>
                                    
            </template>
        </PanelMenu>

        <div v-else>
            <template v-for="i in 8">
                <div class="flex mb-2 px-2">
                    <Skeleton width="2.5rem" height="2rem" class="mr-3"/>
                    <Skeleton height="2rem"/>
                </div>
            </template>
        </div>

    </ScrollPanel>
    
  </div>
</template>

<script setup lang="ts">

const useGlobal = useGlobalStore()
const { config } = useConfigStore()

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
const classLink = 'w-full flex items-center justify-start px-2.5 py-2.5 mb-0.5 gap-3 text-start leading-[normal] font-normal hover:bg-blue-100 hover:text-blue-800 text-link bg-transparent group/link cursor-pointer';

//daftar menu
const items = computed(() => {
    return config.app_menus
})

</script>
