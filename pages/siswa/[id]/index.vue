<template>
  
  <SiswaLayout @kelasdata="handleSiswaData">
    <div class="flex flex-col md:flex-row gap-4">

      <div class="md:flex-1">

        <div class="border rounded-xl p-4">
            <div class="font-bold">
              Profil Siswa
            </div>
            <div>
              {{ datasiswa.nama }}
            </div>
        </div>

      </div>
      <div class="md:basis-1/2">

        <div class="border rounded-xl p-4">
            <div class="font-bold">
              Profil Siswa
            </div>
            <div>
              {{ datasiswa.nama }}
            </div>
        </div>

      </div>
      
    </div>
  </SiswaLayout>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profil Siswa',
})
const datasiswa = ref({} as any)
const handleSiswaData = (data: any) => {
  datasiswa.value = data
}


</script>

