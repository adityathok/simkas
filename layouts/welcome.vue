<template>

  <div class="relative overflow-hidden h-screen">
    
    <div class="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-dark">

      <div class="xl:col-span-8 lg:col-span-7 col-span-12 lg:block hidden relative overflow-hidden bg-left-top bg-cover bg-[url(public/bg-welcome.webp)]">
        <div class="flex justify-center h-screen items-center z-10 relative">
          <div class="xl:w-5/12 lg:w-10/12 xl:px-0 px-6">
          </div>  
        </div>
      </div>

      <div class="relative xl:col-span-4 lg:col-span-5 col-span-12 sm:px-12 p-5">
        <div class="flex flex-col justify-between h-screen items-center z-10 relative">
          <div>
            <div class="flex items-start gap-2 mb-2 md:pt-10">
                <img v-if="useConfig.config.logo" :src="useConfig.config.logo" alt="Logo App" class="max-h-10">
                <img v-else src="~/public/logo.png" alt="Logo App" class="max-h-10">
                <div :class="{ 'md:hidden': useConfig.miniSidebar }">
                    <div class="text-sm font-bold">SIMKAS</div>
                    <div class="text-xs">{{ useConfig.config.lembaga }}</div>
                </div>
              </div>
          </div>
          <slot />

          <div class="pb-5">
            <AppCopyright/>
          </div>
        </div>

      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
const useConfig = useConfigStore()
// Ambil state dan action dari store
const { setConfig, configApp } = useConfigStore();
onMounted( async () => {
    setConfig()
});
</script>