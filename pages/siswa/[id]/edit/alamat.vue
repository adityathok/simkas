<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Alamat Siswa
    </div>

    <UserFormAlamat :iduser="data.user_id" /> 

  </SiswaLayoutEdit>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();

// Access to the cached value of dataSiswa
const { data } = useNuxtData('siswa-'+idUnit)

</script>