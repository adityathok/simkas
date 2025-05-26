<template>
  <Badge :severity="setSeverenity()" size="small" class="capitalize !font-normal">
    {{ label }}
  </Badge>
</template>

<script setup lang="ts">
const props = defineProps(['jenis'])
const jenis = ref('')
const label = ref('')

watch(
  () => props.jenis,
  (newstatus) => {
    jenis.value = newstatus

    if(newstatus=='pendapatan'){
      label.value = 'Masuk'
    } else if(newstatus=='pengeluaran'){
      label.value = 'Keluar'
    } else {
      label.value = 'Transfer'
    }
  },
  { immediate: true }
)

const setSeverenity = () => {
  if(jenis.value=='pendapatan'){
    return 'success'
  } else if(jenis.value=='pengeluaran'){
    return 'danger'
  } else {
    return 'info'
  }
}

</script>