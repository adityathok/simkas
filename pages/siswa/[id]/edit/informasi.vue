<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Informasi profil Siswa
    </div>

    <div>
      Page: siswa/[id]/edit/informasi
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