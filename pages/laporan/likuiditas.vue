<template>

  <div class="flex flex-col md:flex-row md:justify-between justify-end items-end gap-1 mb-5">
    <div class="flex justify-start items-center gap-1">
      <Select v-model="filters.per_page" :options="[10,20,50,100]" size="small" />
      <DatePicker v-model="filters.bulan" placeholder="Bulan" view="month" dateFormat="mm/yy" selectionMode="range" :manualInput="true" size="small" />
      <Select v-model="filters.rekening_id" :options="optionsData?.akunrekening" optionLabel="label" optionValue="value" size="small" placeholder="Rekening" />
    </div>
    
    <div v-if="data.rekening" class="max-w-[300px] md:w-[300px] my-5 md:my-0 ms-auto">
      <DashCard class="bg-blue-500 text-white">
        <div class="flex justify-between gap-2 mb-3 items-center">        
          <div>
          {{ data.rekening.nama }}
          </div>
          <div class="text-xs flex gap-2 items-center">
            <Icon name="lucide:calendar" size="14" />
          {{ filters.bulan }}
          </div>
        </div>
        <div class="text-xl font-bold md:text-2xl text-end">
        {{ formatUang(data.saldo_rekening) }}
        </div>
      </DashCard>
    </div>
    <!-- <div class="flex justify-end items-center gap-1"> -->
      <!-- <Button size="small" variant="outlined" @click="visibleFilter = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
      </Button>
      <Button size="small" @click="openDialog('','add')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
      </Button> -->
    <!-- </div> -->
  </div>
    
  <DashCard>

      <DataTable :value="data.data" class="text-sm text-nowrap" stripedRows scrollable>
        <Column field="tanggal" header="Tanggal" />
        <Column field="nomor" header="Nomor" />
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
      <div class="flex flex-col md:flex-row md:justify-between items-center">
        <div class="text-sm text-slate-400">
          {{ data.to }} / {{ data.total }}
        </div>
        <Paginator
              :rows="data.per_page"
              :totalRecords="data.total"
              @page="onPaginate"
              :pt="{
                  root: (event: any) => {
                      const itemForPage =  data.per_page;
                      const currentPage =  filters.page - 1;
                      event.state.d_first = itemForPage * currentPage;
                  },
              }"
          >
        </Paginator>
      </div>

  </DashCard>
<AppLoader :loading="isRefresh"/>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { formatUang } from '~/utils/formatUang';

definePageMeta({
    title: 'Likuiditas Rekening',
})
const client = useSanctumClient();

// Fungsi untuk mengubah params filters menjadi query URL route
const router = useRouter();
function updateRouteParams() {
  router.push({
    query: { ...filters },
  });
}

const route = useRoute();
const filters = reactive({
  page: route.query.page || 1, 
  per_page : Number(route.query.per_page) || 20,
  bulan: route.query.bulan || dayjs().utc().local().format('YYYY-MM') as any,
  rekening_id: Number(route.query.rekening_id) || 1,
  order_by: 'tanggal',
  order: 'asc',
} as any)

//watch route.query.rekening_id
watch(() => route.query.rekening_id, (newValue) => {
  filters.rekening_id = Number(newValue) || 1;
},{ deep: true, immediate: true })

const { data:optionsData } = await useAsyncData(
    'option-formtransaksi',
    () => client('/api/options',{
      params:{
        keys: 'akunrekening'
      }
    })
)

//watch filters
watch(() => [filters.per_page,filters.bulan,filters.rekening_id], () => {
  //ubah bulan ke format yyyy-mm
  const bulan = dayjs(filters.bulan).utc().local().format('YYYY-MM')
  filters.bulan = bulan
  updateRouteParams()
  refresh()
})

const { data, status, error, refresh } = await useAsyncData(
    'likuiditas-'+filters,
    () => client('/api/likuiditas',{
      params : filters
    })
)
const onPaginate = (event: { page: number }) => {
    filters.page = event.page + 1;
    refresh()
    updateRouteParams()
};

//watch status
const isRefresh = ref(false);
watch(status, (newStatus) => {
  if(newStatus == 'pending') {
    isRefresh.value = true;
  } else {
    isRefresh.value = false; 
  }
})

</script>