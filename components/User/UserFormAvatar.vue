<template>  
  <div class="card flex flex-col gap-6 items-center justify-center max-w-sm">
        <Image v-if="previewFoto" :src="previewFoto" alt="Image" preview />
        <InputText type="file" @change="handleFileUpload" id="foto" class="w-full"/>
        <div class="flex justify-center gap-1">
          <Button @click="handleUpload">
              <Icon name="lucide:upload-cloud" mode="svg"/> Upload
          </Button>
          <Button @click="removeAvatar" severity="danger" v-if="form.avatar">
              <Icon name="lucide:trash" mode="svg"/> Hapus gambar
          </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
  const props = defineProps(['iduser'])
  const idUser = props.iduser
  const toast = useToast();
  const client = useSanctumClient();
  const { urlStorage } = useGlobalStore()
  const avatar = ref('');
  const previewFoto = ref('');

  const { data, status, error, refresh } = await useAsyncData(
    'avatar'+idUser,
    () => client('/api/user/avatar/'+idUser)
  )

  const form = reactive({
    avatar: data.value.avatar
  })

  onMounted(() => {
    if(form.avatar){
      previewFoto.value = urlStorage+form.avatar
    }
  })

  // Method untuk meng-handle file upload
  function handleFileUpload(event: any) {
      avatar.value = event.target.files[0];
      previewFoto.value = URL.createObjectURL(event.target.files[0])
  }

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('avatar', avatar.value);
    await client('/api/user/avatar/'+idUser, {
      method: 'POST',
      body: formData
    })
    refresh()
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  }  
  
  const removeAvatar = async () => {
    await client('/api/user/avatar/'+idUser, {
      method: 'DELETE'
    })
    refresh()
    previewFoto.value = ''
    form.avatar = ''
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
  }
</script>
