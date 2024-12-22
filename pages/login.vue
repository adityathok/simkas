<script setup lang="ts">
  definePageMeta({
      layout: 'welcome',
      sanctum: {
          excluded: true,
      }
  })
  const { isLogin,toLogout } = useAuth()
</script>

<template>

  <template v-if="!isLogin">
      <div class="mb-3 pb-3 border-b text-center">
        <h1 class="text-2xl font-semibold tracking-tight">
          Login
        </h1>
      </div>
  </template>

  <div>
    <AuthLoginform/>
  </div>
</template>
