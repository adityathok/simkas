<template>
  <div class="mb-5">
    <DatePicker v-model="filter.tanggal" dateFormat="dd/mm/yy" :manualInput="true" size="small" />
    <Button @click="getData()" size="small">
      <Icon name="lucide-refresh-cw" class="mr-1" :class="{'animate-spin':loadingData}" /> Reload
    </Button>
  </div>

  <DashCard>

      <DataTable :value="data.data" class="text-sm text-nowrap" stripedRows scrollable>
        <!-- <Column selectionMode="multiple"></Column> -->
        <Column field="transaksi.tanggal" header="Tgl" />
        <Column field="rekening_id" header="Rek">        
          <template #body="slotProps">          
            <span v-if="slotProps.data.transaksi.akun_rekening_id">  
              {{ slotProps.data.transaksi.akun_rekening.nama }}
            </span>
          </template>
        </Column>
        <Column field="deskripsi" header="Deskripsi">          
          <template #body="slotProps">
            <div>
              {{ slotProps.data.nama }}
            </div>
          </template>
        </Column>
        <Column field="user_id" header="Nama">          
          <template #body="slotProps">
            <div>
              {{ slotProps.data.transaksi.user?.name }}
            </div>
            <div v-if="slotProps.data.transaksi.user.siswa" class="text-xs opacity-50">
                {{ slotProps.data.transaksi.user.siswa?.nis }} / {{ slotProps.data.transaksi.user.siswa?.kelas_siswa.nama }}
            </div>
          </template>
        </Column> 
        <Column field="debit" header="Debit">          
          <template #body="slotProps">
            <div v-if="slotProps.data.akun_pendapatan_id">
              {{ formatUang(slotProps.data.nominal) }}
            </div>
          </template>
        </Column>
        <Column field="kredit" header="Kredit">          
          <template #body="slotProps">
            <div v-if="slotProps.data.akun_pengeluaran_id">
              {{ formatUang(slotProps.data.nominal) }}
            </div>
          </template>
        </Column>
        <!-- <Column field="tanggal" header="Tgl" /> 
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
        </Column> -->
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
import { formatUang } from '~/utils/formatUang';
const client = useSanctumClient();

definePageMeta({
    title: 'Jurnal',
})

const route = useRoute();
const filter = reactive({
  tanggal: route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any,
  page: route.query.tanggal || 1,
  per_page : 20,
  jurnal_id: route.query.id || '',
} as any)

const data = ref({} as any)
const loadingData = ref(false);
async function getData() {
  loadingData.value = true;

  //ubah tanggal ke format YYYY-MM-DD
  filter.tanggal = dayjs(filter.tanggal).format('YYYY-MM-DD');

  try {
    const res = await client('/api/laporan_jurnal',{
      params : filter
    })
    data.value = res;
  } catch (error) {
    console.log(error);
  }
  loadingData.value = false;
}
//
onMounted(() => {
  getData()
})
// const { data, status, error, refresh } = await useAsyncData(
//     'laporan-jurnal-page-'+filter,
//     () => client('/api/laporan_jurnal',{
//       params : filter
//     })
// )
const onPaginate = (event: { page: number }) => {
    filter.page = event.page + 1;
    // refresh()
    getData()
};
</script>
