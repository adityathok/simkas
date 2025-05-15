<template>

    <div class="flex w-full min-h-screen">
        <div class="xl:ms-64 flex w-full">

            <div class="xl:block hidden" :class="{'block! relative z-20':useGlobal.opensidebar}">
                <div class="flex">
                    <AppNavSidebar/>
                </div>
            </div>
            <div class="body-wrapper w-full bg-white dark:bg-zinc-900">

                <AppNavHeader />

                <div class="container mx-auto min-h-[85vh] p-6">

                    <div v-if="$route.meta.title" class="relative overflow-hidden bg-blue-100 dark:bg-slate-700 min-h-20 flex justify-start items-center px-5 py-3 md:py-5 xl:py-6 mb-6">
                        <div>
                            <h1 class="text-lg md:text-xl font-medium text-slate-900 dark:text-blue-200">
                                {{ $route.meta.title }}
                            </h1>
                            <div v-if="$route.meta.description">
                                <span class="mt-2 text-xs md:text-sm text-slate-500">{{ $route.meta.description }}</span>
                            </div>
                            <div v-else class="mt-2 text-xs md:text-sm flex justify-start items-center">
                                <NuxtLink to="/" class="opacity-50">Home</NuxtLink>
                                <Icon name="lucide:dot" size="1em"  :ssr="true" class="mt-1"/>
                                <span class="opacity-70">{{ $route.meta.title }}</span>
                            </div>
                        </div>
                    </div>

                    <slot />
                </div>

                <div class="text-end">
                    <AppCopyright />
                </div>

                <div v-if="useGlobal.opensidebar" class="fixed md:hidden h-svh z-10 top-0 bottom-0 end-0 start-0 bg-black opacity-50" @click="useGlobal.toggelsidebar"></div>

            </div>

        </div>
    </div>

</template>

<script setup lang="ts">
const useGlobal = useGlobalStore()
const $route = useRoute()

// Ambil state dan action dari store
const { setConfig } = useConfigStore();

onMounted( async () => {
    await setConfig()
});
</script>