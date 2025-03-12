<template>
  <form @submit.prevent="handleFormSubmit">
    
    <div v-for="item in fields" class="border-b py-2">
      <div class="flex flex-col md:flex-row">
        <div class="md:basis-1/4 mb-1">
          <label :for="item.key">{{ item.label }}</label>
        </div>
        <div class="md:flex-1">

          <Select v-if="item.type == 'select' && item.key=='tahun_ajaran'" filter v-model="form[item.key]" :id="item.key" :options="item.options" optionLabel="label" optionValue="value" placeholder="Pilih" class="w-full" />
          <Select v-else-if="item.type == 'select'&& item.key=='unit_sekolah_id'" filter v-model="form[item.key]" :id="item.key" :options="item.options" optionLabel="label" optionValue="value" placeholder="Pilih" class="w-full" />

          <Select v-else-if="item.type == 'select'&& item.key=='kelas_id'" filter v-model="form[item.key]" :id="item.key" :options="data_kelas" optionLabel="label" optionValue="value" placeholder="Pilih Kelas" class="w-full" />

          <ToggleSwitch v-else-if="item.type == 'toggle'" v-model="form[item.key]" />
          <InputText v-else :id="item.key" class="w-full" v-model="form[item.key]" />

        </div>
      </div>
    </div>
    <div class="text-end mt-4">      
      <Button type="submit" :loading="isLoading" class="flex items-center gap-2">
          <Icon v-if="isLoading" name="lucide:loader"  class="animate-spin" />
          Tambah
        </Button>
    </div>

  </form>
</template>

<script setup lang="ts">
const props = defineProps(['idSiswa','data','action'])
const idSiswa = props.idSiswa
const dataSK = props.data
const action = props.action
const isLoading = ref(false)
const client = useSanctumClient();
const toast = useToast();
const emit = defineEmits(['submit'])

// Access to the cached value of dataSiswa
const { data:dataSiswa } = useNuxtData('siswa-'+idSiswa)

const form = reactive({
  tahun_ajaran : '',
  unit_sekolah_id : '',
  siswa_id : idSiswa,
  user_id : dataSiswa.value.user_id,
  kelas_id : '',
  active: false
} as any)

const { data:optionTahunAjaran } = await useAsyncData(
    'option-tahun_ajaran',
    () => client('/api/option/tahun_ajaran')
)
const { data:optionUnit} = await useAsyncData(
    'option-unitsekolah',
    () => client('/api/option/unitsekolah')
)
const data_kelas = ref('' as any)
const { data: dataKelas,refresh: fDataKelas } = await useAsyncData(
    'option-datakelas',
    () => client('/api/option/kelas',
    {
      params: {
        tahun_ajaran: form.tahun_ajaran,
        unit_sekolah: form.unit_sekolah_id
      }
    }
  )
)
data_kelas.value = dataKelas.value

// Fungsi untuk memperbarui data saat form berubah
watch(form, () => {
  fDataKelas() // Refresh data saat form berubah
});
watch(dataKelas, () => {
  data_kelas.value = dataKelas.value
});

const fields = [
  { label: 'Tahun Ajaran', key: 'tahun_ajaran', type: 'select', options: optionTahunAjaran.value },
  { label: 'Unit', key: 'unit_sekolah_id', type: 'select', options: optionUnit.value },
  { label: 'Kelas', key: 'kelas_id', type: 'select', options: data_kelas.value },
  { label: 'Aktif', key: 'active', type: 'toggle' },
]

//jika action = edit, set form sesuai data
if(action == 'edit') {
  form.kelas_id = dataSK.kelas_id
  form.active = dataSK.active==1?true:false
  form.kelas_old = dataSK.kelas_id
}

const handleFormSubmit = async () => {  
  isLoading.value = true;

  if(action == 'edit') {
    try {
      await client('/api/siswakelas/'+dataSK.kelas_id, { method: 'PUT', body: form });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kelas berhasil diubah', life: 3000 });
      emit('submit')
    } catch (error) {
      const er = useSanctumError(error);
      console.log(er);
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Kelas gagal diubah,'+er.msg, life: 3000 });
    }
  } else {
    try {
      await client('/api/siswakelas', { method: 'POST', body: form });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Kelas berhasil ditambahkan', life: 3000 });
      emit('submit')
    } catch (error) {
      const er = useSanctumError(error);
      console.log(er);
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Kelas gagal ditambahkan,'+er.msg, life: 3000 });
    }
  }

  isLoading.value = false;
}

</script>
