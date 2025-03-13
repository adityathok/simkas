<template>

    <div class="flex w-full min-h-screen">
        <div class="xl:ms-64 flex w-full">

            <div class="xl:block hidden" :class="{'block! relative z-20':useGlobal.opensidebar}">
                <div class="flex">
                    <AppNavSidebar/>
                </div>
            </div>
            <div class="body-wrapper w-full bg-sky-50">

                <AppNavHeader />

                <div class="container mx-auto min-h-[85vh] p-6">

                    <div v-if="$route.meta.title" class="relative overflow-hidden bg-blue-100 rounded-md min-h-20 flex justify-start items-center px-5 py-3 md:py-5 xl:py-6 mb-6">
                        <div>
                            <h1 class="text-lg md:text-xl font-medium text-slate-900">
                                {{ $route.meta.title }}
                            </h1>
                            <div class="mt-2 text-xs md:text-sm flex justify-start items-center">
                                <NuxtLink to="/" class="opacity-50">Home</NuxtLink>
                                <Icon name="lucide:dot" size="1em"  :ssr="true" class="mt-1"/>
                                <span class="opacity-70">{{ $route.meta.title }}</span>
                            </div>
                        </div>
                        <img src="~/public/logo.png" alt="Logo App" class="h-25 md:h-30 opacity-20 rotate-12 absolute right-0 top-0 z-1">
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
</script>