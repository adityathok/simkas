<template>
  <Button @click="setColorTheme" class="!px-2" variant="text">
    <Icon v-if="colorTheme === 'dark'" name="lucide:sun" :ssr="true"/>
    <Icon v-else name="lucide:moon" :ssr="true"/>
  </Button>

</template>

<script setup lang="ts">
//get local storage = color-theme
const colorTheme = ref(localStorage.getItem('theme') || 'light');

//set local storage = color-theme
const setColorTheme = () => {
  if (localStorage.getItem('theme') === 'light') {
    localStorage.setItem('theme', 'dark');
    //set dark mode
    document.documentElement.classList.add('dark');
  } else {
    localStorage.setItem('theme', 'light');
    //set light mode
    document.documentElement.classList.remove('dark');
  }
  colorTheme.value = localStorage.getItem('theme') || 'light';
}

//onmounted
onMounted(() => {
  if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
})

</script>
