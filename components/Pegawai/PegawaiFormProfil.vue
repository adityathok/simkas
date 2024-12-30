<template>
  
  <form @submit.prevent="handleFormSubmit">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div v-for="field in formFields" :key="field.key">

          <label :for="field.key" class="block mb-1">{{ field.label }}</label>

          <InputText v-if="field.type == 'date'" type="date" v-model="form[field.key]" :id="field.key" class="w-full" />

          <Select v-else-if="field.type == 'select'" v-model="form[field.key]" :options="field.options" placeholder="Pilih" class="w-full" />

          <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

      </div>       
        
    </div> 

    <div class="flex justify-end mt-4">

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

<script setup lang="ts">
  const props = defineProps(['action','idpegawai','data'])
  const data = props.data
  const idpegawai = props.idpegawai || '';
  const toast = useToast();
  const client = useSanctumClient();

  const isLoading = ref(false)
  const error = ref({})
  const action = ref(props.action || 'add');

  const formFields = [
    { label: 'NIP', key: 'nip', type: 'text' },
    { label: 'Nama', key: 'nama', type: 'text' },
    { label: 'Status', key: 'status',type: 'select', options: ['Aktif', 'Keluar'] },
    { label: 'Tempat Lahir', key: 'tempat_lahir', type: 'text' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date' },
    { label: 'Tanggal Masuk', key: 'tanggal_masuk', type: 'date' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'] },
    { label: 'Email', key: 'email', type: 'text' },
  ]

  const form: Record<any, any> = reactive({
      nip: Date.now().toString(),
      nama: '',
      status: 'Aktif',
      tempat_lahir: '',
      tanggal_lahir: '',
      tanggal_masuk: '',
      jenis_kelamin: 'Laki-laki',
      email: '',
  })

  if(data){    
    Object.assign(form, data);
  }

  const handleFormSubmit = async () => {
    isLoading.value = true; 
    error.value = {};

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }

    try {
      // Lakukan request POST menggunakan client 
      if(action.value == 'edit'){        
        await client('/api/pegawai/'+idpegawai, {
          method: 'PUT',
          body: formData
        })
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
      } else {
        const response = await client('/api/pegawai',{
          method: 'POST',
          body: formData
        })
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambah', life: 3000 });
        navigateTo('/pegawai/edit?id='+response.id);
      }

    } catch (err) {
      const e = useSanctumError(err);
      error.value = e.bag;      
      toast.add({ severity: 'error', summary: 'Gagal', detail: e.msg, life: 3000 });
    } finally {
      isLoading.value = false; 
    }

  }



</script>