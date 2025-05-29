<template>
    
    <div v-if="!isLogin" class="max-w-lg pt-10">      
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