<template>
  <form  @submit.prevent="handleFormSubmit">
     <div v-for="item in fields" :key="item.key">
        <div class="border-b py-2 flex flex-col md:flex-row">
          <div class="md:basis-1/4 font-semibold mb-1">
            <label>{{ item.label }}</label>
          </div>
          <div class="md:flex-1">

            <Textarea v-if="item.type == 'textarea'" v-model="datas[item.key]" rows="5" cols="20" class="w-full" />
            <Select v-else-if="item.type == 'select'" v-model="datas[item.key]" :options="item.key=='jenjang'?getJenjang:item.options" placeholder="Pilih" />
            <InputText v-else v-model="datas[item.key]" :type="item.type" class="w-full" />

            <Message v-if="errors[item.key]" severity="error" class="mt-1" closable>
              {{ errors[item.key][0] }}
            </Message>

          </div>
        </div>
     </div>
     <div class="flex justify-end mt-4">
      <Button type="submit" :loading="isLoading">           
          <span v-if="isLoading" class="flex gap-2 items-center">
            <Icon class="animate-spin" name="lucide:loader" mode="svg"/> Memproses..         
          </span>
          <span v-else class="flex gap-2 items-center">
            <Icon name="lucide:save" mode="svg"/> Simpan        
          </span> 

        </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
const datas = ref({} as any)
const isLoading = ref(false)
const toast = useToast();
const client = useSanctumClient();
const errors = ref({} as any)

const fields = [
  { label: 'Nama', key: 'nama', type: 'text' },
  { label: 'Jenjang', key: 'jenjang', type: 'select', options: ['SD', 'SMP', 'SMA'] },
  { label: 'Alamat', key: 'alamat', type: 'textarea' },
  { label: 'Desa', key: 'desa', type: 'text' },
  { label: 'Kecamatan', key: 'kecamatan', type: 'text' },
  { label: 'Kota', key: 'kota', type: 'text' },
  { label: 'Provinsi', key: 'provinsi', type: 'text' },
  { label: 'Kode Pos', key: 'kode_pos', type: 'text' },
  { label: 'Status', key: 'status', type: 'select', options: ['aktif', 'nonaktif'] },
  { label: 'Tanggal Berdiri', key: 'tanggal_berdiri', type: 'date' },
  { label: 'Whatsapp', key: 'whatsapp', type: 'text' },
  { label: 'Telepon', key: 'telepon', type: 'text' },
  { label: 'Email', key: 'email', type: 'text' },
  { label: 'Tingkat', key: 'tingkat', type: 'text', array: true },
]

//watch input ada perubahan
watch(datas, () => {
  errors.value = {}
})

//dapatkan option jenjang
const getJenjang = await client('/api/setting/jenjang');

const handleFormSubmit = async () => {  
  isLoading.value = true;
  try {
    const res = await client('/api/unitsekolah/', { method: 'POST', body: datas.value });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit berhasil ditambahkan', life: 3000 });
    navigateTo('/unitsekolah/'+res.id+'/edit');
  } catch (error) {
    const er = useSanctumError(error);
    errors.value = er.bag;
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Unit gagal ditambahkan', life: 3000 });
  }
  isLoading.value = false;
}

</script>
