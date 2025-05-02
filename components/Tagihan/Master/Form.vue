<template>

<form @submit.prevent="handleFormSubmit">

  <div v-for="item in fields" class="flex flex-col md:flex-row gap-2 mb-3">
    <div class="md:basis-1/3"> {{item.label}} </div>
    <div class="md:flex-1">

      <template v-if="item.type">
        
        <InputNumber v-if="item.type == 'number'" v-model="form[item.key]" type="text" class="w-full" mode="currency" currency="IDR" locale="id-ID" />
        <Textarea v-else-if="item.type == 'textarea'"  v-model="form[item.key]" placeholder="Keterangan" class="w-full" />
        <Select v-else-if="item.type == 'select'" v-model="form.akun_pendapatan_id" showClear :options="optionsData.akunpendapatan" optionLabel="label" optionValue="value" class="w-full" required="true" />
        <InputText v-else v-model="form[item.key]" type="text" class="w-full" />

      </template> 

      <div v-else class="py-2 px-3 rounded bg-zinc-200 min-h-10">        
        <template v-if="item.value">          
          {{item.value}}
        </template>        
        <template v-else>
          {{data[item.key]}}
        </template>
      </div>

    </div>
  </div>

  <div class="text-end">
    <Button type="submit" label="Simpan" class="mt-4">

    <div v-if="isLoading" class="flex justify-between items-center gap-2" :loading="isLoading">
      <Icon name="lucide:loader"  class="animate-spin" /> Memproses..
    </div>
    <div v-else class="flex justify-between items-center gap-2">
      <Icon name="lucide:save" /> Simpan
    </div>

    </Button>
  </div>

</form>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const emit = defineEmits(['update']);
const props = defineProps(['data','action'])
const data = props.data
const action = props.action
const toast = useToast();
const isLoading = ref(false)
const client = useSanctumClient();
const visibleDialog = ref(false);
const errors = ref('' as any)

const { tahunAjaran } = useTahunAjaran();
const { configApp } = useConfigStore()

const form = ref({
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

const fields = [
  { key: 'id', label: 'ID' },
  { key: 'nama', label: 'Nama Tagihan', type: 'text' },
  { key: 'nominal', label: 'Nominal', type: 'number' },
  { key: 'keterangan', label: 'Keterangan', type: 'textarea' },
  { key: 'akun_pendapatan_id', label: 'Akun Pendapatan', type: 'select' },
  { key: 'type', label: 'Tipe' },
  { key: 'due_date', label: 'Tanggal Jatuh Tempo' },
  { key: 'total_tagihan', label: 'Total Tagihan' },
  { key: 'total_nominal', label: 'Total Nominal' },
  { key: 'tahun_ajaran', label: 'Tahun Ajaran' },
  { key: 'unit_sekolah_id', label: 'Unit Sekolah' },
  { key: 'kelas_id', label: 'Kelas',value:'' },
  { key: 'user_id', label: 'Siswa' },
  { key: 'periode_start', label: 'Periode Awal' },
  { key: 'periode_end', label: 'Periode Akhir' },
  // { key: 'user_type', label: 'User Type' },
]

//jika action edit dan ada data
if(action == 'edit' && data){
  form.value = data
  
  //set fields
  fields.forEach(item => {
    // key nominal
    if(item.key == 'nominal'){
      item.value = data.nominal_label
    }
    // total_nominal
    if(item.key == 'total_nominal'){
      item.value = formatUang(data.total_nominal)
    }
    //key unit_sekolah_id
    if(item.key == 'unit_sekolah_id'){
      item.value = data.unitsekolah?.nama
    }
    //kelas
    if(item.key == 'kelas_id'){
      item.value = data.kelas?.nama
    }
  })
}

//watch form.nominal
watch(() => form.value.nominal, (newValue, oldValue) => {
  form.value.total_nominal = newValue * form.value.total_tagihan
})

const { data:optionsData } = await useAsyncData(
    'option-akunpendapatan',
    () => client('/api/options',{
      params:{
        keys: 'akunpendapatan'
      }
    })
)

const handleFormSubmit = async () => { 
  isLoading.value = true;

  try {
    const response = await client('/api/tagihanmaster/'+form.value.id, {
      method: 'PUT',
      body: form.value
    });
    emit('update', response);
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diubah', life: 3000 });
  } catch (er) {
      const err = useSanctumError(er)
      errors.value = err.bag
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan, silahkan coba lagi', life: 3000 });
  }
  
  isLoading.value = false;
}

</script>