<template>
  
  <div v-if="items" class="overflow-x-auto">
    <nav class="flex gap-1 items-center">
      <div v-for="item in items" :key="item.label" class="whitespace-nowrap">

        <Button as="router-link" :to="item.route" class="relative !rounded-none font-medium" variant="text" :class="{ 'text-sky-600': item.route === active }">
          <span>{{ item.label }}</span>
          <span v-if="item.route === active" class="absolute bottom-0 left-0 w-full h-[1px] bg-sky-500"></span>
        </Button>
        
      </div>
    </nav>
  </div>

</template>

<script setup lang="ts">
const props = defineProps(['items','active'])
const items = props.items || {}
const active = props.active || ''
</script>
