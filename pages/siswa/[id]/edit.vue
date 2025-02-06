<template>
  
  <SiswaLayout @kelasdata="handleSiswaData">
    <div>
      Page: siswa/[id]/ediy
    </div>
  </SiswaLayout>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const datasiswa = ref({} as any)
const handleSiswaData = (data: any) => {
  datasiswa.value = data
}


</script>

