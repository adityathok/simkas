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
        {{ data.tagihan_master?.nominal_label }}
      </template>
      <template v-else-if="item.key == 'pendapatan_id'">
        {{ data.tagihan_master?.akunpendapatan?.nama }}
      </template>
      <template v-else-if="item.key == 'rekening_id'">
        {{ data.akunrekening?.nama }}
      </template>
      <template v-else-if="item.key == 'status'">
        <TagihanBagdeStatus :status="data.status" />
      </template>
      <template v-else-if="item.key == 'admin_id'">
        {{ data.admin?.pegawai?.nama }}
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
  { key: 'nama', label: 'Nama' },
  { key: 'nominal_label', label: 'Nominal' },
  { key: 'status', label: 'Status' },
  { key: 'user_id', label: 'Oleh' },
  { key: 'pendapatan_id', label: 'Akun Pendapatan' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'keterangan', label: 'Keterangan' },
  { key: 'admin_id', label: 'Admin' },
]

</script>
