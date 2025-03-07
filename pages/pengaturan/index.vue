<template>

  <PengaturanLayout>
    <template #content> 
      
      <div class="flex flex-col lg:flex-row  gap-5">
        <div class="lg:flex-1">
          <form @submit.prevent="handleFormSubmit">
        
            <div v-for="field in fields" :key="field.key" class="border-b border-gray-100 py-2">

              <div v-if="status == 'pending'">
                <Skeleton height="10rem"></Skeleton>
              </div>

              <div v-else class="flex flex-col md:flex-row md:justify-between md:items-top gap-2">

                <div class="md:basis-1/3 lg:basis-1/4">
                  <label :for="field.key" class="block mb-1">{{ field.label }}</label>
                </div>

                <div class="flex-1">
                  <InputText v-if="field.type == 'date'" type="date" v-model="form[field.key]" :id="field.key" class="w-full" />

                  <Textarea v-else-if="field.type == 'textarea'" :id="field.key" class="w-full" v-model="form[field.key]" />

                  <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />
                </div>

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
        </div>
        <div class="lg:basis-1/4 md:ps-5 py-10 md:py-2 border-t md:border-t-0">
          <form @submit.prevent="handleFormSubmitLogo">
            <label for="logolembaga" class="block group cursor-pointer relative border min-h-[10rem] rounded-sm">
              <div class="absolute top-0 bottom-0 left-0 right-0 justify-center items-center flex">
                <div class="p-3 group-hover:opacity-100 opacity-50">
                  Upload Logo Lembaga
                </div>
              </div>
              <img v-if="previewLogo" :src="previewLogo" alt="Image" class="w-full h-full aspect-square object-cover"/>
              <InputText @change="handleFileUpload" type="file" id="logolembaga" class="hidden"/>
            </label>
            <div class="flex justify-end my-2">
              <Button type="submit" label="Simpan" :loading="isLoading">
                <Icon name="lucide:upload" mode="svg"/> Simpan Gambar
              </Button>
            </div>
          </form>
        </div>
      </div>     
      

    </template>
  </PengaturanLayout>

</template>

<script setup lang="ts">
  definePageMeta({
      title: 'Pengaturan',
      caption: 'Informasi Lembaga',
  })
  const toast = useToast();
  const client = useSanctumClient();
  const isLoading = ref(false)

  const fields = [
    { label: 'Nama Lembaga', key: 'nama_lembaga', type: 'text' },
    { label: 'Alamat', key: 'alamat_lembaga', type: 'text' },
    { label: 'Kota', key: 'kota_lembaga', type: 'text' },
    { label: 'Kode Pos', key: 'kode_pos_lembaga', type: 'text' },
    { label: 'Telepon', key: 'telepon_lembaga', type: 'text' },
    { label: 'Email', key: 'email_lembaga', type: 'text' },
    { label: 'Website', key: 'website_lembaga', type: 'text' },
    { label: 'Pimpinan', key: 'pimpinan_lembaga', type: 'text' },
  ]

  const { data, status } = await useAsyncData(
      'pengaturan-lembaga',
      () => client('/api/setting', {
         method: 'GET',
         params: {
            'keys[]': [
              'nama_lembaga',
              'alamat_lembaga',
              'kota_lembaga',
              'pimpinan_lembaga',
              'kode_pos_lembaga',
              'telepon_lembaga',
              'email_lembaga',
              'website_lembaga',
              'logo_lembaga',
            ]
         }
      })
  );
  const form = ref(data);  
  const previewLogo = ref(data.value.logo_lembaga);
  
  const handleFormSubmit = async () => {
    try {
      isLoading.value = true;
      const get =await client('/api/setting', {
        method: 'POST',
        body: form.value,
      });
      form.value = get
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal diperbarui', life: 3000 });
    } finally {
      isLoading.value = false
    }
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  }

  const fileLogo = ref('');
  function handleFileUpload(event: any) {
    previewLogo.value = URL.createObjectURL(event.target.files[0]);
    fileLogo.value = event.target.files[0]
  }
  
  const handleFormSubmitLogo = async () => {
    if(!fileLogo.value){
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Logo belum dipilih', life: 3000 });
      return
    }
    const formData = new FormData();
    formData.append('logo', fileLogo.value);
    try {
      isLoading.value = true;
      await client('/api/setting_logo_lembaga', {
        method: 'POST',
        body: formData
      })
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Logo berhasil diperbarui', life: 3000 });
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Upload gagal '+error, life: 3000 });
    } finally {
      isLoading.value = false
    }
  }
</script>