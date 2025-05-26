<template>
  <div v-if="loading" class="fixed end-2 bottom-2 text-sm px-5 py-2 bg-blue-400 text-blue-50 flex items-center gap-2 z-10">
    <Icon name="lucide:loader" class="animate-spin"/>
    Memuat data...
  </div>
</template>

<script setup lang="ts">
  const props = defineProps({
    loading: {
      type: Boolean,
      default: false
    }
  })
</script>