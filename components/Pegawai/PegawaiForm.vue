<template>
  <form @submit.prevent="handleFormSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div v-for="field in formFields" :key="field.key">
      
        <template v-if="field.type !== 'file'" >

          <label :for="field.key" class="block mb-1">{{ field.label }}</label>

          <InputText v-if="field.type == 'date'" type="date" :id="field.key" class="w-full" v-model="form[field.key]" />

          <Select v-else-if="field.type == 'select'" v-model="form[field.key]" :options="field.options" class="w-full" />

          <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

        </template>
        
        <template v-if="field.type == 'file'">
          <label for="foto" class="block">Foto</label>          
          <Image v-if="previewFoto" :src="previewFoto" alt="Image" width="150" preview />
          <InputText type="file" @change="handleFileUpload" id="foto" class="w-full"/>
        </template>

      </div>    
        
    </div>
    <div class="flex justify-end mt-4">
        <Button type="submit" label="Simpan">
          <Icon name="lucide:save" mode="svg"/> Simpan
        </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
  const toast = useToast();
  const { urlStorage } = useGlobalStore()
  const client = useSanctumClient();
  const props = defineProps(['idpegawai']);
  const idPegawai = props.idpegawai;
  const previewFoto = ref('');
  const form: Record<any, any> = reactive({
      nip: '',
      nama: '',
      status: '',
      tempat_lahir: '',
      tanggal_lahir: '',
      tanggal_masuk: '',
      jenis_kelamin: '',
      nik: '',
      email: '',
      foto: '',
  })

  if(idPegawai){
    const { data, status, error, refresh } = await useAsyncData(
        'pegawai'+idPegawai,
        () => client('/api/pegawai/'+idPegawai)
    )
    if(error.value==null){
      Object.assign(form, data.value);
      previewFoto.value = urlStorage+data.value.foto
    } else {
      navigateTo({ path: '/pegawai'});
    }
  }

  const formFields = [
    { label: 'NIP', key: 'nip', type: 'text' },
    { label: 'Nama', key: 'nama', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: 'Tempat Lahir', key: 'tempat_lahir', type: 'text' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date' },
    { label: 'Tanggal Masuk', key: 'tanggal_masuk', type: 'date' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'] },
    { label: 'NIK', key: 'nik', type: 'text' },
    { label: 'Email', key: 'email', type: 'text' },
    { label: 'Foto', key: 'foto', type: 'file' },
  ]
  
  // Method untuk meng-handle file upload
  function handleFileUpload(event: any) {
      form.foto = event.target.files[0];
      previewFoto.value = URL.createObjectURL(event.target.files[0])
  }

  const handleFormSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    await client('/api/pegawai/'+idPegawai, {
      method: 'PUT',
      body: formData
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  }  

</script>

