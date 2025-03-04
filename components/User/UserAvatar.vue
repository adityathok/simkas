<template>
  
  <img v-if="url" :src="url" :alt="'avatar '+name" class="rounded-full aspect-square object-cover" :width="size" :height="size" >
  <Avatar v-else :label="f_name" shape="circle" class="cursor-pointer" />

</template>

<script setup lang="ts">
  const props = defineProps(['url','name','size'])
  const url = props.url || '';
  const size = props.size||'32';
  const name = props.name||'User';

  const firstName = (name: any) => {
    return Array.from(name)[0];
  }
  const f_name = firstName(props.name) || props.name||'A';

</script>
