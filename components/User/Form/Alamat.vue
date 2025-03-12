<template>
     
  <form @submit.prevent="handleFormSubmit">    
    <div>

      <div v-for="field in formFields" :key="field.key" class="border-b py-3">

        <div v-if="isLoad">
            <Skeleton height="2rem" class="mb-2"></Skeleton>
        </div>

        <div v-else class="flex flex-col md:flex-row">
          <div class="md:basis-1/4 lg:basis-1/6 font-semibold mb-1">
            <label :for="field.key">{{ field.label }}</label>
          </div>

          <div class="md:flex-1">
            
              <InputText v-if="field.type == 'date'" type="date" v-model="form[field.key]" :id="field.key" class="w-full" />

              <Textarea v-else-if="field.type == 'textarea'" :id="field.key" class="w-full" v-model="form[field.key]" />

              <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

          </div>
        </div>

      </div>

    </div>
    <div class="flex justify-end mt-4">
      <Button type="submit" label="Simpan" :loading="isLoading">
        <Icon name="lucide:save" /> 
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
  const props = defineProps(['iduser'])
  const idUser = props.iduser || '';
  const toast = useToast();
  const client = useSanctumClient();

  const isLoad = ref(true)
  const isLoading = ref(false)
  const error = ref({})

  const formFields = [
    { label: 'Alamat', key: 'alamat', type: 'textarea' },
    { label: 'RT', key: 'rt', type: 'text' },
    { label: 'RW', key: 'rw', type: 'text' },
    { label: 'Dusun', key: 'dusun', type: 'text' },
    { label: 'Kelurahan', key: 'kelurahan', type: 'text' },
    { label: 'Kecamatan', key: 'kecamatan', type: 'text' },
    { label: 'Kota', key: 'kota', type: 'text' },
    { label: 'Provinsi', key: 'provinsi', type: 'text' },
    { label: 'Kode Pos', key: 'kode_pos', type: 'text' },
    { label: 'Jenis Tinggal', key: 'jenis_tinggal', type: 'text' },
    { label: 'Transportasi', key: 'transportasi', type: 'text' },
    { label: 'Jarak (km)', key: 'jarak', type: 'text' },  ]

  const form: Record<any, any> = reactive({})

  //dapatkan useralamat dan update ke form
  const getdata = client('/api/useralamat/'+idUser)
  .then((res) => {
    Object.assign(form, res)
    isLoad.value = false; 
  })

  const handleFormSubmit = async () => {    
    isLoading.value = true; 
    error.value = {};
    try {
        await client('/api/useralamat/'+idUser, {
          method: 'POST',
          body: form
        })
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Alamat berhasil diperbarui', life: 3000 });
    } catch (err) {
      const e = useSanctumError(err);
      error.value = e.bag;      
      toast.add({ severity: 'error', summary: 'Gagal', detail: e.msg, life: 3000 });
      console.log(error);
    } finally {
      isLoading.value = false; 
    }
  }
</script>
