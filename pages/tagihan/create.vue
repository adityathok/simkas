<template>

<Card>
  <template #content>
    <form @submit.prevent="handleFormSubmit" class="flex flex-col md:flex-row gap-5">

      <div class="md:basis-1/4">

          <div class="grid grid-cols-1 gap-2 border-2 border-sky-100 shadow rounded-xl p-5 mb-5">
            <TagihanMasterFormTujuan @change="onChangeTujuan" />
          </div>

        </div>
        <div class="md:flex-1">

          <div class="p-3 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2 mb-5">
            <Icon name="lucide:users" />
            <span class="text-lg font-bold">
              {{ form.total_siswa }} siswa
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
              <Select v-model="form.pendapatan_id" showClear :options="optionsPendapatan" optionLabel="label" optionValue="value" class="w-full" required="true" />
            </div>
          </div>

          <div class="mb-5">
              <label class="block mb-1">Keterangan</label>
              <Textarea v-model="form.keterangan" placeholder="Keterangan" class="w-full" />
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

<Dialog v-model:visible="visibleDialog" :modal="true" header="Buat Tagihan" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
  
  <Message severity="warn" v-if="isLoading" class="my-3">
    <Icon name="lucide:loader"  class="animate-spin" /> Menyiapkan pembuatan tagihan, mohon jangan tutup tab ini..
  </Message>
  
  <Message v-if="isProcessBatch" severity="warn" class="mb-2">
    <Icon name="lucide:loader"  class="animate-spin" /> Memproses tagihan untuk siswa, mohon jangan tutup tab ini..
  </Message>

  <Message v-if="DataProcessBatch.done" severity="warn" class="mb-2">
    <Icon name="lucide:loader"  class="animate-spin" /> Memproses tagihan untuk siswa, mohon jangan tutup tab ini..
  </Message>
  
  <ProgressBar :value="ProcessBatchPercentage" />

  <div v-if="LogProcessBatch && LogProcessBatch.length > 0">
    <ScrollPanel style="width: 100%; height: 100px">
      <ol>
        <li v-for="(item,index) in LogProcessBatch" class="text">
          {{ index }} . {{ item.invoice }} | {{ item.user }}
        </li>
      </ol>
    </ScrollPanel>
  </div>

  <div v-if="errors">
    <Message v-for="item in errors" severity="warn" class="mt-3" closable>
      {{ item[0] }}
    </Message>
  </div>
</Dialog> 

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tambah Tagihan',
})

const { tahunAjaran } = useTahunAjaran();
const { configApp } = useConfigStore()
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();
const visibleDialog = ref(false);
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
  total_siswa: 0,
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

const optionsPendapatan = ref([] as any)
const onChangeTujuan = (data: any) => {
  form.unit_sekolah_id = data.unit_sekolah_id
  form.kelas_id = data.kelas_id
  form.user_id = data.user_id
  form.total_siswa = data.total_siswa
  optionsPendapatan.value = data.akunpendapatan
}

//watch periode start
watch(() => [form.nominal,form.type,form.periode_start,form.periode_end], () => {
  // Definisikan dua tanggal
  const tanggalAwal = dayjs(form.periode_start).utc().local(); // Return a Day.js object
  const tanggalAkhir = dayjs(form.periode_end).utc().local(); // Return a Day.js object

  // Hitung selisih bulan
  const selisihBulan = tanggalAkhir.diff(tanggalAwal, 'month');
  form.diff_periode = selisihBulan
})

//watch nominal
watch(() => [form.nominal,form.type], () => {
  if(form.type === 'bulanan'){
    form.total_tagihan = form.total_siswa*form.diff_periode
    form.total_nominal = form.total_tagihan * form.nominal
  } else {
    form.total_tagihan = form.total_siswa
    form.total_nominal = form.total_siswa * form.nominal
  }
})

const ProcessBatchPercentage = ref(0)
const isProcessBatch = ref(false)
const DataProcessBatch = ref({
  done: false
} as any)
let LogProcessBatch: Array<any> = []

const handleFormSubmit = async () => {  
  isLoading.value = true;
  errors.value = '';
  visibleDialog.value = true;
  LogProcessBatch = []
  
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
    form.total_tagihan = form.total_siswa*form.diff_periode
    form.total_nominal = form.total_tagihan * form.nominal
  } else {
    form.total_tagihan = form.total_siswa
    form.total_nominal = form.total_siswa * form.nominal
  }

  ProcessBatchPercentage.value = 0
  isProcessBatch.value = false
  try {
    const res = await client('/api/tagihanmaster', { method: 'POST', body: form });
    newTagihanMaster.value = res
    // tangani error processBatch secara terpisah
    try {
      isLoading.value = false
      isProcessBatch.value = true
      await processBatch(res.id, 0);
    } catch (batchError) {
      console.error('Gagal memproses batch', batchError);
      toast.add({ severity: 'warn', summary: 'Batch Gagal', detail: 'Tagihan ditambah, tapi batch gagal diproses', life: 3000 });
    }

  } catch(er) {
    const err = useSanctumError(er)
    errors.value = err.bag
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan', life: 3000 });
  }
  
  isLoading.value = false;
}

const processBatch = async (masterId: number, offset: number) => {
  try {
    const res = await client('/api/generate-tagihan-batch', {
      method: 'POST',
      params: {
        tagihan_master_id: masterId,
        offset: offset,
      }
    });

    DataProcessBatch.value = res;

    if (!res.done) { 
      isProcessBatch.value = true

      // Delay sebelum batch selanjutnya, pastikan async ditunggu
      await new Promise(resolve => setTimeout(resolve, 500));
      await processBatch(masterId, res.next_offset);
    } else {
      // Jika sudah selesai
      ProcessBatchPercentage.value = 100;
      isProcessBatch.value = false
    }
    
    // Hitung persentase
    const percentage = Math.round((res.total_processed / res.total_tagihan) * 100);
    ProcessBatchPercentage.value = percentage;
    console.log(res.total_processed)
    console.log(res.total_tagihan)

    //tambahkan hasil array res.log ke LogProcessBatch
    const log = res.log
    LogProcessBatch.push(...log); 

  } catch (err) {
    console.error('Error dalam processBatch:', err);
    toast.add({
      severity: 'error',
      summary: 'Gagal proses batch',
      detail: 'Terjadi kesalahan saat proses batch tagihan',
      life: 3000,
    });
  }
  isProcessBatch.value = false
}


</script>

