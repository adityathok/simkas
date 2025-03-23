<template>
  <Badge :severity="setSeverenity()" size="small" class="capitalize !font-normal text-xs">
    {{ arus }}
  </Badge>
</template>

<script setup lang="ts">
const props = defineProps(['arus'])
const arus = ref('')

watch(
  () => props.arus,
  (newstatus) => {
    arus.value = newstatus
  },
  { immediate: true }
)

const setSeverenity = () => {
  if(arus.value=='masuk'){
    return 'success'
  } else {
    return 'danger'
  }
}
</script>