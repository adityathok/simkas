<template>
    
    <template v-if="!isLogin">
      <div class="mb-3 pb-3 border-b text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          Login
        </h1>
      </div>
      <AuthLoginForm />
    </template>
    
    <template v-if="isLogin">
      <div class="mb-5 pb-3 border-b">
        <h1 class="text-xl text-center font-bold">
          Anda sudah masuk
        </h1>
      </div>
      <div class="flex justify-between">
        <Button @click="navigateTo('/dashboard')" label="Dashboard" class="w-full md:w-[48%] md:mb-0 mb-2" outlined/>
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