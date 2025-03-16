<template>

  <div class="border rounded-lg p-3 md:p-4 bg-white h-full">
    <div>
      <div class="flex items-center gap-2 mb-3">
        <Icon name="lucide:user" /> Profil Siswa
      </div>
    </div>
    <div>
      
      <div v-for="item in profilSiswa" :key="item.key" class="border-b py-1 flex flex-col md:flex-row">
        <div class="md:basis-1/3 font-bold pe-1">
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
            {{ dataSiswa[item.key] }}
          </span>

        </div>
      </div>
      <div class="text-end">
        <Button as="router-link" variant="text" :to="`/siswa/${idSiswa}/edit`" size="small" class="mt-2">Edit</Button>
      </div>

    </div>
  </div>
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
  {label: 'TTL', key: 'ttl'},
  {label: 'JK', key: 'jenis_kelamin'},
  {label: 'Tanggal Masuk', key: 'tanggal_masuk'},
  {label: 'Status', key: 'status'},
];

</script>
