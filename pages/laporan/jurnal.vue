<template>
  <div class="mb-5">
    <DatePicker v-model="filter.tanggal" dateFormat="mm/yy/dd" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide-search" class="mr-1" /> Reload
    </Button>
  </div>

  <DashCard>

      <DataTable :value="data.data" class="text-sm text-nowrap" stripedRows scrollable>
        <Column selectionMode="multiple"></Column>
        <Column field="tanggal" header="Tgl" /> 
        <Column field="user_id" header="Nama">          
          <template #body="slotProps">
            <div>
              {{ slotProps.data.user?.name }}
            </div>
            <NuxtLink v-if="slotProps.data.user.siswa" :to="'/siswa/'+slotProps.data.user.siswa?.id" target="_blank" v-tooltip="'Lihat profil siswa'" class="text-xs text-slate-500">
              {{ slotProps.data.user.siswa?.nis }} / {{ slotProps.data.user.siswa?.kelas_siswa.nama }}
            </NuxtLink>
          </template>
        </Column> 
        <Column field="rekening_id" header="Rek">        
          <template #body="slotProps">          
            <span v-if="slotProps.data.akun_rekening_id">  
              {{ slotProps.data.akun_rekening.nama }}
            </span>
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
                      const currentPage =  filter.page - 1;
                      event.state.d_first = itemForPage * currentPage;
                  },
              }"
          >
        </Paginator>
      </div>
      
  </DashCard>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const client = useSanctumClient();

definePageMeta({
    title: 'Jurnal',
})

const route = useRoute();
const filter = reactive({
  tanggal: route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any,
  page: route.query.tanggal || 1,
  per_page : 20,
  jurnal_id:'',
} as any)

const { data, status, error, refresh } = await useAsyncData(
    'jurnal-page-'+filter,
    () => client('/api/transaksi',{
      params : filter
    })
)
const onPaginate = (event: { page: number }) => {
    filter.page = event.page + 1;
    refresh()
};
</script>
