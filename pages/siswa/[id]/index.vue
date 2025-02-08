<template>
  
  <SiswaLayout @siswadata="handleSiswaData">
    <SiswaIndexCards/>
    <div class="flex flex-col md:flex-row gap-4">

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
                      {{ dataSiswa.kelas.nama }}, {{ dataSiswa.kelas.tahun_ajaran }}
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

const { data: dataSiswa, status, error, refresh } = await useAsyncData(
  'siswa-'+idUnit,
  () => client('/api/siswa/'+idUnit)
)

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

