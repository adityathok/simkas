<template>

  <PengaturanLayout>
    <template #content>      
      
      <form @submit.prevent="handleFormSubmit">
        
        <div v-for="field in fields" :key="field.key">

          <div v-if="status == 'pending'">
            <Skeleton height="10rem"></Skeleton>
          </div>

          <div v-else class="flex flex-col md:flex-row md:justify-between md:items-top border-b py-2">

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

  const { data, status, error, refresh } = await useAsyncData(
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

</script>