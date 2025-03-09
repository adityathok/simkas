<template>
  <form @submit.prevent="handleFormSubmit">
    
    <div v-for="item in fields" class="border-b py-2">
      <div class="flex flex-col md:flex-row">
        <div class="md:basis-1/4 mb-1">
          <label :for="item.key">{{ item.label }}</label>
        </div>
        <div class="md:flex-1">
          
          <Select v-if="item.type=='select'" :options="item.options" v-model="form[item.key]" />
          <Textarea v-else-if="item.type=='textarea'" :id="item.key" class="w-full" v-model="form[item.key]" />
          <InputText v-else :type="item.type" :id="item.key" class="w-full" v-model="form[item.key]" />

        </div>
      </div>
    </div>
    <div class="text-end mt-4">      
      <Button type="submit" :loading="isLoading" class="flex items-center gap-2">
          <Icon v-if="isLoading" name="lucide:loader" mode="svg" class="animate-spin" />
          Tambah
        </Button>
    </div>

  </form>
</template>

<script setup lang="ts">
const emit = defineEmits(['submit'])
const props = defineProps(['idSiswa','data','action'])
const idSiswa = props.idSiswa
const dataWali = props.data
const action = props.action

const client = useSanctumClient();
const toast = useToast();
const isLoading = ref(false)

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

const form = reactive({} as any)

const handleFormSubmit  = async () => { 
  isLoading.value = true
  form.siswa_id = idSiswa
  try {
    await client('/api/siswawali', { method: 'POST', body: form });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Wali berhasil ditambahkan', life: 3000 });
    emit('submit')
  } catch (error) {
    const er = useSanctumError(error);
    console.log(er);
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Wali gagal ditambahkan,'+er.msg, life: 3000 });
  }
  isLoading.value = false
}
</script>
