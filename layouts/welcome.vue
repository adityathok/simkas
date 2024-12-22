<template>

  <div class="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
    <div class="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
      <div class="absolute inset-0 bg-[url('~/assets/img/welcome.webp')] bg-cover bg-center"></div>
      <div class="relative z-20 flex items-center text-lg font-medium">
        <AppLogo />
      </div>
    </div>
    <div class="flex h-full items-center p-6 lg:p-8">
      <div class="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <slot />
      </div>
    </div>
  </div>  

</template>
