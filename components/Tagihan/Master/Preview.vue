<template>

  <div v-for="(item, index) in fields" class="border-b py-1 flex flex-col md:flex-row">
    <label class="md:basis-1/4 font-semibold mb-1">
      {{ item.label }}
    </label>
    <div>
      
      <template v-if="item.key == 'user_id'">
        <div>
          {{ data.user?.siswa?.nama }}
        </div>
        <span v-if="data.user?.siswa" class="text-sm text-slate-500">
          {{ data.user.siswa.nis }} | {{ data.user.siswa.kelas_siswa.nama }}
        </span>
      </template>
      <template v-else-if="item.key == 'nominal_label'">
        {{ data.nominal_label }}
      </template>
      <template v-else-if="item.key == 'total_nominal'">
        {{ formatUang(data.total_nominal) }}
      </template>
      <template v-else-if="item.key == 'akun_pendapatan_id'">
        {{ data.akunpendapatan?.nama }}
      </template>
      <template v-else-if="item.key == 'unit_sekolah_id'">
        {{ data.unitsekolah?.nama }}
      </template>
      <template v-else-if="item.key == 'kelas_id'">
        {{ data.kelas?.nama }}
      </template>
      <template v-else-if="item.key == 'admin_id'">
        {{ data.admin?.name }}
      </template>
      <template v-else-if="item.key == 'created_at'">
        {{ formatDate(data.created_at) }}
      </template>
      <template v-else>
        {{ data[item.key] }}
      </template>

    </div>

  </div>

  <div class="text-end mt-3">
    <Button @click="emit('edit')">
      Edit
    </Button>
  </div>

</template>

<script setup lang="ts">
const emit = defineEmits(['edit']);
const props = defineProps(['data'])
const data = props.data

const fields = [
  { key: 'id', label: 'ID Tagihan' },
  { key: 'nama', label: 'Nama Tagihan' },
  { key: 'nominal_label', label: 'Nominal' },
  { key: 'type', label: 'Tipe' },
  { key: 'akun_pendapatan_id', label: 'Akun Pendapatan' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'admin_id', label: 'Admin' },
  { key: 'created_at', label: 'Tanggal' },
  { key: 'total_tagihan', label: 'Total Tagihan' },
  { key: 'total_nominal', label: 'Total Nominal' },
  { key: 'due_date', label: 'Tgl jatuh tempo' },
  { key: 'tahun_ajaran', label: 'Tahun Ajaran' },
  { key: 'unit_sekolah_id', label: 'Unit Sekolah' },
  { key: 'kelas_id', label: 'Kelas' },  
]

</script>
