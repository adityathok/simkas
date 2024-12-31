<template>  
  <div class="card flex flex-col gap-6 items-center justify-center max-w-sm mx-auto">
        <Image v-if="previewFoto" :src="previewFoto" alt="Image" preview />
        <InputText type="file" @change="handleFileUpload" id="foto" class="w-full"/>
        <Button label="Upload" @click="handleUpload" severity="secondary" />
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
  previewFoto.value = urlStorage+data.avatar

  // Method untuk meng-handle file upload
  function handleFileUpload(event: any) {
      avatar.value = event.target.files[0];
      previewFoto.value = URL.createObjectURL(event.target.files[0])
  }

  const handleUpload = async () => {
    console.log(avatar.value)
    const formData = new FormData();
    formData.append('avatar', avatar.value);
    await client('/api/user/avatar/'+idUser, {
      method: 'POST',
      body: formData
    })
    refresh()
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  }  
</script>
