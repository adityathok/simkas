<template>
  <Badge :severity="setSeverenity()" size="small" class="capitalize !font-normal text-xs">
    {{ status }}
  </Badge>
</template>

<script setup lang="ts">
const props = defineProps(['status'])
const status = ref('')

watch(
  () => props.status,
  (newstatus) => {
    status.value = newstatus
  },
  { immediate: true }
)

const setSeverenity = () => {
  if(status.value=='lunas'){
    return 'success'
  } else if(status.value=='batal'){
    return 'danger'
  } else {
    return 'contrast'
  }
}
</script>