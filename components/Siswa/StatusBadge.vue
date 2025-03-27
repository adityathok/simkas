<template>
  <Badge size="small" class="capitalize" :severity="setSeverenity()">
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
    if (status.value == 'aktif') {
      return 'success'
    } else if (status.value == 'keluar') {
      return 'danger'
    } else if (status.value == 'pindah') {
      return 'info'
    } else if (status.value == 'Aktif') {
      return 'success'
    } else {
      return 'secondary'
    }
  }

</script>