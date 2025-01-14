<template>

  <div class="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative flex h-full md:items-center pt-20 p-6 lg:p-8">
      <div class="mx-auto flex w-full flex-col md:justify-center space-y-6 sm:w-[350px]">
        <div class="max-w-30 font-bold pb-4">
          <AppLogo />
        </div>
        <slot />
      </div>
    </div>
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div class="absolute inset-0 bg-[url('~/public/dose-media-bU6JyhSI6zo-unsplash.jpg')] bg-cover bg-center"></div>
    </div>
  </div>  

</template>
