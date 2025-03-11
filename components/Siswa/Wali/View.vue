<template>
    <div v-for="item in fields" class="border-b py-2">
      <div class="flex flex-col md:flex-row">
        <div class="md:basis-1/4 opacity-70 mb-1">
          {{ item.label }}
        </div>
        <div class="md:flex-1">
          {{ dataWali[item.key] }}
        </div>
      </div>
    </div>
    <div class="text-end mt-4">   
      <Button type="submit" class="flex items-center gap-2" @click="emit('edit')">
        <Icon name="lucide:pencil" mode="svg"/>
        Edit
      </Button>
    </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['edit'])
const props = defineProps(['data'])
const dataWali = props.data

const fields = [
  { label: 'Nama', key: 'nama', type: 'text' },
  { label: 'Hubungan', key: 'hubungan', type: 'select', options:['Ayah','Ibu',"Wali"] },
  { label: 'Tahun Lahir', key: 'tahun_lahir', type: 'number' },
  { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date' },
  { label: 'Pendidikan', key: 'pendidikan', type: 'text' },
  { label: 'Pekerjaan', key: 'pekerjaan', type: 'text' },
  { label: 'Penghasilan', key: 'penghasilan', type: 'number' },
  { label: 'Telepon', key: 'telepon', type: 'text' },
  { label: 'Email', key: 'email', type: 'email' },
  { label: 'Alamat', key: 'alamat', type: 'textarea' },
]

</script>
