<template>  
  <div class="card flex flex-col gap-6 items-center justify-center max-w-sm">

        <label for="avatar" class="relative border rounded-sm min-h-20 overflow-hidden cursor-pointer block w-full bg-white hover:bg-slate-200">          
          <Image v-if="previewFoto" :src="previewFoto" alt="Image"/>
          <div class="flex flex-col justify-center items-center p-5 w-full hover:bg-slate-50 opacity-30 hover:opacity-50 z-10 absolute top-0 left-0 right-0 bottom-0">
            <Icon name="lucide:upload-cloud" />
            <small>Unggah gambar</small>
          </div>
          <InputText type="file" @change="handleFileUpload" id="avatar" class="hidden"/>

          <div v-if="isLoading" class="absolute top-0 left-0 right-0 bottom-0 flex flex-col justify-center items-center p-5 z-50">
            <ProgressSpinner />
          </div>

        </label>

        <div class="flex justify-center gap-1">
          <Button @click="handleUpload"  :loading="isLoading">
              <Icon name="lucide:upload-cloud" /> Upload
          </Button>
          <Button @click="removeAvatar" severity="danger" v-if="data.avatar"  :loading="isLoading">
              <Icon name="lucide:trash" /> Hapus gambar
          </Button>
        </div>
    </div>
</template>

<script setup lang="ts">
  interface User {
    id: string
  }

  const props = defineProps(['iduser'])
  const idUser = props.iduser
  const toast = useToast();
  const { user,refreshIdentity } = useSanctumAuth();
  const currentUserId = ref('');
  const client = useSanctumClient();
  const { urlStorage } = useGlobalStore()
  const isLoading = ref(false)
  const avatar = ref('');
  const previewFoto = ref('');

  const { data, status, error, refresh } = await useAsyncData(
    'avatar'+idUser,
    () => client('/api/user/avatar/'+idUser)
  )

  const form = reactive({
    avatar: data.value.avatar
  })

  watchEffect(() => {
      if (user.value && (user.value as User).id) {
        currentUserId.value = (user.value as User).id;
      }
  });

  onMounted(() => {
    if(form.avatar){
      previewFoto.value = data.value.avatar_url
    }
  })

  // Method untuk meng-handle file upload
  function handleFileUpload(event: any) {
      avatar.value = event.target.files[0];
      previewFoto.value = URL.createObjectURL(event.target.files[0])
  }

  const handleUpload = async () => {

    if(!avatar.value){
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gambar harus diisi', life: 3000 });
      return;
    }

    isLoading.value = true; 
    const formData = new FormData();
    formData.append('avatar', avatar.value);
    await client('/api/user/avatar/'+idUser, {
      method: 'POST',
      body: formData
    })
    refresh()
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
    isLoading.value = false; 

    if(idUser == currentUserId.value){
      refreshIdentity()
    }

  }  
  
  const removeAvatar = async () => {
    isLoading.value = true; 
    
    try {
      await client('/api/user/avatar/'+idUser, {
        method: 'DELETE'
      })
      refresh()
      previewFoto.value = ''
      form.avatar = ''
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Gambar berhasil dihapus', life: 3000 });
    } catch (er) {    
      const e = useSanctumError(er);      
      console.log(e.bag);      
    } finally {      
      isLoading.value = false; 
    }
  }
</script>
