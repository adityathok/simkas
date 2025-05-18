<template>

  <div class="flex md:justify-between justify-end items-center gap-1 mb-5">
    <div class="flex justify-start items-center gap-1">
      <Select v-model="filters.per_page" :options="[20,50,100]" size="small" />
      <DatePicker v-model="filters.bulan" placeholder="Bulan" view="month" dateFormat="mm/yy" selectionMode="range" :manualInput="true" size="small" />
      <Select v-model="filters.rekening_id" :options="optionsData?.akunrekening" optionLabel="label" optionValue="value" size="small" placeholder="Rekening" />
    </div>
    <div class="flex justify-end items-center gap-1">
      <!-- <Button size="small" variant="outlined" @click="visibleFilter = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
      </Button>
      <Button size="small" @click="openDialog('','add')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
      </Button> -->
    </div>
  </div>

  <DashCard>
      <DataTable :value="data.data" class="text-sm text-nowrap" stripedRows scrollable>
        <Column field="tanggal" header="Tanggal" />
        <Column field="keterangan" header="Ket.">        
          <template #body="slotProps"> 
              {{ slotProps.data.catatan }}
          </template>
        </Column>
        <Column field="masuk" header="Masuk" class="text-blue-700">        
          <template #body="slotProps"> 
            <span v-if="slotProps.data.jenis == 'pendapatan'">
              {{ slotProps.data.nominal_label }}
            </span>           
          </template>
        </Column>
        <Column field="keluar" header="Keluar" class="text-red-500">        
          <template #body="slotProps">           
            <span v-if="slotProps.data.jenis == 'pengeluaran'">
              {{ slotProps.data.nominal_label }}
            </span>   
          </template>
        </Column>
        <Column field="saldo" header="Saldo">        
          <template #body="slotProps"> 
            {{ formatUang(slotProps.data.saldo) }}
          </template>
        </Column>
      </DataTable>

  </DashCard>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { formatUang } from '~/utils/formatUang';

definePageMeta({
    title: 'Likuiditas Rekening',
})
const route = useRoute();
const client = useSanctumClient();

const filters = ref({
  page: route.query.page || 1, 
  per_page : 20,
  bulan: dayjs().utc().local().format('YYYY-MM') as any,
  rekening_id: 1
})

const { data:optionsData } = await useAsyncData(
    'option-formtransaksi',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening'
      }
    })
)

//watch filters
watch(() => [filters.value.per_page,filters.value.bulan,filters.value.rekening_id], () => {
  //ubah bulan ke format yyyy-mm
  const bulan = dayjs(filters.value.bulan).utc().local().format('YYYY-MM')
  filters.value.bulan = bulan
  refresh()
})

const { data, status, error, refresh } = await useAsyncData(
    'likuiditas-'+filters.value,
    () => client('/api/likuiditas',{
      params : filters.value
    })
)
const onPaginate = (event: { page: number }) => {
    filters.value.page = event.page + 1;
    refresh()
    navigateTo('/likuiditas?page='+event.page + 1)
};
</script>