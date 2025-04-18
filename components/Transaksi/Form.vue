<template>
  <form @submit.prevent="handleFormSubmit" class="grid grid-cols-1 md:grid-cols-4 gap-2">

    <div class="col-start-1 col-end-5 mb-2">
      <label>Siswa</label>
      <div class="mt-1">
        <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
      </div>
    </div>
    <div class="col-start-1 col-end-3 mb-2">
      <label>Nama Transaksi</label>
      <div class="mt-1">
        <InputText v-model="form.nama" type="text" class="w-full" required="true"/>
      </div>
    </div>
    <div class="col-start-3 col-end-5 mb-2">
      <label>Tanggal</label>
      <div class="mt-1">
        <DatePicker v-model="form.tanggal" showTime hourFormat="24" fluid />
      </div>
    </div>
    <div class="col-start-1 col-end-2 mb-2">
      <label>Arus</label>
      <div class="mt-1">
        <Select v-model="form.arus" :options="[{label:'Masuk',value:'masuk'},{label:'Keluar',value:'keluar'}]" optionLabel="label" optionValue="value" class="w-full" required="true"/>
      </div>
    </div>
    <div v-if="form.arus == 'masuk'" class="col-start-2 col-end-4 mb-2">
      <label>Akun Pendapatan</label>
      <div class="mt-1">
        <Select v-model="form.pendapatan_id" showClear :options="optionsData?.akunpendapatan" optionLabel="label" optionValue="value" class="w-full" required="true"/>
      </div>
    </div>
    <div v-else class="col-start-2 col-end-4 mb-2">
      <label>Akun Biaya</label>
      <div class="mt-1">
        <Select v-model="form.pengeluaran_id" showClear :options="optionsData?.akunpengeluaran" optionLabel="label" optionValue="value" class="w-full border !border-red-400" required="true"/>
      </div>
    </div>
    <div class="col-start-4 col-end-5 mb-2">
      <label>Rekening</label>
      <div class="mt-1">
        <Select v-model="form.rekening_id" :options="optionsData?.akunrekening" optionLabel="label" optionValue="value" class="w-full"/>
      </div>
    </div>
    <div class="col-start-1 col-end-5 mb-2">
      <label>Nominal</label>
      <div class="mt-1">
        <InputNumber v-model="form.nominal" mode="currency" currency="IDR" size="large" class="w-full" required/>
      </div>
    </div>
    <div class="col-start-1 col-end-5 mb-2">
      <label>Keterangan</label>
      <div class="mt-1">
        <Textarea v-model="form.keterangan" class="w-full"/>
      </div>
    </div>
    
    <div v-if="errors" class="col-start-1 col-end-5 text-end">
      <Message severity="warn" v-for="item in errors" class="mb-1">
        {{ item[0] }}
      </Message>
    </div>

    <div class="col-start-1 col-end-5 text-end">
        <Button type="submit" label="Simpan" class="mt-4">

          <div v-if="isLoading" class="flex justify-between items-center gap-2">
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

const { data:optionsData } = await useAsyncData(
    'option-formtransaksi',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening,akunpendapatan,akunpengeluaran'
      }
    })
)

const form = ref({
  nama: '',
  nominal: '',
  arus: 'masuk',
  pendapatan_id: '',
  pengeluaran_id:'',
  rekening_id:'CASH',
  tagihan_id:'',
  user_id:'',
  tanggal: dayjs().utc().local().format('YYYY-MM-DD HH:mm'),
  keterangan:'',
} as any);

//jika action edit dan ada data
if(action == 'edit' && data){
  form.value = data
}

function onSiswaSelect(selected: { id: any; user_id: any; }) {
  form.value.siswa_id = selected.id
  form.value.user_id = selected.user_id
}
function onSiswaSelectClear(){
  form.value.siswa_id = ''
  form.value.user_id = ''
}

const handleFormSubmit = async () => {  
  isLoading.value = true;
  errors.value = '';

  if(form.value.arus=='masuk' && !form.value.pendapatan_id){
    isLoading.value = false;
    return false;
  }

  const tgl = form.value.tanggal?dayjs(form.value.tanggal).utc().local().format('YYYY-MM-DD HH:mm:ss'):''
  form.value.tanggal = tgl

  if(action == 'edit') {
    try {
      await client('/api/transaksi/'+data.id, { method: 'PUT', body: form.value });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diubah', life: 3000 });
    } catch(er) {
      const err = useSanctumError(er)
      errors.value = err.bag
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal diubah, silahkan coba lagi', life: 3000 });
    }
  } else {

    try {
      await client('/api/transaksi', { method: 'POST', body: form.value });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambah', life: 3000 });
    } catch(er) {
      const err = useSanctumError(er)
      errors.value = err.bag
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan, silahkan coba lagi', life: 3000 });
    }
  }
  isLoading.value = false;
}
</script>
