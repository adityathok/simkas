<template>

  <div v-for="(item, index) in fields" class="border-b py-1 flex flex-col md:flex-row">
    <label class="md:basis-1/4 font-semibold mb-1">
      {{ item.label }}
    </label>
    <div>
      
      <template v-if="item.key == 'user_id'">
        <template v-if="data.user?.siswa">
          <div>
            {{ data.user?.siswa?.nama }}
          </div>
          <span v-if="data.user?.siswa" class="text-sm text-slate-500">
            {{ data.user.siswa.nis }} | {{ data.user.siswa.kelas_siswa.nama }}
          </span>
        </template>
        <template v-if="data.user?.pegawai">
          {{ data.user.pegawai.nama }}
        </template>
      </template>
      <template v-else-if="item.key == 'akun_rekening_id'">
        {{ data.akun_rekening?.nama }}
      </template>
      <template v-else-if="item.key == 'jenis'">
        <TransaksiBadgeJenis :jenis="data.jenis" />
      </template>
      <template v-else-if="item.key == 'admin_id'">
        {{ data.admin?.pegawai?.nama }}
      </template>
      <template v-else>
        {{ data[item.key] }}
      </template>

    </div>

  </div>

  <div v-if="data.items" class="mt-5">
    <div class="font-semibold mb-3">
      Item Transaksi
    </div>
    <table v-if="data.items" class="table-fixed border-collapse border border-gray-200 w-full text-left">
      <thead>
      <tr>
        <th class="p-2">Nama</th>
        <th class="p-2">Akun</th>
        <th class="p-2">Nominal</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="item in data.items">
        <td class="p-2">{{ item.nama }}</td>
        <td class="p-2">
          <template v-if="item.akun_pendapatan_id">
            {{ item.akun_pendapatan?.nama }}
          </template>
          <template v-if="item.akun_pengeluaran_id">
            {{ item.akun_pengeluaran?.nama }}
          </template>
        </td>
        <td class="p-2">{{ formatUang(item.nominal) }}</td>
      </tr>
      <tr>
        <td class="p-2" colspan="2">
          Total
        </td>
        <td class="p-2 font-bold">
          {{ data.nominal_label }}
        </td>
      </tr>
    </tbody>
    </table>
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
  { key: 'nomor', label: 'Nomor' },
  { key: 'nominal_label', label: 'Nominal' },
  { key: 'jenis', label: 'Jenis' },
  { key: 'user_id', label: 'Oleh' },
  { key: 'akun_rekening_id', label: 'Rekening' },
  { key: 'tanggal', label: 'Tanggal' },
  { key: 'catatan', label: 'Catatan' },
  { key: 'admin_id', label: 'Admin' },
]

</script>
