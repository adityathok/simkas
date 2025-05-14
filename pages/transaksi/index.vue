<template>

  <div class="flex md:justify-between justify-end items-center gap-1 mb-3">
    <div class="flex justify-start items-center gap-1">
      <Select v-model="filters.per_page" :options="[20,50,100]" size="small" />
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
        <Column field="nomor" header="Nomor">      
          <template #body="slotProps">
            <!-- <TransaksiBadgeArus :arus="slotProps.data.arus" /> -->
            <button type="button" @click="openDialog(slotProps.data,'preview')" class="cursor-pointer block"> 
              {{ slotProps.data.nomor }}
            </button>
          </template>
        </Column>
        <!-- <Column field="arus" header="Arus">
          <template #body="slotProps">
            <TransaksiBadgeArus :arus="slotProps.data.arus" />
          </template>
        </Column> -->
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
        <Column field="user_id" header="Oleh">          
          <template #body="slotProps">
            <div>
              {{ slotProps.data.user?.name }}
            </div>
            <NuxtLink v-if="slotProps.data.user.siswa" :to="'/siswa/'+slotProps.data.user.siswa?.id" target="_blank" v-tooltip="'Lihat profil siswa'" class="text-xs text-slate-500">
              {{ slotProps.data.user.siswa?.nis }} / {{ slotProps.data.user.siswa?.kelas_siswa.nama }}
            </NuxtLink>
          </template>
        </Column>    
        <!-- <Column field="akun" header="Akun">        
          <template #body="slotProps">
            <template v-if="slotProps.data.items">              
              <template v-for="item in slotProps.data.items">
                        
                <Tag severity="success" v-if="item.akun_pendapatan_id" size="small" class="!font-normal !text-xs !text-slate-800">  
                  {{ item.akun_pendapatan?.nama }}
                </Tag> 
                <Tag severity="warn" v-if="item.akun_pengeluaran_id" size="small" class="!font-normal !text-xs !text-slate-800">  
                  {{ item.akun_pengeluaran?.nama }}
                </Tag>

              </template> 
            </template>  
          </template>
        </Column>         -->
        <Column field="rekening_id" header="Rek">        
          <template #body="slotProps">          
            <span v-if="slotProps.data.akun_rekening_id">  
              {{ slotProps.data.akun_rekening.nama }}
            </span>
          </template>
        </Column>
        <Column field="tanggal" header="Tgl" /> 
        <Column field="act" header="">
          <template #body="slotProps">            
            <div class="flex items-center gap-1">
              <Button severity="secondary" class="!px-2" @click="openDialog(slotProps.data,'preview')">
                <Icon name="lucide:eye" />
              </Button>
              <Button severity="info"  class="!px-2" @click="openDialog(slotProps.data,'edit')">
                <Icon name="lucide:pen" />
              </Button>
              <Button severity="danger"  class="!px-2" @click="confirmDelete(slotProps.data.id)">
                <Icon name="lucide:trash-2" />
              </Button>
            </div>
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
                      const currentPage =  page - 1;
                      event.state.d_first = itemForPage * currentPage;
                  },
              }"
          >
        </Paginator>
      </div>

    </template>
  </Card>

  <Dialog v-model:visible="visibleDialog" :modal="true" :header="actionDialog=='edit'?'Edit Transaksi':'Transaksi'" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
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
  per_page : 20,
  dates:'' as any,
  date_start: '',
  date_end:'',
  jenis: '',
  pendapatan_id:'',
  pengeluaran_id:'',
  rekening_id:''
})

function onSubmitFilters( data: any) {
  visibleFilter.value = false
  filters.value = data
  filters.value.page = page.value
  filters.value.jenis = data.jenis
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
watch(() => [filters.value.per_page,filters.value.dates], () => {
  refresh()
})

const { data, status, error, refresh } = await useAsyncData(
    'transaksi-page-'+page.value,
    () => client('/api/transaksi',{
      params : filters.value
    })
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1;
    filters.value.page = event.page + 1;
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
        message: 'Menghapus transaksi juga akan mengembalikan status tagihan. Apakah anda yakin?',
        header: 'Hapus Transaksi ?',
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
              await client('/api/transaksi/'+id, { method: 'DELETE' }) 
              refresh()
              toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Transaksi berhasil dihapus', life: 3000 });
            }  catch(er) {
              const eror = useSanctumError(er)
              console.log(eror)
              toast.add({ severity: 'error', summary: 'Gagal', detail: 'Transaksi gagal dihapus, '+eror.bag, life: 3000 });
            }
        },
    });
};
</script>

