<template>

  <DashCard class="h-full">
    <template #header>
      <Icon name="lucide:user" /> Profil Siswa
    </template>
    
    <div>
      
      <div v-for="item in profilSiswa" :key="item.key" class="p-2 flex flex-col md:flex-row odd:bg-zinc-100 dark:odd:bg-zinc-700">
        <div class="md:basis-1/3 opacity-70">
            {{ item.label }}
        </div>
        <div class="md:flex-1">
          
          <span v-if="item.key == 'ttl'">
            {{ dataSiswa.tempat_lahir }}, {{ dataSiswa.tanggal_lahir }}
          </span>
          <span v-else-if="item.key == 'kelas'">
            <NuxtLink v-if="dataSiswa.kelas_siswa" :to="'/kelas/'+dataSiswa.kelas_siswa.id" class="cursor-pointer hover:underline">
              {{ dataSiswa.kelas_siswa.nama }}, {{ dataSiswa.kelas_siswa.tahun_ajaran }}
            </NuxtLink>
            <NuxtLink v-else :to="'/siswa/'+idSiswa+'/edit/kelas'">
              <Badge severity="info"> <Icon name="lucide:edit"  class="me-2"/> Atur Kelas</Badge>
            </NuxtLink>
          </span>
          <span v-else-if="item.key == 'status'">
              <SiswaStatusBadge :status="dataSiswa.status" />
          </span>
          <span v-else>
            {{ dataSiswa[item.key]?? '-' }}
          </span>

        </div>
      </div>
      <div class="text-end">
        <Button as="router-link" variant="text" :to="`/siswa/${idSiswa}/edit`" size="small" class="mt-2">Edit</Button>
      </div>

    </div>
  </DashCard>
</template>

<script setup lang="ts">
const props = defineProps(['id'])
const idSiswa = props.id

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idSiswa)

const profilSiswa = [
  {label: 'Nama', key: 'nama'},
  {label: 'Kelas', key: 'kelas'},
  {label: 'Nama Panggilan', key: 'nama_panggilan'},
  {label: 'NIS', key: 'nis'},
  {label: 'NISN', key: 'nisn'},
  {label: 'TT Lahir', key: 'ttl'},
  {label: 'JK', key: 'jenis_kelamin'},
  {label: 'Tanggal Masuk', key: 'tanggal_masuk'},
  {label: 'Status', key: 'status'},
];

</script>
