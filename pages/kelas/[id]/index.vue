<template>
  <KelasLayout @kelasdata="handleKelasData">

    <div class="flex flex-col md:flex-row gap-4">      

      <div class="md:basis-1/4">
        <div class="border min-h-10 w-full p-3 rounded">
          <div class="mb-3">
            <Icon name="lucide:user" mode="svg" class="inline" /> Wali Kelas
          </div>
          <div class="text-xl font-bold">
            {{ datakelas.wali.name }}
          </div>
        </div>
        <div class="border min-h-10 w-full p-3 rounded mt-4">
          <div class="mb-3">
            <Icon name="lucide:info" mode="svg" class="inline" /> Info Kelas
          </div>
          <div> 
            <div class="border-t py-1">
              <span class="font-semibold">Nama : </span>
              <span> {{ datakelas.nama }} </span>
            </div>           
            <div class="border-t py-1">
              <span class="font-semibold">Tingkat : </span>
              <span> {{ datakelas.tingkat }} </span>
            </div> 
            <div class="border-t pt-1">
              <span class="font-semibold">Tahun Ajaran : </span>
              <span> {{ datakelas.tahun_ajaran }} </span>
            </div> 
            <div class="border-t pt-1">
              <span class="font-semibold">Unit : </span>
              <span> {{ datakelas.unit_sekolah?.nama }} </span>
            </div> 
          </div>
        </div>
      </div>

      <div class="md:flex-1">
        <div class="border min-h-10 w-full p-3 rounded">
          <div class="mb-3">
            <Icon name="lucide:users" mode="svg" class="inline" /> Daftar Siswa
          </div>
          <div>
            <DataTable :value="datakelas.siswa"  class="text-sm" stripedRows scrollable>
              <Column field="nama" header="Nama">
                <template #body="slotProps">
                  <div class="flex justify-start items-center">
                    <UserAvatar :url="slotProps.data.avatar_url" :name="slotProps.data.nama" :size="32" class="min-w-[32px] rounded-full me-2"/>

                    <NuxtLink :to="'/siswa/'+slotProps.data.siswa_id" target="_blank" class="cursor-pointer hover:underline">
                      {{ slotProps.data.nama }}
                    </NuxtLink>
                  </div>
                </template>
              </Column>
              <Column field="nis" header="NIS"></Column>
              <Column field="nisn" header="NISN"></Column>
            </DataTable>
          </div>
        </div>
      </div>

    </div>

  </KelasLayout>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Profil Kelas',
})
const datakelas = ref({} as any)
const handleKelasData = (data: any) => {
  datakelas.value = data
}

const siswas = [
  {nama: 'Andi', nis: '123456789'},
  {nama: 'Budi', nis: '123456789'},
  {nama: 'Caca', nis: '123456789'},
]

</script>
