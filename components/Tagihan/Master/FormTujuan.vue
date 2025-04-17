<template>
  <div class="relative">
    <div class="mb-3">
      <label class="block mb-1">Tahun Ajaran</label>
    <Select v-model="form.tahun_ajaran" :options="optionsData?.tahun_ajaran" optionLabel="label" optionValue="value" class="w-full" placeholder="Pilih Tahun Ajaran" required/>
    </div>
    <div class="mb-3">
      <label class="block mb-1">Unit Sekolah</label>
      <Select v-model="form.unit_sekolah_id" showClear :options="optionsData?.unitsekolah" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Sekolah"/>
    </div>
    <div class="mb-3">
      <label class="block mb-1">Kelas</label>
      <Select v-model="form.kelas_id" showClear :options="optionKelas" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Kelas"/>
    </div>
    <div>
      <label class="block mb-1">Siswa</label>
      <Select v-model="form.user_id" showClear :options="optionSiswa" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Siswa"/>
    </div>

    <div v-if="isHitungSiswa" class="absolute top-0 end-0 bottom-0 start-0 flex justify-center items-center backdrop-blur-sm backdrop-opacity-50">
      <Icon name="lucide:loader" class="animate-spin me-1"/> Hitung Siswa..
    </div>

  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['change'])
const { tahunAjaran, tahunMulai, tahunSelesai } = useTahunAjaran();
const { configApp } = useConfigStore()

const form = reactive({
    tahun_ajaran: configApp?configApp.value?.tahun_ajaran:tahunAjaran,
    unit_sekolah_id:'',
    kelas_id: '',
    user_id:'',
    total_siswa: 0,
    akunpendapatan: [],
});

const client = useSanctumClient();

const { data:optionKelas,status: stKelas,refresh:roKelas } = await useAsyncData(
    'option-kelas',
    () => client('/api/option/kelas',{
      params:{        
        tahun_ajaran: form.tahun_ajaran,
        unit_sekolah: form.unit_sekolah_id
      }
    })
)
const { data:optionSiswa,status: stSiswa, refresh:roSiswa } = await useAsyncData(
    'option-siswa',
    () => client('/api/option/siswakelas',{
      params:{
        kelas_id: form.kelas_id
      }
    })
)
const { data:optionsData } = await useAsyncData(
    'option-rekening',
    () => client('/api/options',{
      params:{
        keys: 'tahun_ajaran,unitsekolah,akunpendapatan'
      }
    })
)
onMounted(() => {
  if (optionsData.value.akunpendapatan) {
    form.akunpendapatan = optionsData.value.akunpendapatan
  }
})

//watch kelas
watch(() => [form.tahun_ajaran,form.unit_sekolah_id], () => {
  roKelas()
  form.kelas_id = ''
})

//watch form
const isHitungSiswa = ref(false)
watch(() => [form.tahun_ajaran,form.unit_sekolah_id,form.kelas_id,form.user_id], async () => {

  //recount siswa
  isHitungSiswa.value = true
  try {
    const res = await client('/api/countsiswa',{
      params:{
        tahun_ajaran: form.tahun_ajaran,
        unit_sekolah_id: form.unit_sekolah_id,
        kelas_id: form.kelas_id
      }
    })
    form.total_siswa = res.total
  } catch(er) {
    console.log(er)
  }

  emit('change',form)
  isHitungSiswa.value = false
})
</script>