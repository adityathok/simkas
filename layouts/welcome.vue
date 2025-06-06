<template>

  <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-3 h-screen lg:overflow-hidden bg-left-top bg-cover bg-[url(public/bg-welcome.webp)]">

      <div class="xl:col-span-4 lg:col-span-5 md:col-span-6 col-span-12 lg:p-0 p-6">
        <div class="bg-white dark:bg-dark md:h-full flex flex-col justify-between items-center p-8">

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

          <div class="pt-5">
            <AppCopyright/>
          </div>

        </div>
      </div>

      <div class="xl:col-span-8 lg:col-span-7 md:col-span-6 col-span-12 lg:block hidden">
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