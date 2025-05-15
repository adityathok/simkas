<template>

  <DashCard>
        
    <template #header>
      <Icon name="lucide:map" /> Alamat Siswa
    </template>
    <div>
      <div v-for="item in fields" :key="item.key" class="p-2 flex flex-col md:flex-row odd:bg-zinc-100 dark:odd:bg-zinc-700">
        <div class="md:basis-1/3 opacity-70">
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

  </DashCard>

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
