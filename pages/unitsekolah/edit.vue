<template>

  <Card class="max-w-3xl mx-auto">

      <template #title>
          Unit {{ data.nama }}
      </template>

      <template #content>

          <form @submit.prevent="handleFormSubmit" class="mt-3">

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div v-for="(field, index) in formFields" :key="field.id" :class="field.grid">
                    
                    <label :for="field.id">{{ field.label }}</label>
                    
                    <InputText v-if="field.type == 'text'" :id="field.id" v-model="form[field.id]" type="text" size="large" class="w-full"/>

                    <img v-if="field.type == 'file'" :src="logoUrl" alt="" :id="'preview-'+field.id" class="rounded mb-2">
                    <InputText v-if="field.type == 'file'" @change="handleFileUpload" type="file" :id="field.id" class="w-full"/>

                    <Message v-if="errorForm && errorForm[field.id]" class="mt-1" severity="warn">{{ errorForm[field.id][0] }}</Message>

                </div>

            </div>
            
            <div class="text-end mt-5">
                <Button type="submit" label="Update"/>
            </div>

          </form>

      </template>
  </Card>

  <Toast />
</template>

<script setup lang="ts">
    const { urlStorage } = useGlobalStore()
    const client = useSanctumClient();
    const route = useRoute()
    const idUnit = route.query.id || '';
    const toast = useToast();

    if(!idUnit){
       await navigateTo('/unitsekolah')
    }

    const { data, status, error, refresh } = await useAsyncData(
        'users'+idUnit,
        () => client('/api/unitsekolah/'+idUnit)
    )

    const formFields = [
      {id: 'nama',label: 'Nama',type: 'text',grid: 'md:col-span-full'},
      {id: 'jenjang',label: 'Jenjang',type: 'text'},
      {id: 'status',label: 'Status',type: 'text'},
      {id: 'alamat',label: 'Alamat',type: 'text',grid: 'md:col-span-full'},
      {id: 'desa',label: 'Desa',type: 'text'},
      {id: 'kecamatan',label: 'Kecamatan',type: 'text'},
      {id: 'kota',label: 'Kota',type: 'text'},
      {id: 'provinsi',label: 'Provinsi',type: 'text'},
      {id: 'kode_pos',label: 'Kode Pos',type: 'text'},
      {id: 'tanggal_berdiri',label: 'Tanggal Berdiri',type: 'text'},
      {id: 'kepala_sekolah',label: 'Kepala Sekolah',type: 'text'},
      {id: 'whatsapp',label: 'Whatsapp',type: 'text'},
      {id: 'telepon',label: 'Telepon',type: 'text'},
      {id: 'email',label: 'Email',type: 'text'},
      {id: 'logo',label: 'Logo',type: 'file',grid: 'md:col-span-full'},
    ]

    const form = ref<Record<string, any>>({
        ...data.value,
    });

    const errorForm = ref<Record<string, any>>({})

    const previewLogo = ref('');
    const logoUrl = computed(() => {
        // Jika previewLogo ada, gunakan itu. Jika tidak, fallback ke form.logo atau gambar default.
        return previewLogo.value ? previewLogo.value : (form.value.logo ? `${urlStorage}${form.value.logo}` : '');
    });


    function handleFileUpload(event: any) {
        var id = event.target.id
        // form.value.logopreview = URL.createObjectURL(event.target.files[0])
        previewLogo.value = URL.createObjectURL(event.target.files[0])
        form.value[id] = event.target.files[0]
    }

    const handleFormSubmit = async () => {
        const formData = new FormData();
        for (const key in form.value) {
            formData.append(key, form.value[key]);
        }

        //jika tidak upload logo baru
        if(previewLogo.value == ''){
            formData.delete('logo');
        }

        try {
            await client('/api/unitsekolah/'+data.value.id, {
                method: 'PUT',
                body: formData
            })
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
        } catch (er) {
            const e = useSanctumError(er);
            errorForm.value = e.bag;
            console.log(e.bag);
        }

    }


</script>

