<template>
  <form @submit.prevent="handleFormSubmit">
    <div class="flex flex-col gap-4">

      {{ idPegawai.value }}

      <div v-for="field in formFields" :key="field.key">
      
        <template v-if="field.type !== 'file'" >

          <label :for="field.key" class="block mb-1">{{ field.label }}</label>

          <DatePicker v-if="field.type == 'date'" v-model="form[field.key]" fluid showIcon dateFormat="yy-mm-dd"/>

          <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

        </template>
        

        <template v-if="field.type == 'file'">
          <label for="foto">Foto</label>
          <img v-if="previewFoto" :src="previewFoto" alt="" class="rounded mb-2 max-w-[150px]">
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
  <Toast />
</template>

<script setup lang="ts">
  const toast = useToast();
  const { urlStorage } = useGlobalStore()
  const client = useSanctumClient();
  const props = defineProps(['idpegawai']);
  const idPegawai = props.idpegawai;
  const previewFoto = ref('');
  const emit = defineEmits(['update'])

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

  const formFields = [
    { label: 'NIP', key: 'nip', type: 'text' },
    { label: 'Nama', key: 'nama', type: 'text' },
    { label: 'Status', key: 'status', type: 'text' },
    { label: 'Tempat Lahir', key: 'tempat_lahir', type: 'text' },
    { label: 'Tanggal Lahir', key: 'tanggal_lahir', type: 'date' },
    { label: 'Tanggal Masuk', key: 'tanggal_masuk', type: 'date' },
    { label: 'Jenis Kelamin', key: 'jenis_kelamin', type: 'text' },
    { label: 'NIK', key: 'nik', type: 'text' },
    { label: 'Email', key: 'email', type: 'text' },
    { label: 'Foto', key: 'foto', type: 'file' },
  ]

  // Method untuk meng-handle file upload
  function handleFileUpload(event: any) {
      form.foto = event.target.files[0];
      previewFoto.value = URL.createObjectURL(event.target.files[0])
  }
    
  onMounted(async () => {
    if(idPegawai){
      await client('/api/pegawai/'+idPegawai)
        .then((res) => {
            form.nip = res.nip
            form.nama = res.nama
            form.status = res.status
            form.tempat_lahir = res.tempat_lahir
            form.tanggal_lahir = res.tanggal_lahir
            form.tanggal_masuk = res.tanggal_masuk
            form.jenis_kelamin = res.jenis_kelamin
            form.nik = res.nik
            form.email = res.email
            form.foto = res.foto
            previewFoto.value = urlStorage+res.foto
      })
    }
  });

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
    emit('update')
  }  

</script>

