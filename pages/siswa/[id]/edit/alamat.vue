<template>
  
  <SiswaLayoutEdit>
    <div>
      Page: siswa/[id]/Alamat
    </div>
  </SiswaLayoutEdit>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const datasiswa = ref({} as any)
const handleSiswaData = (data: any) => {
  datasiswa.value = data
}


</script>