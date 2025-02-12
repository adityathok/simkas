<template>
    <Card>
      <template #content>
        
        <form @submit.prevent="handleFormSubmit">

          <div v-for="field in fields" :key="field.key" class="border-b py-1 flex flex-col md:flex-row">
            <div class="md:basis-1/4 mb-1">
              <label :for="field.key" class="block mb-1">{{ field.label }}</label>
            </div>
            <div class="md:flex-1">

              <Select v-if="field.type == 'select'" v-model="form[field.key]" :options="field.options" placeholder="Pilih" class="w-full" :required="field.required"/>
              <InputText v-else v-model="form[field.key]" :id="field.key" :type="field.type" class="w-full" :required="field.required" />

              <Message v-if="errors[field.key]" severity="error" class="mt-1" closable>
                {{ errors[field.key][0] }}
              </Message>

            </div>
          </div>
          <div class="text-end mt-5">
            <Button type="submit" label="Simpan" :loading="isLoading">
              <Icon name="lucide:save" mode="svg"/> 
              <span v-if="isLoading">
                  Memproses..         
              </span>  
              <span v-else>
                  Simpan        
              </span> 
            </Button>
          </div>

        </form>

      </template>
    </Card>
</template>

<script lang="ts" setup>
definePageMeta({
    title: 'Tambah Siswa',
})
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();
const errors = ref({} as any)

const fields = [
  { label: 'NIS', key: 'nis', type: 'text' ,required: true},
  { label: 'NISN', key: 'nisn', type: 'text' ,required: false},
  { label: 'Nama', key: 'nama', type: 'text',required: true },
  { label: 'Nama Panggilan', key: 'nama_panggilan', type: 'text',required: true },
  { label: 'Status', key: 'status', type: 'select', options: ['Aktif', 'Lulus','Keluar','Pindah'],required: true },
  { label: 'Tempat Lahir', key: 'tempat_lahir', type: 'text',required: true },
  { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date',required: true },
  { label: 'Jenis Kelamin', key: 'jenis_kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'],required: true },
  { label: 'Tanggal Masuk', key: 'tanggal_masuk', type: 'date',required: true },
  { label: 'Email', key: 'email', type: 'email',required: false },
]

const form = reactive({
  nis: Date.now().toString(),
  nisn: '',
  nama: '',
  nama_panggilan: '',
  status: 'Aktif',
  tempat_lahir: '',
  tanggal_lahir: '',
  tanggal_masuk: Date.now().toLocaleString(),
  jenis_kelamin: 'Laki-laki',
  email: '',
} as any)

const handleFormSubmit = async () => {  
  isLoading.value = true;
  errors.value = {};
  try {
    const res = await client('/api/siswa', { method: 'POST', body: form });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Siswa berhasil ditambahkan', life: 3000 });
    //redirect
    navigateTo('/siswa/'+res.id+'/edit');
  } catch (error) {
    const er = useSanctumError(error);
    errors.value = er.bag;
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Siswa gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}


</script>