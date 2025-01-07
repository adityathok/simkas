
<template>

  <div class="flex justify-center items-center">
    <UserAvatar :url="data.avatar_url" :name="data.nama" />
  </div>

  <div v-for="field in fields" :key="field.key" class="border-b p-2">
    <div class="font-semibold mb-1">
       {{ field.label }}
    </div>
    <div>
      {{  data[field.key] }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Avatar } from 'primevue';

  const props = defineProps(['idpegawai','data'])
  const idpegawai = props.idpegawai || '';
  const data = props.data

  const fields = [
    { label: 'NIP', key: 'nip' },
    { label: 'Nama', key: 'nama' },
    { label: 'Status', key: 'status' },
    { label: 'Tempat Lahir', key: 'tempat_lahir' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir' },
    { label: 'Tanggal Masuk', key: 'tanggal_masuk' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin' },
    { label: 'Email', key: 'email' },
  ]

</script>
