<template>

  <div v-for="(item, index) in fields" class="border-b py-1 flex flex-col md:flex-row">
    <label class="md:basis-1/4 font-semibold mb-1">
      {{ item.label }}
    </label>
    <div>
      
      <template v-if="item.key == 'user_id'">
        <div>
          {{ data.user.siswa.nama }}
        </div>
        <span class="text-sm text-slate-500">
          {{ data.user.siswa.nis }} | {{ data.user.siswa.kelas_siswa.nama }}
        </span>
      </template>
      <template v-else-if="item.key == 'pendapatan_id'">
        {{ data.akunpendapatan?.nama }}
      </template>
      <template v-else-if="item.key == 'pengeluaran_id'">
        {{ data.akunpengeluaran?.nama }}
      </template>
      <template v-else-if="item.key == 'rekening_id'">
        {{ data.akunrekening?.nama }}
      </template>
      <template v-else-if="item.key == 'arus'">
        <TransaksiBadgeArus :arus="data.arus" />
      </template>
      <template v-else-if="item.key == 'admin_id'">
        {{ data.admin?.pegawai?.nama }}
      </template>
      <template v-else>
        {{ data[item.key] }}
      </template>

    </div>
  </div>

</template>

<script setup lang="ts">
const emit = defineEmits(['update']);
const props = defineProps(['data'])
const data = props.data

const fields = [
  { key: 'nama', label: 'Nama' },
  { key: 'nominal_label', label: 'Nominal' },
  { key: 'arus', label: 'Arus' },
  { key: 'user_id', label: 'Oleh' },
  { key: 'pendapatan_id', label: 'Akun Pendapatan' },
  { key: 'pengeluaran_id', label: 'Akun Biaya' },
  { key: 'rekening_id', label: 'Rekening' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'admin_id', label: 'Admin' },
]

</script>
