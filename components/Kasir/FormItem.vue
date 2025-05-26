<template>
  <form @submit.prevent="handleSubmit">
    <div class="mb-3">
      <label for="nama" class="mb-1">Nama item</label>
      <InputText id="nama" v-model="form.nama" class="w-full" required/>
    </div>
    <div class="mb-3">
      <label for="nominal_item" class="mb-1">Nominal item</label>
      <InputNumber id="nominal_item" v-model="form.nominal_item" class="w-full" required/>
    </div>

    <div class="flex gap-3 mb-3">
      <div class="flex-1">
        <label for="qty" class="mb-1">Qty</label>
        <InputNumber id="qty" v-model="form.qty" class="w-full"/>
      </div>
      <div v-if="props.jenis == 'pendapatan'" class="flex-1">
        <label for="akun_pendapatan_id" class="mb-1">Akun Pendapatan</label>
        <Select v-model="form.akun_pendapatan_id" showClear 
        :options="optionsData?.akunpendapatan" 
        optionLabel="label" optionValue="value" 
        class="w-full" required="true"
        id="akun_pendapatan_id"
        />
      </div>
      <div v-if="props.jenis == 'pengeluaran'" class="flex-1">
        <label for="akun_pengeluaran_id" class="mb-1">Akun Biaya</label>
        <Select v-model="form.akun_pengeluaran_id" showClear 
        :options="optionsData?.akunpengeluaran" 
        optionLabel="label" optionValue="value" 
        class="w-full" required="true"
        id="akun_pengeluaran_id"
        />
      </div>
    </div>

    <div class="text-end">
      <Button type="submit" size="small">
        <Icon name="lucide:circle-plus" />
        Tambah
      </Button>
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps(['jenis']);
const emit = defineEmits(['update']);
const client = useSanctumClient();
const toast = useToast();

const { data:optionsData } = await useAsyncData(
    'option-formitemkasir',
    () => client('/api/options',{
      params:{
        keys: 'akunpendapatan,akunpengeluaran'
      }
    })
)

const form = ref({
  nama:'',
  nominal_item: 0 as any,
  nominal: 0,
  qty: 1,
  akun_pendapatan_id: '',
  akun_pengeluaran_id:'',
})

const handleSubmit = () => {

  //jika nominal_item kosong
  if(!form.value.nominal_item){
    toast.add({ severity: 'warn', summary: 'Nominal Item Kosong', detail: 'Nominal Item tidak boleh kosong' });
    return
  }

  //jika jenis pendapatan dan akun_pendapatan_id kosong
  if(props.jenis == 'pendapatan' && !form.value.akun_pendapatan_id){
    toast.add({ severity: 'warn', summary: 'Akun Pendapatan Kosong', detail: 'Pilih Akun Pendapatan !' });
    return
  }
  //jika jenis pengeluaran dan akun_pengeluaran_id kosong
  if(props.jenis == 'pengeluaran' &&!form.value.akun_pengeluaran_id){
    toast.add({ severity: 'warn', summary: 'Akun Pengeluaran Kosong', detail: 'Pilih Akun Pengeluaran !' });
    return
  }

  //hitung nominal
  form.value.nominal = form.value.nominal_item * form.value.qty

  emit('update',form.value)
}
</script>
