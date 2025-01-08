<template>
  
  <img v-if="url" :src="url" alt="" class="rounded aspect-square object-cover" :width="size" :height="size" >
  <Avatar v-else :label="name" shape="circle" class="cursor-pointer" />

</template>

<script setup lang="ts">
  const props = defineProps(['url','name','size'])
  const url = props.url || '';
  const size = props.size||'32';

  const firstName = (name: any) => {
    return Array.from(name)[0];
  }
  const name = firstName(props.name) || props.name||'A';

</script>
