<template>
  <SiswaLayoutEdit>
    
    
    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Informasi Wali Siswa
    </div>

    
    <form @submit.prevent="handleFormSubmit">
      <div v-for="item in fields" :key="item.key" class="border-b py-2 flex flex-col md:flex-row">
        <div class="md:basis-1/4 lg:basis-1/5 font-semibold mb-1">
            {{ item.label }}
        </div>
        <div class="md:flex-1">
          <InputText v-model="form[item.key]" :id="item.key" :type="item.type" class="w-full" />
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

  </SiswaLayoutEdit>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Wali Siswa',
})
const route = useRoute()
const idSiswa = route.params.id
const client = useSanctumClient();
const isLoading = ref(false)
const errors = ref({})
const toast = useToast();

const form: Record<any, any> = reactive({} as any)

const fields = [
  {label: 'Alamat Orang Tua', key: 'alamat_orang_tua', type: 'text'},
  {label: 'Nama Ayah', key: 'ayah_nama_lengkap', type: 'text'},
  {label: 'Ayah Tahun Lahir', key: 'ayah_tahun_lahir', type: 'text'},
  {label: 'Ayah Pendidikan', key: 'ayah_pendidikan', type: 'text'},
  {label: 'Ayah Pekerjaan', key: 'ayah_pekerjaan', type: 'text'},
  {label: 'Ayah Penghasilan', key: 'ayah_penghasilan', type: 'text'},
  {label: 'Ayah NIK', key: 'ayah_nik', type: 'text'},
  {label: 'Ayah HP', key: 'ayah_hp', type: 'text'},
  {label: 'Ayah Email', key: 'ayah_email', type: 'email'},
  {label: 'Nama Ibu', key: 'ibu_nama_lengkap', type: 'text'},
  {label: 'Ibu Tahun Lahir', key: 'ibu_tahun_lahir', type: 'text'},
  {label: 'Ibu Pendidikan', key: 'ibu_pendidikan', type: 'text'},
  {label: 'Ibu Pekerjaan', key: 'ibu_pekerjaan', type: 'text'},
  {label: 'Ibu Penghasilan', key: 'ibu_penghasilan', type: 'text'},
  {label: 'Ibu NIK', key: 'ibu_nik', type: 'text'},
  {label: 'Ibu HP', key: 'ibu_hp', type: 'text'},
  {label: 'Ibu Email', key: 'ibu_email', type: 'email'},
  {label: 'Nama Wali', key: 'wali_nama_lengkap', type: 'text'},
  {label: 'Wali Tahun Lahir', key: 'wali_tahun_lahir', type: 'text'},
  {label: 'Wali Pendidikan', key: 'wali_pendidikan', type: 'text'},
  {label: 'Wali Pekerjaan', key: 'wali_pekerjaan', type: 'text'},
  {label: 'Wali Penghasilan', key: 'wali_penghasilan', type: 'text'},
  {label: 'Wali NIK', key: 'wali_nik', type: 'text'},
  {label: 'Wali HP', key: 'wali_hp', type: 'text'},
  {label: 'Wali Email', key: 'wali_email', type: 'email'},
];

//buat metakeys array dari fields
const metakeys = fields.map(item => item.key)

// Access to the cached value of dataSiswa
const { data: dataSiswa } = useNuxtData('siswa-'+idSiswa)

const { data, status, error, refresh } = await useAsyncData(
  'siswameta-'+idSiswa,
  () => client('/api/usermeta/'+dataSiswa.value.user_id,{
    params: {
      'meta_key[]': metakeys
    }
  })
)
Object.assign(form, data.value)

const handleFormSubmit = async () => {
  isLoading.value = true; 
  const formData = new FormData();
  for (const key in form) {
    formData.append(key, form[key]);
  }
  try {
    await client('/api/usermeta/'+dataSiswa.value.user_id, {
      method: 'POST',
      body: formData
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diperbarui', life: 3000 });
  } catch (err) {
    const e = useSanctumError(err);
    errors.value = e.bag;      
    toast.add({ severity: 'error', summary: 'Gagal', detail: e.msg, life: 3000 });
  } finally {
    isLoading.value = false; 
  }
}
</script>
