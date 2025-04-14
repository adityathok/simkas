<template>

<Card>
  <template #content>
    <form @submit.prevent="handleFormSubmit" class="flex flex-col md:flex-row gap-5">

      <div class="md:basis-1/4">
          <div class="grid grid-cols-1 gap-2 border-2 border-sky-100 shadow rounded-xl p-5 mb-5">

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

          </div>
        </div>
        <div class="md:flex-1">

          <div class="p-3 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2 mb-5">
            <Icon name="lucide:users" />
            <span class="text-lg font-bold">
              {{ countSiswa.total }} siswa
            </span>
          </div>

          
          <div class="mb-4">
              <label class="block mb-1">Nama Tagihan</label>
              <InputText v-model="form.nama" placeholder="Nama Tagihan" class="w-full" required="true"/>
          </div>          
          <div class="mb-5">
              <label class="block mb-1">Nominal Tagihan</label>
              <InputNumber v-model="form.nominal" placeholder="Nominal Tagihan" mode="currency" currency="IDR" locale="id-ID" size="large" class="w-full border-2 rounded-lg border-slate-500" required="true"/>
          </div>

          <div class="flex flex-col md:flex-row gap-4 mb-5">
            <div class="mb-3 md:mb-0">
              <label class="block mb-1">Tipe Tagihan</label>
              <SelectButton v-model="form.type" :options="[{label:'Insidental',value:'insidental'},{label:'Bulanan',value:'bulanan'}]" optionLabel="label" optionValue="value" required="true"/>
            </div>
            <div v-if="form.type == 'bulanan'" class="mb-3 md:mb-0">
              <label class="block mb-1">Periode Mulai Tagihan</label>
              <DatePicker v-model="form.periode_start" view="month" dateFormat="mm/yy" placeholder="Bulan/Tahun Mulai" />
            </div>  
            <div v-if="form.type == 'bulanan'" class="mb-3 md:mb-0">
              <label class="block mb-1">Periode Akhir Tagihan</label>
              <DatePicker v-model="form.periode_end" view="month" dateFormat="mm/yy" placeholder="Bulan/Tahun Akhir" />
            </div>            
          </div>
          
          <div class="flex flex-col md:flex-row gap-4 mb-5">
            <div class="mb-3 md:mb-0">
              <label class="block mb-1">Tanggal Jatuh Tempo</label>
              <DatePicker v-model="form.due_date" placeholder="Tanggal Jatuh Tempo" class="w-full" />
            </div>
            <div class="mb-3 md:mb-0 md:basis-1/2">
              <label class="block mb-1">Akun Pendapatan</label>
              <Select v-model="form.pendapatan_id" showClear :options="optionsData?.akunpendapatan" optionLabel="label" optionValue="value" class="w-full" required="true" />
            </div>
          </div>

          <div class="mb-5">
              <label class="block mb-1">Keterangan</label>
              <Textarea v-model="form.keterangan" placeholder="Keterangan" class="w-full" />
          </div>

          <div v-if="errors">
            <Message v-for="item in errors" severity="warn" class="mt-3" closable>
              {{ item[0] }}
            </Message>
          </div>
          
          <div class="text-end">
            <Button type="submit" label="Simpan" class="mt-4">

            <div v-if="isLoading" class="flex justify-between items-center gap-2" :loading="isLoading">
              <Icon name="lucide:loader"  class="animate-spin" /> Memproses..
            </div>
            <div v-else class="flex justify-between items-center gap-2">
              <Icon name="lucide:save" /> Buat Tagihan
            </div>

            </Button>
          </div>

        </div>

    </form>
  </template>
</Card>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tambah Tagihan',
})

const { tahunAjaran, tahunMulai, tahunSelesai } = useTahunAjaran();
const { configApp } = useConfigStore()
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();
const errors = ref('' as any)
const newTagihanMaster = ref('' as any)
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const form = reactive({
  tahun_ajaran: configApp?configApp.value?.tahun_ajaran:tahunAjaran,
  unit_sekolah_id:'',
  kelas_id: '',
  user_id:'',
  nama: '',
  nominal:'',
  type: 'bulanan',
  total_tagihan:'',
  total_nominal:'',
  keterangan:'',
  due_date: '',
  periode_start: dayjs().utc().local().format('YYYY-MM-01'),
  periode_end: dayjs().utc().local().format('YYYY-MM-01'),
  akun_pendapatan_id: '',
  user_type: 'siswa'
} as any)

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

