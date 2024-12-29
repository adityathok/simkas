<template>
    <PageHeader>
        <template #title>          
            Tambah Pegawai
        </template>
    </PageHeader>

    <Card>
      <template #content>
        
        <form @submit.prevent="handleFormSubmit">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div v-for="field in formFields" :key="field.key">
      
        <template v-if="field.type !== 'file'" >

          <label :for="field.key" class="block mb-1">{{ field.label }}</label>

          <InputText v-if="field.type == 'date'" type="date" :id="field.key" class="w-full" v-model="form[field.key]" />

          <Select v-else-if="field.type == 'select'" v-model="form[field.key]" :options="field.options" class="w-full" />

          <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

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
    </Card>

</template>

<script setup lang="ts">
  const toast = useToast();
  const client = useSanctumClient();
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
  })

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
  ]

  const handleFormSubmit = async () => {
    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    const response = await client('/api/pegawai', {
      method: 'POST',
      body: formData
    })
    const responseData = await response.json();
    if (!response.ok) {
      toast.add({ severity: 'error', summary: 'Gagal', detail: responseData.message, life: 3000 });
    } else {
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
      navigateTo('/pegawai/edit/'+responseData.id);
    }
  } 

</script>
