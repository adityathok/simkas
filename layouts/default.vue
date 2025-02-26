<template>

    <div class="flex w-full min-h-screen">
        <div class="md:ms-64 flex w-full">

            <div class="xl:block hidden" :class="{'block':useGlobal.opensidebar}">
                <div class="flex">
                    <AppNavSidebar/>
                </div>
            </div>
            <div class="body-wrapper w-full bg-white">

                <AppHeader />

                <div class="container mx-auto min-h-[85vh] p-6">

                    <div class="flex flex-col justify-center align bg-blue-100 rounded-lg p-5 mb-4 md:min-h-[6rem]">                        
                        <h1 class="text-lg font-medium text-gray-900">
                            {{ $route.meta.title }}
                        </h1>
                    </div>

                    <slot />
                </div>

                <AppFooter />
            </div>

        </div>
    </div>
  
</template>

<script setup lang="ts">
const useGlobal = useGlobalStore()
const client = useSanctumClient(); 
const { setInfoApp,infoApp } = useGlobalStore()   
const { data } = await useAsyncData(
    'app',
    () => client('/infoapp')
)
setInfoApp(data.value)
</script>