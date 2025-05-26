<template>
  <DashCard>
        
    <template #header>
      <Icon name="lucide:info" /> Info Siswa
    </template>

    <div>
      <div v-for="item in fields" :key="item.key" class="p-2  odd:bg-zinc-100 dark:odd:bg-zinc-700 flex flex-col md:flex-row">
        <div class="md:basis-1/3 opacity-70">
            {{ item.label }}
        </div>
        <div class="md:flex-1">
          {{ data[item.key] }}
        </div>
      </div>
    </div>
    <div class="text-end">
      <Button as ="router-link" :to="`/siswa/${idSiswa}/edit/informasi`" variant="text" >
        Edit
      </Button>
    </div>

  </DashCard>
</template>

<script setup lang="ts">
const client = useSanctumClient();
const props = defineProps(['id'])
const idSiswa = props.id

const fields = [
  {label: 'NIK', key: 'nik'},
  {label: 'Telepon', key: 'telepon'},
  {label: 'HP', key: 'hp'},
  {label: 'Email', key: 'email'},
  {label: 'SKHUN', key: 'skhun'},
  {label: 'Penerima KPS', key: 'penerima_kps'},
  {label: 'Nomor KPS', key: 'nomor_kps'},
  {label: 'Nomor Peserta Ujian', key: 'nomer_peserta_ujian'},
  {label: 'No Seri Ijazah', key: 'no_seri_ijasah'},
  {label: 'Penerima KIP', key: 'penerima'},
  {label: 'Nomor KIP', key: 'nomor_kip'},
  {label: 'Nama di KIP', key: 'nama_di_kip'},
  {label: 'Nomor KKS', key: 'nomor_kks'},
  {label: 'Nomor Registrasi', key: 'nomor_registrasi'},
  {label: 'Bank', key: 'bank'},
  {label: 'No.rek Bank', key: 'nomor_rekening_bank'},
  {label: 'Rekening Atas', key: 'rekening_atas_nama'},
  {label: 'Layak PIP', key: 'layak_pip'},
  {label: 'Kebutuhan Khusus', key: 'kebutuhan_khusus'},
  {label: 'Sekolah Asal', key: 'sekolah_asal'},
  {label: 'Alamat Sekolah Asal', key: 'alamat_sekolah_asal'},
  {label: 'Anak Ke', key: 'anak_ke'},
  {label: 'Bahasa', key: 'bahasa'},
  {label: 'Agama', key: 'agama'},
];

//buat metakeys array dari fields
const metakeys = fields.map(item => item.key)

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idSiswa)

const { data, status, error, refresh } = await useAsyncData(
  'siswameta-'+idSiswa,
  () => client('/api/usermeta/'+dataSiswa.value.user_id,{
    params: {
      'meta_key[]': metakeys
    }
  })
)

</script>