const totalSiswa = ref(0 as any)
const { data:countSiswa, refresh: reCountSiswa } = await useAsyncData(
    'count-siswa',
    () => client('/api/countsiswa',{
      params:{
        tahun_ajaran: form.tahun_ajaran,
        unit_sekolah_id: form.unit_sekolah_id,
        kelas_id: form.kelas_id
      }
    })
)
totalSiswa.value = countSiswa.value.total

//watch kelas
watch(() => [form.tahun_ajaran,form.unit_sekolah_id], () => {
  roKelas()
  form.kelas_id = ''
})
//watch count siswa
watch(() => [form.tahun_ajaran,form.unit_sekolah_id,form.kelas_id], () => {
  reCountSiswa()
})

const fieldsUser = [
  {key:'tahun_ajaran',label:'Tahun Ajaran',options:[''] },
  {key:'unit_sekolah_id',label:'Sekolah',options:['']},
  {key:'kelas_id',label:'Kelas',options:optionKelas},
  {key:'user_id',label:'Siswa',options:optionSiswa},
]

//watch periode start
watch(() => [form.type,form.periode_start,form.periode_end], () => {
  // Definisikan dua tanggal
  const tanggalAwal = dayjs(form.periode_start).utc().local(); // Return a Day.js object
  const tanggalAkhir = dayjs(form.periode_end).utc().local(); // Return a Day.js object

  // Hitung selisih bulan
  const selisihBulan = tanggalAkhir.diff(tanggalAwal, 'month');
  form.diff_periode = selisihBulan
})

//watch nominal
watch(() => form.nominal, () => {
  if(form.type === 'bulanan'){
    form.total_tagihan = totalSiswa.value*form.diff_periode
    form.total_nominal = form.total_tagihan * form.nominal
  } else {
    form.total_tagihan = totalSiswa.value
    form.total_nominal = totalSiswa.value * form.nominal
  }
  console.log(totalSiswa.value+''+form.diff_periode)
})

const handleFormSubmit = async () => {  
  isLoading.value = true;
  errors.value = '';
  
  //jika ada periode start
  if(form.periode_start){
    form.periode_start = dayjs(form.periode_start).utc().local().format('YYYY-MM-DD HH:mm:ss')
  }
  //jika ada periode end
  if(form.periode_end){
    form.periode_end = dayjs(form.periode_end).utc().local().format('YYYY-MM-DD HH:mm:ss')
  }
  //jika ada due date
  if(form.due_date){
    form.due_date = dayjs(form.due_date).utc().local().format('YYYY-MM-DD HH:mm:ss')
  }

  //total tagihan
  if(form.type === 'bulanan'){
    form.total_tagihan = totalSiswa.value*form.diff_periode
    form.total_nominal = form.total_tagihan * form.nominal
  } else {
    form.total_tagihan = totalSiswa.value
    form.total_nominal = totalSiswa.value * form.nominal
  }

  try {
    const res = await client('/api/tagihanmaster', { method: 'POST', body: form });
    newTagihanMaster.value = res
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambah', life: 3000 });
    await processBatch(res.id, 0);
  } catch(er) {
    const err = useSanctumError(er)
    errors.value = err.bag
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan', life: 3000 });
  }
  
  isLoading.value = false;
}

const processBatch = async (masterId: number, offset: number) => {
  const res = await client('/api/generate-tagihan-batch', {
    method: 'POST',
    params: {
      tagihan_master_id: masterId,
      offset: offset
    }
  });
  
  if (!res.done) {
    // Tunggu sebentar sebelum lanjut batch berikutnya
    setTimeout(() => {
      processBatch(masterId, res.next_offset);
    }, 500); // kasih delay biar lebih ringan
  } else {
    alert('Semua tagihan berhasil dibuat!');
  }
}

</script>

