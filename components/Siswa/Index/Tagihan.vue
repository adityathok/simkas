
<template>
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
</template>

<script setup lang="ts">
const props = defineProps(['id'])
const idSiswa = props.id


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

