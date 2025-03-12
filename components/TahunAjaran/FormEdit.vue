<template>
  <form @submit.prevent="handleFormSubmit" class="flex flex-col gap-2">

      <div class="border-b py-1 flex flex-col md:flex-row">
        <label class="md:basis-1/4 mb-1">Active</label>
        <div class="md:flex-1">
          <ToggleSwitch v-model="form.active" />
        </div>
      </div>

      <div class="border-b py-1 flex flex-col md:flex-row">
        <label class="md:basis-1/4 mb-1">Tahun Ajaran</label>
        <div class="md:flex-1">          
          <InputText type="number" v-model="form.tahun_ajaran_1" class="w-20" />
          <span class="px-1 py-3">/</span>
          <InputText type="number" v-model="form.tahun_ajaran_2" class="w-20" />
        </div>
      </div>
      
      <div class="border-b py-1 flex flex-col md:flex-row">
        <label class="md:basis-1/4 mb-1">Tanggal Mulai</label>
        <div class="md:flex-1">
          <InputText type="date" v-model="form.mulai" class="w-full" />
        </div>
      </div>
      <div class="border-b py-1 flex flex-col md:flex-row">
        <label class="md:basis-1/4 mb-1">Tanggal Akhir</label>
        <div class="md:flex-1">
          <InputText type="date" v-model="form.akhir" class="w-full" />
        </div>
      </div>

      <div class="text-end">
        <Button type="submit" label="Simpan" class="mt-4">
          <Icon name="lucide:save" /> Simpan
        </Button>
      </div>

  </form>
</template>

<script setup lang="ts">
//emit
const emit =defineEmits(['update']);
const props = defineProps(['data'])
const data = props.data
const toast = useToast();
const isLoading = ref(false)
const client = useSanctumClient();

//split tahun ajaran
const tahunAjaran = computed(() => {
  const currentYear = new Date().getFullYear();
  const nextYear = currentYear + 1;
  return data?data.nama.split('/'):[currentYear,nextYear];
})

const form = reactive({
  id: '',
  nama: '',
  tahun_ajaran_1: tahunAjaran.value[0],
  tahun_ajaran_2: tahunAjaran.value[1],
  mulai: data?.mulai,
  akhir: data?.akhir,
  active: data?.active?true:false
})

const handleFormSubmit = async () => {  
  isLoading.value = true;
  form.id = form.tahun_ajaran_1 + '_' + form.tahun_ajaran_2;
  form.nama = form.tahun_ajaran_1 + '/' + form.tahun_ajaran_2;
  try {
    await client('/api/tahunajaran', { method: 'POST', body: form });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Update berhasil', life: 3000 });
    emit('update')
  } catch (error) {
    console.log(error);
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Update gagal', life: 3000 });
  }
  isLoading.value = false;
}
</script>

