<template>
  <form @submit.prevent="handleFormSubmit">
    
    <div class="border-b py-2 flex flex-col md:flex-row">
      <div class="md:basis-1/4 font-semibold mb-1">
        <label>Pegawai</label>
      </div>
      <div class="md:flex-1">
        <Select v-model="form.user_id" :options="pegawais" optionLabel="label" optionValue="value" placeholder="Pilih Pegawai" class="w-full">
        
          <template #option="slotProps">
                <div class="flex items-center">
                    <img :alt="slotProps.option.label" :src="slotProps.option.image" class="rounded-full me-3" style="width: 2rem" />
                    <div>
                      <div>{{ slotProps.option.label }}</div>
                      <small class="opacity-50">{{ slotProps.option.nip }}</small>
                    </div>
                </div>
          </template>
          
        </Select>
      </div>
    </div>
    <div class="border-b py-2 flex flex-col md:flex-row">
      <div class="md:basis-1/4 font-semibold mb-1">
        <label>Jabatan</label>
      </div>
      <div class="md:flex-1">
        <Select v-model="form.jabatan" :options="jabatans" optionLabel="label" optionValue="value" placeholder="Pilih Jabatan" class="w-full" />
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
const emit = defineEmits(['add'])
const props = defineProps(['idunit'])
const idunit = props.idunit
const toast = useToast()
const client = useSanctumClient()
const isLoading = ref(false)
const form = ref({
  jabatan: '',
  unit_sekolah_id: idunit,
  user_id: ''
})

const pegawais = ref({} as any)
const jabatans = ref({} as any)
const { data, status, error, refresh } = await useAsyncData(
    'option-add-jabatan', () => client('/api/form-options/option-add-jabatan')
)
if (data.value) {
  pegawais.value = data.value.pegawai.map((user: { user_id: any; nama: string;nip: string; avatar: string; }) => ({
    value: user.user_id,
    label: user.nama,
    nip: user.nip,
    image: user.avatar
  }));
  jabatans.value = data.value.jabatan.map((jabatan: any) => ({
    value: jabatan,
    label: jabatan,
  }));
}

const handleFormSubmit = async () => { 
  isLoading.value = true;
  try{
    await client('/api/unitsekolahpegawai', {
      method: 'POST',
      body: form.value
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Jabatan berhasil ditambahkan', life: 3000 });
    emit('add')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Jabatan gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}
</script>
