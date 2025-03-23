<template>

  <Card>
    <template #content>

      <form @submit.prevent="handleFormSubmit" class="flex flex-col gap-2">

        <div v-for="(item, index) in fields" class="border-b py-1 flex flex-col md:flex-row">
          <label class="md:basis-1/4 mb-1">
            {{ item.label }}
          </label>
          <div class="md:flex-1">

            <ToggleSwitch v-if="item.type == 'checkbox'" v-model="form[item.key]" />
            <Select v-else-if="item.type == 'select'" v-model="form[item.key]" :options="item.options" optionLabel="label" optionValue="value"/>
            <InputText v-else v-model="form[item.key]" :type="item.type" class="w-full" />

            <div v-if="item.desc" class="text-xs text-slate-400 mt-1">
              {{ item.desc }}
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
            
    </template>
  </Card>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tambah Transaksi',
})
const client = useSanctumClient();
const isLoading = ref(false)

const fields = [
  { key: 'nama', label: 'Nama', type: 'text', desc: 'Nama / judul transaksi' },
  { key: 'nominal', label: 'Nominal', type: 'number', desc: 'Nominal angka' },
  { key: 'arus', label: 'Arus', type: 'select', options:[{label:'Masuk',value:'masuk'},{label:'Keluar',value:'keluar'}], desc: 'Masuk / keluar' },
  { key: 'jurnalkas_id', label: 'Jurnal Kas', type: 'select', desc: 'Pilih Jurnal Kas' },
]

const form = reactive({} as any);

const handleFormSubmit = async () => {  
  isLoading.value = true;
}

</script>
