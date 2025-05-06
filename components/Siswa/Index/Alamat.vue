<template>

  <div class="border rounded-lg p-3 md:p-4 bg-white">
        
    <div class="flex items-center gap-2 mb-3">
      <Icon name="lucide:map" /> Alamat Siswa
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

      <div class="text-end">
        <Button as="router-link" variant="text" :to="`/siswa/${datasiswa.id}/edit/alamat`" size="small" class="mt-2">Edit</Button>
      </div>
    </div>

  </div>

</template>

<script setup lang="ts">
const props = defineProps(['datasiswa'])
const datasiswa = props.datasiswa
const client = useSanctumClient();

const { data, status, error, refresh } = await useAsyncData(
  'siswa-'+datasiswa.user_id,
  () => client('/api/useralamat/'+datasiswa.user_id)
)

const fields = [
    { label: 'Alamat', key: 'alamat', type: 'textarea' },
    { label: 'RT', key: 'rt', type: 'text' },
    { label: 'RW', key: 'rw', type: 'text' },
    { label: 'Dusun', key: 'dusun', type: 'text' },
    { label: 'Kelurahan', key: 'kelurahan', type: 'text' },
    { label: 'Kecamatan', key: 'kecamatan', type: 'text' },
    { label: 'Kota', key: 'kota', type: 'text' },
    { label: 'Provinsi', key: 'provinsi', type: 'text' },
    { label: 'Kode Pos', key: 'kode_pos', type: 'text' },
    { label: 'Jenis Tinggal', key: 'jenis_tinggal', type: 'text' },
    { label: 'Transportasi', key: 'transportasi', type: 'text' },
    { label: 'Jarak (km)', key: 'jarak', type: 'text' }, 
]

</script>
