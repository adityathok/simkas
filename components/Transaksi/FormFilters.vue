<template>

  <div v-if="optionStatus=='pending'">
    Memuat form..
  </div>

  <form @submit.prevent="handleSubmitFilter">
      <div class="mb-4">
        <FormSelectUser :user_id="form.user_id" @selected="onUserSelect" @clear="onUserSelectClear"/>
      </div> 
      <div class="mb-4">
        <label class="block mb-1 text-slate-500">Rentang Tanggal</label>
        <DatePicker v-model="form.dates" placeholder="Tanggal" selectionMode="range" :manualInput="true" size="small" class="w-full" />
      </div>      
      <div class="mb-4">
        <label class="block mb-1 text-slate-500">Jenis</label>
        <Select v-model="form.jenis" showClear :options="[{label:'Masuk',value:'pendapatan'},{label:'Keluar',value:'pengeluaran'},{label:'Transfer',value:'transfer'}]" optionLabel="label" optionValue="value" class="w-full" required="true"/>
      </div>     
      <div class="mb-4">
        <label class="block mb-1 text-slate-500">Akun Pendapatan</label>
        <Select v-model="form.pendapatan_id" showClear :options="optionsData?.akunpendapatan" optionLabel="label" optionValue="value" class="w-full" required="true"/>
      </div>     
      <div class="mb-4">
        <label class="block mb-1 text-slate-500">Akun Biaya</label>
        <Select v-model="form.pengeluaran_id" showClear :options="optionsData?.akunpengeluaran" optionLabel="label" optionValue="value" class="w-full border" required="true"/>
      </div>   
      <div class="mb-4">
        <label class="block mb-1 text-slate-500">Rekening</label>
        <Select v-model="form.rekening_id" :options="optionsData?.akunrekening" optionLabel="label" optionValue="value" class="w-full"/>
      </div>
    <div class="flex justify-between gap-2 mt-2">
        <Button type="button" @click="resetForm" severity="secondary" class="w-full">
          Reset
        </Button>
        <Button type="submit" class="w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
        </Button>
      </div>
  </form>

</template>

<script setup lang="ts">
const client = useSanctumClient();
const props = defineProps(['params'])
const params = props.params
const emit = defineEmits(['submit'])

const form = ref({
  dates:'' as any,
  jenis:'',
  pendapatan_id: '',
  pengeluaran_id:'',
  rekening_id:''
} as any)

if(params){
  form.value = params
}

const { data:optionsData, status: optionStatus } = await useAsyncData(
    'option-formtransaksi',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening,akunpendapatan,akunpengeluaran'
      }
    })
)

function onUserSelect(data : any){
  form.value.user_id = data.user_id
}
function onUserSelectClear(){
  form.value.user_id = ''
}

const handleSubmitFilter = () => {
  emit('submit',form.value)
}

const resetForm = () => {
  form.value = {
    count: 20,    
    dates:'' as any,
    jenis:'',
    pendapatan_id: '',
    pengeluaran_id:'',
    rekening_id:''
  }
  emit('submit',form.value)
}
</script>

