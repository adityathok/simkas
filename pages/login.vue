<template>
    
    <div v-if="!isLogin" class="max-w-lg">
      <div class="mb-3 pb-3 w-full border-b">
        <h1 class="text-2xl font-semibold tracking-tight">
          Selamat Datang,
        </h1>
        <h3 class="text-sm text-slate-500">
          Silahkan login untuk masuk
        </h3>
      </div>
      <AuthLogin/>
    </div>
    
    <template v-if="isLogin">
      <div class="mb-5 pb-3 border-b">
        <h1 class="text-xl font-bold">
          Anda sudah masuk
        </h1>
      </div>
      <div class="flex flex-col gap-4 w-full items-center">
        <Button @click="navigateTo('/')" label="Dashboard" class="w-full md:w-[48%] md:mb-0 mb-2" outlined />
        <Button @click="toLogout" label="Logout" class="w-full md:w-[48%]" />
      </div>
    </template>

</template>

<script lang="ts" setup>
  definePageMeta({
    layout: 'welcome',
    sanctum: {
        excluded: true,
    }
  })
  const { isLogin,toLogout } = useAuth()

</script>