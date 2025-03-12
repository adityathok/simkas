<template>  
  <form @submit.prevent="handleFormSubmit">
    <div>
      <div class="border-b py-2 flex flex-col md:flex-row">
        <div class="md:basis-1/4 font-semibold mb-1">
          <label>Nama</label>
        </div>
        <div class="md:flex-1">
          <div>
            {{ datas.nama }}
          </div>
        </div>
      </div>
      <div class="border-b py-2 flex flex-col md:flex-row">
        <div class="md:basis-1/4 font-semibold mb-1">
          <label>Jabatan</label>
        </div>
        <div class="md:flex-1">
          <InputText v-model="form.jabatan" class="w-full" />
        </div>
      </div>
    </div>
    <div class="flex justify-end mt-4">
      <Button type="submit" :loading="isLoading">
        <span v-if="isLoading" class="flex gap-2 items-center">
          <Icon class="animate-spin" name="lucide:loader" /> Memproses..
        </span>
        <span v-else class="flex gap-2 items-center">
          <Icon name="lucide:save" /> Simpan        
        </span>
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['edit'])
const props = defineProps(['data'])
const datas = props.data
const idItem = props.data.id
const toast = useToast();
const client = useSanctumClient();
const isLoading = ref(false)
const error = ref({})

const form = ref({...datas})

const handleFormSubmit = async () => { 
  isLoading.value = true;
  try{
    await client('/api/unitsekolahpegawai/'+idItem, {
      method: 'PUT',
      body: form.value
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Jabatan berhasil diperbarui', life: 3000 });
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Jabatan gagal diperbarui', life: 3000 });
  }
  isLoading.value = false;
  //emit
  emit('edit', datas)
}
</script>
