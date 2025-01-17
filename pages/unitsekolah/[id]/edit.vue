<template>
  <UnitSekolahLayout>

    <div class="flex flex-col md:flex-row gap-4">
      <div class="md:flex-1">

        <form  @submit.prevent="handleFormSubmit">
          <div v-for="item in fields" :key="item.key">
              <div class="border-b py-2 flex flex-col md:flex-row">
                <div class="md:basis-1/4 font-semibold mb-1">
                  <label>{{ item.label }}</label>
                </div>
                <div class="md:flex-1">
                  <InputText v-model="datas[item.key]" :type="item.type" class="w-full" />
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

      </div>
      <div class="md:basis-1/4">
        <div class="bg-slate-100 rounded-lg p-4 my-2">
          <div class="font-medium mb-4">Logo Sekolah</div>
        </div>
      </div>
    </div>

   

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
  { label: 'Jenjang', key: 'jenjang', type: 'text' },
  { label: 'Alamat', key: 'alamat', type: 'text' },
  { label: 'Desa', key: 'desa', type: 'text' },
  { label: 'Kecamatan', key: 'kecamatan', type: 'text' },
  { label: 'Kota', key: 'kota', type: 'text' },
  { label: 'Provinsi', key: 'provinsi', type: 'text' },
  { label: 'Kode Pos', key: 'kode_pos', type: 'text' },
  { label: 'Status', key: 'status', type: 'text' },
  { label: 'Tanggal Berdiri', key: 'tanggal_berdiri', type: 'text' },
  { label: 'Whatsapp', key: 'whatsapp', type: 'text' },
  { label: 'Telepon', key: 'telepon', type: 'text' },
  { label: 'Email', key: 'email', type: 'text' },
]

const handleFormSubmit = async () => {  
  isLoading.value = true;
  try {
    const response = await client('/api/unitsekolah/'+idUnit, {
      method: 'PUT',
      body: datas
    })
    isLoading.value = false;
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Unit berhasil diperbarui', life: 3000 });
  } catch (error) {
    isLoading.value = false;
    toast.add({ severity: 'warn', summary: 'Gagal', detail: 'Terjadi kesalahan', life: 3000 });
    console.error(error)
  }
}

</script>