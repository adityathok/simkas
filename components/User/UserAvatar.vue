<template>
  
  <img v-if="avatar" :src="avatar" alt="" class="rounded-full aspect-square object-cover" :width="size" :height="size" >
  <Avatar v-else :label="firstName(nama)" shape="circle" class="cursor-pointer" />

</template>

<script setup lang="ts">
  const props = defineProps(['url','nama','size'])
  const avatar = props.url || '';
  const nama = props.nama||'A';
  const size = props.size||'32';

  const firstName = (name) => {
    return Array.from(name)[0];
  }

</script>
