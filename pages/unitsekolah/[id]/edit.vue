<template>
  <UnitSekolahLayout>
    <form @submit.prevent="handleFormSubmit">

    <div class="flex flex-col md:flex-row gap-4" :class="{'cursor-wait': isLoading}">
      <div class="md:flex-1">

          <div v-for="item in fields" :key="item.key">
              <div class="border-b py-2 flex flex-col md:flex-row">
                <div class="md:basis-1/4 font-semibold mb-1">
                  <label>{{ item.label }}</label>
                </div>
                <div class="md:flex-1" :class="{'opacity-50 cursor-wait': isLoading}">
                  
                  <Textarea v-if="item.type == 'textarea'" v-model="datas[item.key]" rows="5" cols="20" class="w-full" />
                  <Select v-else-if="item.type == 'select'" v-model="datas[item.key]" :options="item.key=='jenjang'?getJenjang:item.options" placeholder="Pilih" />
                  <InputText v-else v-model="datas[item.key]" :type="item.type" class="w-full" />

                </div>
              </div>
          </div>

      </div>
      <div class="md:basis-1/4 xl:basis-1/5">
        <div class="py-2 sticky">
          <label for="logounit" class="block group cursor-pointer relative border min-h-[10rem] aspect-square rounded">              
              <div class="absolute top-0 bottom-0 left-0 right-0 justify-center items-center flex">
                <div class="p-3 group-hover:opacity-100 opacity-50">
                  Upload Logo Lembaga
                </div>
              </div>
              <img v-if="previewLogo" :src="previewLogo" alt="Image" class="w-full h-full aspect-square object-cover"/>
              <InputText @change="handleFileUpload" type="file" id="logounit" class="hidden"/>
          </label>
          <div class="mt-4">
            <Button type="submit" :loading="isLoading" class="w-full">
              <span v-if="isLoading" class="flex gap-2 items-center">
                <Icon class="animate-spin" name="lucide:loader" mode="svg"/> Memproses..
              </span>
              <span v-else class="flex gap-2 items-center">
                <Icon name="lucide:save" mode="svg"/> Simpan
              </span>
            </Button>
            <Button type="button" class="w-full mt-2" @click="confirmDelete(datas.id)" severity="danger">
              <Icon name="lucide:trash" mode="svg"/> Hapus Unit
            </Button>
          </div>
        </div>
    </div>       
    </div>
   
  </form>

  </UnitSekolahLayout>
</template>

<script setup lang="ts">
definePageMeta({
    title: 'Edit Unit Sekolah',
})
const route = useRoute()
const idUnit = route.params.id
const toast = useToast();
const client = useSanctumClient();
const confirm = useConfirm();
const isLoading = ref(false)

const datas: Record<string, string> = reactive({
  nama: '',
  jenjang: '',
  alamat: '',
  desa: '',
  kecamatan: '',
  kota: '',
  provinsi: '',
  kode_pos: '',
  status: '',
  tanggal_berdiri: '',
  whatsapp: '',
  telepon: '',
  email: '',
})

const { data, status, error, refresh } = await useAsyncData(
    'unitsekolah-'+idUnit,
    () => client('/api/unitsekolah/'+idUnit)
)

// Pantau perubahan `data` dan isi ulang `datas` saat data baru tersedia
watch(
  () => data.value, // Pantau nilai `data`
  (newData) => {
    if (newData) {
      // Isi ulang `datas` dengan data yang baru
      Object.assign(datas, newData)
    }
  },
  { immediate: true } // Jalankan sekali segera setelah watch dipasang
)

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
]
//dapatkan option jenjang
const getJenjang = await client('/api/setting/jenjang');

const handleFormSubmit = async () => {  
  isLoading.value = true;
  const formData = new FormData();
  for (const key in fields) {
    formData.append(fields[key].key, datas[fields[key].key]);
  }
  if(fileLogo.value){
    formData.append('file_logo', fileLogo.value);
  }
  try {
    const response = await client('/api/unitsekolah/'+idUnit, {
      method: 'PUT',
      body: formData
    })
    isLoading.value = false;
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit berhasil diperbarui', life: 3000 });
  } catch (error) {
    isLoading.value = false;
    toast.add({ severity: 'warn', summary: 'Gagal', detail: 'Terjadi kesalahan', life: 3000 });
    console.error(error)
  }
}

const previewLogo = ref(datas.logo_url)
const fileLogo = ref('')
function handleFileUpload(event: any) {
  previewLogo.value = URL.createObjectURL(event.target.files[0]);
  fileLogo.value = event.target.files[0]
}

const confirmDelete = (id: string) => {
    confirm.require({
        message: 'Yakin untuk menghapus Unit ini ?',
        header: 'Hapus Unit',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            await client('/api/unitsekolah/'+id, { method: 'DELETE' })
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
            navigateTo('/unitsekolah')
        },
    });
};


</script>