<template>

  <div class="flex md:justify-between justify-end items-center gap-1 mb-3">
    <div class="flex justify-start items-center gap-1">
      <Select v-model="filters.count" :options="[20,50,100]" size="small" />
      <DatePicker v-model="filters.dates" placeholder="Tanggal" selectionMode="range" :manualInput="true" size="small" />
    </div>
    <div class="flex justify-end items-center gap-1">
      <span v-if="status==='pending'" class="text-sm opacity-50">
        Loading...
      </span>
      <Button size="small" variant="outlined" @click="visibleFilter = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
      </Button>
      <Button size="small" @click="openDialog('','add')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
      </Button>
    </div>
  </div>

  <Card>
    <template #content>

      <DataTable :value="data.data" v-model:selection="selectedTransaksi" class="text-sm text-nowrap" stripedRows scrollable>
        <Column selectionMode="multiple"></Column>
        <Column field="nama" header="Nama">      
          <template #body="slotProps">
            <button type="button" @click="openDialog(slotProps.data,'preview')" class="cursor-pointer"> 
              {{ slotProps.data.nama }}
            </button>
          </template>
        </Column>
        <Column field="arus" header="Arus">
          <template #body="slotProps">
            <TransaksiBadgeArus :arus="slotProps.data.arus" />
          </template>
        </Column>
        <Column field="nominal" header="Nominal">        
          <template #body="slotProps">            
            {{ slotProps.data.nominal_label }}
          </template>
        </Column>
        <Column field="user_id" header="Oleh">          
          <template #body="slotProps">
            <div>
              {{ slotProps.data.user?.name }}
            </div>
            <NuxtLink :to="'/siswa/'+slotProps.data.user.siswa.id" target="_blank" v-if="slotProps.data.user?.siswa.nis" v-tooltip="'Lihat profil siswa'" class="text-xs text-slate-500">
              {{ slotProps.data.user.siswa.nis }} / {{ slotProps.data.user.siswa.kelas_siswa.nama }}
            </NuxtLink>
          </template>
        </Column>    
        <Column field="akun" header="Akun">        
          <template #body="slotProps">          
            <Tag severity="success" v-if="slotProps.data.pendapatan_id" class="!font-normal !text-slate-800">  
              {{ slotProps.data.akunpendapatan?.nama }}
            </Tag>          
            <Tag severity="danger" v-if="slotProps.data.pengeluaran_id" class="!font-normal !text-slate-800">  
              {{ slotProps.data.akunpengeluaran?.nama }}
            </Tag>
          </template>
        </Column>        
        <Column field="rekening_id" header="Rek">        
          <template #body="slotProps">          
            <span v-if="slotProps.data.rekening_id">  
              {{ slotProps.data.akunrekening.nama }}
            </span>
          </template>
        </Column>
        <Column field="tanggal" header="Tgl" /> 
        <Column field="act" header="">
          <template #body="slotProps">            
            <div class="flex">
              <Button severity="secondary" variant="text" class="!px-2" @click="openDialog(slotProps.data,'preview')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              </Button>
              <Button severity="info" variant="text"  class="!px-2" @click="openDialog(slotProps.data,'edit')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
            :rows="data.per_page"
            :totalRecords="data.total"
            @page="onPaginate"
            :pt="{
                root: (event: any) => {
                    const itemForPage =  data.per_page;
                    const currentPage =  page - 1;
                    event.state.d_first = itemForPage * currentPage;
                },
            }"
        >
      </Paginator>

    </template>
  </Card>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Transaksi" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <TransaksiPreview v-if="actionDialog == 'preview'" :data="selectedItem" @edit="openDialog(selectedItem,'edit')"/>
    <TransaksiForm v-else :action="actionDialog" :data="selectedItem" @update="refresh"/>
  </Dialog>
  
  <Drawer v-model:visible="visibleFilter" header="Filter" position="right">
    <TransaksiFormFilters @submit="onSubmitFilters" :params="filters"/>
  </Drawer>

</template>


<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

definePageMeta({
    title: 'Riwayat Transaksi',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();
const confirm = useConfirm();
const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);
const toast = useToast();
const selectedTransaksi = ref();
const visibleFilter = ref(false)

const filters = ref({
  page: page.value, 
  count : 20,
  dates:'' as any,
  date_start: '',
  date_end:''
})

function onSubmitFilters( data: any) {
  visibleFilter.value = false
  filters.value = data
  filters.value.page = page.value
  refresh()
}

watch(() => [filters.value.dates], () => {
  if(filters.value.dates[0]){
    const utcDate = dayjs(filters.value.dates[0]).utc().local().format()
    filters.value.date_start = utcDate
  }
  if(filters.value.dates[1]){
    const utcDate = dayjs(filters.value.dates[1]).utc().local().format()
    filters.value.date_end = utcDate
  }
})

//watch filters
watch(() => [filters.value.count,filters.value.dates], () => {
  refresh()
})

const { data, status, error, refresh } = await useAsyncData(
    'transaksi-page-'+page.value,
    () => client('/api/transaksi',{
      params : {
        page: page.value,
        count : filters.value.count,
        date_start : filters.value.date_start,
        date_end : filters.value.date_end
      }
    })
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/transaksi?page='+page.value)
};

const openDialog = (itemData: any,action : string) => {
  visibleDialog.value = true;
  actionDialog.value = action;
  selectedItem.value = itemData;
}

const confirmDelete = (id: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus transaksi ?',
        header: 'Hapus Transaksi',
        rejectLabel: 'Batal',
        rejectProps: {
            label: 'Batal',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Hapus',
            severity: 'danger'
        },
        accept: async () => {
            try {
              await client('/api/akunpendapatan/'+id, { method: 'DELETE' }) 
              refresh()
              toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
            }  catch(er) {
              console.log(er)
              toast.add({ severity: 'error', summary: 'Gagal', detail: 'Gagal dihapus', life: 3000 });
            }
        },
    });
};
</script>

