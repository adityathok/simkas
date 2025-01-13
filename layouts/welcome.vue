<template>

  <div class="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative flex h-full items-center pt-20 p-6 lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <slot />
      </div>
      <div class="absolute font-bold flex justify-start top-0 left-0 right-0 p-4">
        <AppLogo />
      </div>
    </div>
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div class="absolute inset-0 bg-[url('~/public/dose-media-bU6JyhSI6zo-unsplash.jpg')] bg-cover bg-center"></div>
    </div>
  </div>  

</template>
