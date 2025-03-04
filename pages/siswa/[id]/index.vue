<template>
  
  <SiswaLayout @siswadata="handleSiswaData">

    <SiswaIndexCards class="mb-5 md:mb-8"/>

    <div class="flex flex-col md:flex-row gap-4 md:gap-8">

      <div class="md:flex-1">
        
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <Icon name="lucide:user" mode="svg"/> Profil Siswa
            </div>
          </template>
          <template #content>            
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
                      <NuxtLink v-else :to="'/siswa/'+idUnit+'/edit/kelas'">
                        <Badge severity="info"> <Icon name="lucide:edit" mode="svg" class="me-2"/> Atur Kelas</Badge>
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
                  <Button as="router-link" variant="text" :to="`/siswa/${idUnit}/edit`" size="small" class="mt-2">Edit</Button>
               </div>
          </template>
        </Card>

        <SiswaIndexAlamat :datasiswa="dataSiswa" class="my-5 md:my-8"/>

      </div>
      <div class="md:basis-1/2">

        
        <Card>
          <template #title>
            <div class="flex items-center gap-2">
              <Icon name="lucide:receipt-text" mode="svg"/> Tagihan Siswa
            </div>
          </template>
          <template #content>
            <DataTable :value="dataTagihan" size="small" class="text-sm" stripedRows scrollable>
              <Column field="nama" header="Keterangan"></Column>
              <Column field="jumlah" header="Jumlah"></Column>
            </DataTable>
          </template>
        </Card>

      </div>
      
    </div>
  </SiswaLayout>

</template>

<script setup lang="ts">
import { Badge } from 'primevue';

definePageMeta({
  title: 'Profil Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();

const datasiswa = ref({} as any)

const handleSiswaData = (data: any) => {
  datasiswa.value = data
}

// const { data: dataSiswa, status, error, refresh } = await useAsyncData(
//   'siswa-'+idUnit,
//   () => client('/api/siswa/'+idUnit)
// )

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idUnit)

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


const dataTagihan = ref([
  {
    "id": 1,
    "nama": "Bulan Januari",
    "jumlah": 100000
  },
  {
    "id": 2,
    "nama": "Bulan Februari",
    "jumlah": 100000
  },
  {
    "id": 3,
    "nama": "Bulan Maret",
    "jumlah": 100000
  },
  {
    "id": 4,
    "nama": "Bulan April",
    "jumlah": 100000
  },
  {
    "id": 5,
    "nama": "Bulan Mei",
    "jumlah": 100000
  }
])


</script>

