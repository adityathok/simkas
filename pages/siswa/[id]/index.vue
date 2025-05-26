<template>
  
  <SiswaLayout @siswadata="handleSiswaData">

    <SiswaIndexCards class="mb-5 md:mb-8"/>

    <div class="grid grid-cols-6 gap-4">     

      <div class="col-start-1 col-end-7 md:col-start-1 md:col-end-4">        
        <SiswaIndexProfil :id="idUnit" />
      </div>
      <div class="col-start-1 col-end-7 md:col-start-4 md:col-end-7">
        <SiswaIndexAlamat :datasiswa="dataSiswa"/> 
      </div>
      <div class="col-start-1 col-end-7 md:col-start-1 md:col-end-4"> 
        <SiswaIndexInformasi :id="idUnit"/>
      </div>
      <div class="col-start-1 col-end-7 md:col-start-4 md:col-end-7">
        <SiswaIndexInfoWali :id="idUnit"/>      
      </div>
      
    </div>

  </SiswaLayout>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profil Siswa',
})
const route = useRoute()
const idUnit = route.params.id

const datasiswa = ref({} as any)

const handleSiswaData = (data: any) => {
  datasiswa.value = data
}

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idUnit)

</script>

