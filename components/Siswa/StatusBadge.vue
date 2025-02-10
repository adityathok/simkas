<template>
  <Tag :severity="setSeverenity()">
    {{ status }}
  </Tag>
</template>

<script setup lang="ts">
  const props = defineProps(['status'])
  const status = props.status

  const setSeverenity = () => {
    if (status == 'Aktif') {
      return 'success'
    } else if (status == 'Keluar') {
      return 'danger'
    } else if (status == 'Pindah') {
      return 'info'
    } else {
      return 'secondary'
    }
  }

</script>