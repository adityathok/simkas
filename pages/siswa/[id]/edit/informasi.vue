<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Informasi profil Siswa
    </div>

    <form @submit.prevent="handleFormSubmit">
      <div v-for="item in fields" :key="item.key" class="border-b py-3">

        <div v-if="statusForm=='pending'">
          <Skeleton height="2rem" class="mb-2"/>
        </div>
        <div v-else class="flex flex-col md:flex-row">
            <div class="md:basis-1/4 lg:basis-1/5 font-semibold mb-1">
              <label :for="item.key">{{ item.label }}</label>
            </div>
            <div class="md:flex-1">
                <InputText v-model="form[item.key]" :id="item.key" :type="item.type" class="w-full" />
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

  </SiswaLayoutEdit>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const isLoading = ref(false)
const errors = ref({})
const toast = useToast();

const form: Record<any, any> = reactive({} as any)

// Access to the cached value of dataSiswa
// const { data } = useNuxtData('siswa-'+idUnit)

const { data } = await useAsyncData(
  'siswa-'+idUnit,
  () => client('/api/siswa/'+idUnit)
)

const { data: dataForm, status: statusForm, error: errorForm, refresh: refreshForm } = await useAsyncData(
  'usermeta-'+data.value.user_id,
  () => client('/api/usermeta/'+data.value.user_id, {
    method: 'GET',
    params: {
      'meta_key[]': [
        'nik',
        'alat_transportasi',
        'telepon',
        'hp',
        'whatsapp',
        'skhun',
        'penerima_kps',
        'nomor_kps',
        'ukur_baju',
        'golongan_darah',
        'alamat_orangtua',
        'no_peserta_ujian',
        'no_seri_ijazah',
        'penerima',
        'nomor_kip',
        'nama_di_kip',
        'nomor_kks',
        'nomor_registrasi',
        'bank',
        'nomor_rekening',
        'rekening_atas',
        'layak_pip',
        'kebutuhan_khusus',
        'sekolah_asal',
        'alamat_sekolah_asal',
        'status_sekolah_asal',
        'anak_ke',
        'bahasa',
        'agama',
        'harapan',
        'donasi_sumbangan_sarpras',
        'donasi_sumbangan_sarpras_sub',
        'donasi_sumbangan_gedung',
        'donasi_sumbangan_gedung_sub',
        'pembelian_uang_sragam',
        'pembelian_uang_sragam_lainnya',
        'pembiayaan_ekstrakurikuler',
        'pembiayaan_mos',
        'pembiayaan_spp',
        'pembiayaan_spp_sub'
      ]
    }
  })
)
Object.assign(form, dataForm.value)

const fields = ref([
  { label: 'NIK', key: 'nik', type: 'text' },
  { label: 'Telepon', key: 'telepon', type: 'text' },
  { label: 'HP', key: 'hp', type: 'text' },
  { label: 'WhatsApp', key: 'whatsapp', type: 'text' },
  { label: 'Email', key: 'email', type: 'text' },
  { label: 'SKHUN', key: 'skhun', type: 'text' },
  { label: 'Penerima KPS', key: 'penerima', type: 'text' },
  { label: 'Nomor KPS', key: 'nomor_kps', type: 'text' },
  { label: 'Ukur Baju', key: 'ukur_baju', type: 'text' },
  { label: 'Golongan Darah', key: 'golongan_darah', type: 'text' },
  { label: 'Alamat Orang Tua', key: 'alamat_orangtua', type: 'text' },
  { label: 'No Peserta Ujian', key: 'nomor_peserta_ujian', type: 'text' },
  { label: 'No Seri Ijazah', key: 'no_seri_ijazah', type: 'text' },
  { label: 'Nomor KIP', key: 'nomor_kip', type: 'text' },
  { label: 'Nama Di KIP', key: 'nama_di_kip', type: 'text' },
  { label: 'Nomor KKS', key: 'nomor_kks', type: 'text' },
  { label: 'Nomor Registrasi', key: 'nomor_registrasi', type: 'text' },
  { label: 'Bank', key: 'bank', type: 'text' },
  { label: 'Nomor Rekening', key: 'nomor_rekening_bank', type: 'text' },
  { label: 'Rekening Atas Nama', key: 'rekening_atas_nama', type: 'text' },
  { label: 'Layak PIP', key: 'layak_pip', type: 'text' },
  { label: 'Kebutuhan Khusus', key: 'kebutuhan_khusus', type: 'text' },
  { label: 'Sekolah Asal', key: 'sekolah_asal', type: 'text' },
  { label: 'Alamat Sekolah Asal', key: 'alamat_sekolah_asal', type: 'text' },
  { label: 'Status Sekolah Asal', key: 'status_sekolah_asal', type: 'text' },
  { label: 'Anak Ke', key: 'anak_ke', type: 'text' },
  { label: 'Bahasa', key: 'bahasa', type: 'text' },
  { label: 'Agama', key: 'agama', type: 'text' },
  { label: 'Harapan', key: 'harapan', type: 'text' },
  { label: 'Donasi Sumbangan Sarpras', key: 'donasi_sumbangan_sarpras', type: 'text' },
  { label: 'Donasi Sumbangan Sarpras Sub', key: 'donasi_sumbangan_sarpras_sub', type: 'text' },
  { label: 'Donasi Sumbangan Gedung', key: 'donasi_sumbangan_gedung', type: 'text' },
  { label: 'Donasi Sumbangan Gedung Sub', key: 'donasi_sumbangan_gedung_sub', type: 'text' },
  { label: 'Pembelian Uang Sragam', key: 'pembelian_uang_sragam', type: 'text' },
  { label: 'Pembelian Uang Sragam Lainnya', key: 'pembelian_uang_sragam_lainnya', type: 'text' },
  { label: 'Pembiayaan Ekstrakurikuler', key: 'pembiayaan_ekstrakurikuler', type: 'text' },
  { label: 'Pembiayaan MOS', key: 'pembiayaan_mos', type: 'text' },
  { label: 'Pembiayaan SPP', key: 'pembiayaan_spp', type: 'text' },
  { label: 'Pembiayaan SPP Sub', key: 'pembiayaan_spp_sub', type: 'text' },
])

const handleFormSubmit = async () => {
  isLoading.value = true; 

  const formData = new FormData();
    for (const key in form) {
      formData.append(key, form[key]);
    }
    try {
        await client('/api/usermeta/'+data.value.user_id, {
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