<template>
  <div>
    <div v-for="item in fields" :key="item.key">
      <div class="border-b py-2 flex flex-col md:flex-row">
        <div class="md:basis-1/4 font-semibold mb-1">{{ item.label }}</div>
        <div class="md:flex-1">{{ data[item.key] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['data'])
const data = props.data

const fields = [
  { label: 'Nama', key: 'nama' },
  { label: 'Jenjang', key: 'jenjang' },
  { label: 'Alamat', key: 'alamat' },
  { label: 'Desa', key: 'desa' },
  { label: 'Kecamatan', key: 'kecamatan' },
  { label: 'Kota', key: 'kota' },
  { label: 'Provinsi', key: 'provinsi' },
  { label: 'Kode Pos', key: 'kode_pos' },
  { label: 'Status', key: 'status' },
  { label: 'Tanggal Berdiri', key: 'tanggal_berdiri' },
  { label: 'Whatsapp', key: 'whatsapp' },
  { label: 'Telepon', key: 'telepon' },
  { label: 'Email', key: 'email' },
]

</script>
