<template>
  <form  @submit.prevent="handleFormSubmit">
     <div v-for="item in fields" :key="item.key">
        <div class="border-b py-2 flex flex-col md:flex-row">
          <div class="md:basis-1/4 font-semibold mb-1">
            <label>{{ item.label }}</label>
          </div>
          <div class="md:flex-1">
            <InputText v-model="datas[item.key]" :type="item.type" class="w-full" />
          </div>
        </div>
     </div>
     <div class="flex justify-end mt-4">
      <Button type="submit" :loading="isLoading">           
          <span v-if="isLoading" class="flex gap-2 items-center">
            <Icon class="animate-spin" name="lucide:loader" mode="svg"/> Memproses..         
          </span>
          <span v-else class="flex gap-2 items-center">
            <Icon name="lucide:save" mode="svg"/> Simpan        
          </span> 

        </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps(['data'])
const datas = props.data
const idItem = props.data.id
const isLoading = ref(false)
const toast = useToast();
const client = useSanctumClient();

const fields = [
  { label: 'Nama', key: 'nama', type: 'text' },
  { label: 'Jenjang', key: 'jenjang', type: 'text' },
  { label: 'Alamat', key: 'alamat', type: 'text' },
  { label: 'Desa', key: 'desa', type: 'text' },
  { label: 'Kecamatan', key: 'kecamatan', type: 'text' },
  { label: 'Kota', key: 'kota', type: 'text' },
  { label: 'Provinsi', key: 'provinsi', type: 'text' },
  { label: 'Kode Pos', key: 'kode_pos', type: 'text' },
  { label: 'Status', key: 'status', type: 'text' },
  { label: 'Tanggal Berdiri', key: 'tanggal_berdiri', type: 'text' },
  { label: 'Whatsapp', key: 'whatsapp', type: 'text' },
  { label: 'Telepon', key: 'telepon', type: 'text' },
  { label: 'Email', key: 'email', type: 'text' },
]

const handleFormSubmit = async () => {  
  isLoading.value = true;
  const formData = new FormData();
  for (const key in fields) {
    formData.append(fields[key].key, datas[fields[key].key]);
  }
  try {
    await client('/api/unitsekolah/'+idItem, { method: 'PUT', body: formData });
    isLoading.value = false;
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit berhasil diperbarui', life: 3000 });
  } catch (error) {
    isLoading.value = false;
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Unit gagal diperbarui', life: 3000 });
  }
}

</script>
