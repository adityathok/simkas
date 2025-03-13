<template>

  <div class="relative overflow-hidden h-screen">
    <div class="p-5 lg:bg-transparent lg:dark:bg-transparent bg-sky-100 lg:fixed top-0 z-50 w-full">
      <AppLogo />
    </div>

    <div class="grid grid-cols-12 gap-3 h-screen bg-white dark:bg-dark">

      <div class="xl:col-span-8 lg:col-span-7 col-span-12 bg-sky-100 lg:block hidden relative overflow-hidden">
        <div class="flex justify-center h-screen items-center z-10 relative">
          <div class="xl:w-5/12 lg:w-10/12 xl:px-0 px-6">
            <img src="~/public/8454.webp" alt="" class="max-w-[450px]">
          </div>
        
          <div class="absolute bottom-0 start-0 z-10">
            <AppCopyright/>
          </div>

        </div>
      </div>
      <div class="relative xl:col-span-4 lg:col-span-5 col-span-12 sm:px-12 p-5">
        <div class="flex flex-col justify-center h-screen items-center z-10 relative">
          <slot />
        </div>

      </div>

    </div>
  </div>

</template>

<script setup lang="ts">
</script>