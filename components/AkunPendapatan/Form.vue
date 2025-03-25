<template>  
  <form @submit.prevent="handleFormSubmit" class="flex flex-col gap-2">
    
    <div v-for="(item, index) in fields" class="border-b py-1 flex flex-col md:flex-row">
        <label class="md:basis-1/4 mb-1">
          {{ item.label }}
        </label>
        <div class="md:flex-1">

          <ToggleSwitch v-if="item.type == 'checkbox'" v-model="form[item.key]" />
          <Select v-else-if="item.type == 'select'" v-model="form[item.key]" :options="optionJurnalKas" optionLabel="label" optionValue="value" placeholder="Pilih" class="w-full" />
          <InputText v-else type="text" v-model="form[item.key]" class="w-full" />

          <div v-if="item.desc" class="text-xs text-slate-400 mt-1">
            {{ item.desc }}
          </div>

          <div v-if="item.key == 'jurnalkas_id'" class="text-end">
            <Button @click="openDialog" severity="success" size="small" class="!py-1">
              Tambah Jurnal
            </Button>
          </div>

        </div>
    </div>
    <div class="text-end">
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

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Buat Jurnal Kas" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <JurnalKasForm action="add" @update="fJurnalKas()" />
  </Dialog>

</template>

<script setup lang="ts">
const emit = defineEmits(['update']);
const props = defineProps(['data','action'])
const data = props.data
const action = props.action
const toast = useToast();
const isLoading = ref(false)
const client = useSanctumClient();
const visibleDialog = ref(false);

const fields = [
  // { key: 'id', label: 'ID', type: 'text' },
  { key: 'nama', label: 'Nama', type: 'text', desc: 'Nama Akun Pendapatan' },
  { key: 'neraca', label: 'Neraca', type: 'checkbox', desc: 'Masuk ke laporan Neraca' },
  { key: 'jurnal_khusus', label: 'Jurnal Khusus', type: 'checkbox', desc: 'Laporan Jurnal Khusus' },
  { key: 'jurnalkas_id', label: 'Jurnal Kas', type: 'select', desc: 'Pilih Jurnal Kas' },
]

const form = reactive({
  id: '',
  nama: '',
  neraca: false,
  jurnal_khusus: false,
  jurnalkas_id: '',
} as any)

//jika action = edit & ada data
if(data){
  form.id = data.id
  form.nama = data.nama
  form.neraca = data.neraca
  form.jurnal_khusus = data.jurnal_khusus
  form.jurnalkas_id = data.jurnalkas_id
}

const handleFormSubmit = async () => {  
  isLoading.value = true;

  if(action=='edit') {
    try {
      const res = await client('/api/akunpendapatan/'+data.id, { method: 'PUT', body: form });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil diubah', life: 3000 });
      emit('update')
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal diubah', life: 3000 });
    }
  } else {
    try {
      const res = await client('/api/akunpendapatan', { method: 'POST', body: form });
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil ditambah', life: 3000 });
      emit('update')
    } catch (error) {
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal ditambahkan', life: 3000 });
    }
  }
  isLoading.value = false;
}

const { data: optionJurnalKas ,refresh: fJurnalKas } = await useAsyncData(
    'option-jurnalkas',
    () => client('/api/option/jurnalkas')
)

const openDialog = () => {
  visibleDialog.value = true;
}

</script>
