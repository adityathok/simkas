<template>
 
  <form @submit.prevent="handleFormSubmit">

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">

      <div v-for="field in formFields" :key="field.key">

          <template v-if="isLoad">
            <Skeleton width="10rem" class="mb-2"></Skeleton>
            <Skeleton height="2rem" class="mb-2"></Skeleton>
          </template>

          <template v-else>

            <label :for="field.key" class="block mb-1">{{ field.label }}</label>

            <InputText v-if="field.type == 'date'" type="date" v-model="form[field.key]" :id="field.key" class="w-full" />

            <Select v-else-if="field.type == 'select'" v-model="form[field.key]" :options="field.options" placeholder="Pilih" class="w-full" />

            <InputText v-else :id="field.key" class="w-full" v-model="form[field.key]" />

          </template>
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

<script setup lang="ts">
  const props = defineProps(['iduser','data'])
  const data = props.data
  const idUser = props.iduser || '';
  const toast = useToast();
  const client = useSanctumClient();

  const isLoad = ref(true)
  const isLoading = ref(false)
  const error = ref({})

  const formFields = [
    { label: 'Golongan', key: 'golongan', type: 'text' },
    { label: 'NIK', key: 'nik', type: 'text' },
    { label: 'Pendidikan Terakhir', key: 'pendidikan_terakhir',type: 'select', options: ['SMP','SMA','D1','D2','D3','S1','S2','S3'] },
  ]

  const form: Record<any, any> = reactive({
    golongan: '',
    nik: '',
    pendidikan_terakhir: 'S1',
  })

  //dapatkan usermeta dan update ke form
  const getmeta = client('/api/usermeta/'+idUser, {
      method: 'GET',
      params: {
        'meta_key[]': ['nik','golongan','pendidikan_terakhir']  
      }
  }).then((res) => {
    Object.assign(form, res)
    isLoad.value = false; 
  })

  const handleFormSubmit = async () => {
    isLoading.value = true; 
    error.value = {};

    const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    try {
        await client('/api/usermeta/'+idUser, {
          method: 'POST',
          body: formData
        })
        toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
    } catch (err) {
      const e = useSanctumError(err);
      error.value = e.bag;      
      toast.add({ severity: 'error', summary: 'Gagal', detail: e.msg, life: 3000 });
    } finally {
      isLoading.value = false; 
    }

  }



</script>