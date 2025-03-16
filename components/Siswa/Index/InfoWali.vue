<template>
  <div class="border rounded-lg p-3 md:p-4 bg-white">
        
    <div class="flex items-center gap-2 mb-3">
      <Icon name="lucide:users" /> Info Wali Siswa
    </div>

    <div>
      <div v-for="item in fields" :key="item.key" class="border-b py-1 flex flex-col md:flex-row">
        <div class="md:basis-1/3 font-bold pe-1">
            {{ item.label }}
        </div>
        <div class="md:flex-1">
          {{ data[item.key] }}
        </div>
      </div>
    </div>
    <div class="text-end">
      <Button as ="router-link" :to="`/siswa/${idSiswa}/edit/infowali`" variant="text" >
        Edit
      </Button>
    </div>

  </div>
</template>

<script setup lang="ts">
const client = useSanctumClient();
const props = defineProps(['id'])
const idSiswa = props.id

const fields = [
  {label: 'Alamat Orang Tua', key: 'alamat_orang_tua'},
  {label: 'Nama Ayah', key: 'ayah_nama_lengkap'},
  {label: 'Ayah Tahun Lahir', key: 'ayah_tahun_lahir'},
  {label: 'Ayah Pendidikan', key: 'ayah_pendidikan'},
  {label: 'Ayah Pekerjaan', key: 'ayah_pekerjaan'},
  {label: 'Ayah Penghasilan', key: 'ayah_penghasilan'},
  {label: 'Ayah NIK', key: 'ayah_nik'},
  {label: 'Ayah HP', key: 'ayah_hp'},
  {label: 'Ayah Email', key: 'ayah_email'},
  {label: 'Nama Ibu', key: 'ibu_nama_lengkap'},
  {label: 'Ibu Tahun Lahir', key: 'ibu_tahun_lahir'},
  {label: 'Ibu Pendidikan', key: 'ibu_pendidikan'},
  {label: 'Ibu Pekerjaan', key: 'ibu_pekerjaan'},
  {label: 'Ibu Penghasilan', key: 'ibu_penghasilan'},
  {label: 'Ibu NIK', key: 'ibu_nik'},
  {label: 'Ibu HP', key: 'ibu_hp'},
  {label: 'Ibu Email', key: 'ibu_email'},
  {label: 'Nama Wali', key: 'wali_nama_lengkap'},
  {label: 'Wali Tahun Lahir', key: 'wali_tahun_lahir'},
  {label: 'Wali Pendidikan', key: 'wali_pendidikan'},
  {label: 'Wali Pekerjaan', key: 'wali_pekerjaan'},
  {label: 'Wali Penghasilan', key: 'wali_penghasilan'},
  {label: 'Wali NIK', key: 'wali_nik'},
  {label: 'Wali HP', key: 'wali_hp'},
  {label: 'Wali Email', key: 'wali_email'},
];

//buat metakeys array dari fields
const metakeys = fields.map(item => item.key)

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idSiswa)

const { data, status, error, refresh } = await useAsyncData(
  'siswametawali-'+idSiswa,
  () => client('/api/usermeta/'+dataSiswa.value.user_id,{
    params: {
      'meta_key[]': metakeys
    }
  })
)

</script>
