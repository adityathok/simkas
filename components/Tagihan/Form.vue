<template>

  <div class="mb-4 p-4 rounded border border-blue-200 bg-blue-50">
    <div class="text-blue-800 font-bold border-b border-b-blue-100 pb-2 mb-3">Info Tagihan</div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-2">
      <div>
        <div class="text-sm text-slate-400">Nama Tagihan</div>
        <div class="text-sm">{{ data.tagihan_master.nama }}</div>
      </div>
      <div>
        <div class="text-sm text-slate-400">Nominal</div>
        <div class="text-sm font-bold">{{ data.tagihan_master.nominal_label }}</div>
      </div>
      <div>
        <div class="text-sm text-slate-400">Keterangan</div>
        <div class="text-sm">{{ data.tagihan_master?.keterangan }}</div>
      </div>
      <div>
        <div class="text-sm text-slate-400">ID Ref</div>
        <div class="text-sm italic">
          {{ data.tagihan_master?.id }} / {{ data.tagihan_master?.admin?.name }}
        </div>
      </div>
    </div>
  </div>

  <form @submit.prevent="handleFormSubmit" class="grid grid-cols-1 md:grid-cols-4 gap-2">

    <div class="col-start-1 col-end-5 mb-2">
      <label>Siswa</label>
      <div class="mt-1">
        <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
      </div>
    </div>

    <div class="col-start-1 col-end-3 mb-2">
      <label>Nomor Tagihan</label>
      <div class="mt-1">
        <InputText v-model="form.nomor" type="text" class="w-full" disabled required="true"/>
      </div>
    </div>

    <div class="col-start-3 col-end-5 mb-2">
      <label>Tanggal</label>
      <div class="mt-1">
        <DatePicker v-model="form.tanggal" showTime hourFormat="24" fluid />
      </div>
    </div>
    <div class="col-start-1 col-end-5 mb-2">
      <label>Status</label>
      <div class="mt-1">
        <SelectButton v-model="form.status" :options="[{label:'Belum',value:'belum'},{label:'Lunas',value:'lunas'},{label:'Batal',value:'batal'}]" optionLabel="label" optionValue="value" class="w-full"/>
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

const form = ref({
  nomor: '',
  tanggal: dayjs().utc().local().format('YYYY-MM-DD HH:mm'),
  tagihan_master_id:'',
  user_id:'',
  status: 'belum',
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

  const tgl = form.value.tanggal?dayjs(form.value.tanggal).utc().local().format('YYYY-MM-DD HH:mm:ss'):''
  form.value.tanggal = tgl

  if(action == 'edit') {
    try {
      await client('/api/tagihan/'+data.id, { method: 'PUT', body: form.value });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diubah', life: 3000 });
      emit('update')
    } catch(er) {
      const err = useSanctumError(er)
      errors.value = err.bag
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal diubah, silahkan coba lagi', life: 3000 });
    }
  } else {

    try {
      await client('/api/tagihan', { method: 'POST', body: form.value });
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
