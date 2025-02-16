<template>
  <form @submit.prevent="handleFormSubmit">
    
    <div v-for="item in fields" class="border-b py-2">
      <div class="flex flex-col md:flex-row">
        <div class="md:basis-1/4 mb-1">
          <label :for="item.key">{{ item.label }}</label>
        </div>
        <div class="md:flex-1">

          <Select v-if="item.type == 'select'" filter v-model="form[item.key]" :id="item.key" :options="item.options" optionLabel="label" optionValue="value" placeholder="Pilih" class="w-full" />
          <ToggleSwitch v-else-if="item.type == 'toggle'" v-model="form[item.key]" />
          <InputText v-else :id="item.key" class="w-full" v-model="form[item.key]" />

        </div>
      </div>
    </div>
    <div class="text-end mt-4">
      <Button type="submit" :loading="isLoading">
        <Icon name="lucide:save" mode="svg"/> Simpan
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

const { data: data_kelas } = await useAsyncData(
  'option-kelas',
  () => client('/api/option/kelas')
)

const fields = [
  { label: 'Kelas', key: 'kelas_id', type: 'select', options: data_kelas.value },
  { label: 'Aktif', key: 'active', type: 'toggle' },
]

const form = reactive({
  siswa_id : idSiswa,
  user_id : dataSiswa.value.user_id,
  kelas_id : '',
  active: false
} as any)

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
