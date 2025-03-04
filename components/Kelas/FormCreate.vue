<template>  
<form @submit.prevent="handleFormSubmit">

  <SelectButton v-model="valueBuat" optionLabel="label" optionValue="value" :options="optionsBuat" class="mb-2"/>

  <div v-for="item in fields" :key="item.key" class="border-b py-2 flex flex-col md:flex-row">
      
      <div class="md:basis-1/4 font-semibold mb-1">
          <label>{{ item.label }}</label>
      </div>
      <div class="md:flex-1">

        <Select v-if="item.key == 'tahun_ajaran'" filter :options="dataOptions.tahun_ajarans" optionLabel="label" optionValue="value" v-model="form.tahun_ajaran" />

        <Select v-if="item.key == 'unit_sekolah'" filter :options="dataOptions.unit_sekolah" optionLabel="label" optionValue="value" v-model="form.unit_sekolah_id" />

        <Select v-if="item.key == 'tingkat'" :options="filteredTingkat" v-model="form.tingkat" />

        <Select v-if="item.key == 'wali'" filter :options="dataOptions.pegawai" optionLabel="label" optionValue="value" v-model="form.wali_id" />
        
        <InputText v-if="item.key == 'nama'" v-model="form.nama" :type="item.type" class="w-full" />

        <Message v-if="errors[item.key]" severity="error" class="mt-1" closable>
          {{ errors[item.key][0] }}
        </Message>

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
const emit = defineEmits(['add'])
const props = defineProps(['idunit'])
const idUnit = ref(props.idunit || '')
const isLoading = ref(false)
const toast = useToast();
const client = useSanctumClient();
const errors = ref({} as any)

const valueBuat = ref('satu');
const optionsBuat = ref([
    { label: 'Satu Kelas', value: 'satu' },
    { label: 'Kelas dari Data Tingkat & Rombel', value: 'tingkat' }
]);

const fields = [
  { label: 'Tahun Ajaran', key: 'tahun_ajaran', type: 'select' },
  { label: 'Unit Sekolah', key: 'unit_sekolah', type: 'select' },
  { label: 'Nama Kelas', key: 'nama', type: 'text' },
  { label: 'Tingkat', key: 'tingkat', type: 'select' },
  { label: 'Wali', key: 'wali', type: 'select' },
]

const form = reactive({
  unit_sekolah_id: idUnit.value||'',
  tahun_ajaran: '',
  nama: '',
  tingkat: '',
  wali_id:''
})

const { data: dataOptions } = await useAsyncData(
    'option-add-kelas', () => client('/api/option/add_kelas')
)

//jika dataOptions sudah fetch
onMounted(() => {
  form.tahun_ajaran = dataOptions.value.tahun_ajaran
})

const filteredTingkat = computed(() => {
  const sekolah = dataOptions.value.unit_sekolah.find((s: { id: string; }) => s.id === form.unit_sekolah_id);
  return sekolah ? sekolah.tingkat : [];
});

const handleFormSubmit = async () => {  
  isLoading.value = true;
  try {
    const res = await client('/api/kelas', { method: 'POST', body: form });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kelas berhasil ditambahkan', life: 3000 });
    emit('add')
  } catch (error) {
    const er = useSanctumError(error);
    errors.value = er.bag;
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Kelas gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}
</script>