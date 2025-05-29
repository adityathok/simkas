<template>
  <form @submit.prevent="handleFormSubmit" class="flex flex-col gap-2">
    
    <div>
      <label for="bulan">Bulan</label>
      <DatePicker v-model="form.bulan" view="month" dateFormat="mm/yy" class="w-full" />
    </div>
    <div>
      <label for="nominal">Nominal</label>
      <InputNumber v-model="form.nominal" class="w-full" />
    </div>
    <div class="text-end">
      <Button type="submit" label="Simpan" class="mt-4">
        <div v-if="submitLoading" class="flex justify-between items-center gap-2">
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
const emit = defineEmits(['update']);
const props = defineProps(['rekening_id','bulan','nominal'])
const client = useSanctumClient()
const toast = useToast()

const form = reactive({
  akun_rekening_id: props.rekening_id,
  bulan: props.bulan,
  nominal: props.nominal || 0,
})

const submitLoading = ref(false)
const handleFormSubmit = async () => {  
  submitLoading.value = true;

  try {
    const res = await client('/api/saldo_awal', { method: 'POST', body: form });
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Saldo Awal berhasil disimpan', life: 3000 });
    emit('update')
  } catch (error) {
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal menyimpan, silahkan coba lagi', life: 3000 });
  }
  
  submitLoading.value = false;
}
</script>
