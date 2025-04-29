<template>

  <div class="flex md:justify-between justify-end items-center gap-1 mb-3">
    <div class="flex justify-start items-center gap-1">
      <Select v-model="filters.count" :options="[20,50,100]" size="small" />
      <DatePicker v-model="filters.dates" showButtonBar placeholder="Tanggal" selectionMode="range" :manualInput="true" size="small" />
    </div>
    <div class="flex justify-end items-center gap-1">
      <span v-if="status==='pending'" class="text-sm opacity-50">
        Loading...
      </span>
      <Button size="small" variant="outlined" @click="visibleFilter = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
        <span 
          v-if="filters.user_id || filters.status" 
          class="w-1 h-1 rounded-full bg-yellow-400 absolute top-0 end-0 m-2">
        </span>
      </Button>
      <Button size="small" @click="navigateTo('/tagihan/create')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
      </Button>
    </div>
  </div>

  <Card>
    <template #content>
      <DataTable v-if="data" :value="data.data" v-model:selection="selectedTransaksi" class="text-sm" stripedRows scrollable>
        <Column selectionMode="multiple"></Column>
        <Column field="id" header="ID" />
        <Column field="nama" header="Nama">      
          <template #body="slotProps">
            <button type="button" @click="openDialog(slotProps.data,'preview')" class="cursor-pointer"> 
              {{ slotProps.data.nama }}
            </button>
          </template>
        </Column>
        <Column field="type" header="Tipe" />
        <Column field="nominal_label" header="Nominal" />
        <Column field="akunpendapatan" header="Akun">
          <template #body="slotProps">      
            {{ slotProps.data.akunpendapatan?.nama }}
          </template>
        </Column>
        <Column field="admin" header="Admin">
          <template #body="slotProps">      
            {{ slotProps.data.admin?.name }}
          </template>
        </Column>
        <Column field="created_at" header="Tanggal">
          <template #body="slotProps">
            {{ formatDate(slotProps.data.created_at) }}
          </template>
        </Column>
        <Column field="act" header="">
          <template #body="slotProps">            
            <div class="flex justify-end item-center gap-1">
              <Button severity="secondary" variant="text" class="!px-1" @click="openDialog(slotProps.data,'preview')">
                <Icon name="lucide-eye"/>
              </Button>
              <Button variant="text"  class="!px-1" @click="openDialog(slotProps.data,'edit')">
                <Icon name="lucide-pen"/>
              </Button>
              <Button severity="danger" variant="text" class="!px-1" @click="confirmDelete(slotProps.data.id)">
                <Icon name="lucide-trash-2"/>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

      <div class="flex flex-col md:flex-row md:justify-between items-center">
        <div class="text-sm text-slate-400">
          {{ data.to }} / {{ data.total }}
          <span v-if="status == 'pending'">Loading..</span>
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

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Master Tagihan" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <TagihanMasterPreview v-if="actionDialog == 'preview'" :data="selectedItem" @edit="openDialog(selectedItem,'edit')"/>
    <TagihanForm v-else :action="actionDialog" :data="selectedItem" @update="refresh"/>
  </Dialog>

  <Drawer v-model:visible="visibleFilter" header="Filter" position="right">
    <TagihanFormFilters @submit="onSubmitFilters" :params="filters"/>
  </Drawer>

</template>


<script setup lang="ts">
definePageMeta({
    title: 'Master Tagihan',
})
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const route = useRoute();
const router = useRouter()
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
  page: route.query.page, 
  count : 20,
  dates: '',
  date_start: '',
  date_end:'',
  status: '',
  user_id: ''
} as any)

const { data, status, error, refresh } = await useAsyncData(
    'tagihanmaster-page-'+page.value,
    () => client('/api/tagihanmaster',{
      params : {
        page: page.value,
        count : filters.value.count,
        date_start : filters.value.date_start,
        date_end : filters.value.date_end,
        status: filters.value.status,
        user_id: filters.value.user_id
      }
    })
)

const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    // navigateTo('/tagihan?page='+page.value)
    router.push({
      path: '/tagihan',
      query: {
        page: page.value,
      }
    })
};

watch(() => [filters.value.dates], () => {
  if(filters.value.dates) {
    if(filters.value.dates && filters.value.dates[0]){
      const utcDate = dayjs(filters.value.dates[0]).utc().local().format('YYYY-MM-DD')
      filters.value.date_start = utcDate
    }
    if(filters.value.dates && filters.value.dates[1]){
      const utcDate = dayjs(filters.value.dates[1]).utc().local().format('YYYY-MM-DD')
      filters.value.date_end = utcDate
    }
  } else {
    filters.value.date_start = ''
    filters.value.date_end = ''
  }
})
watch(
    () => [page.value,filters,filters.value.dates],
    () => {
        refresh();
    },
    { deep: true } // Untuk memantau perubahan dalam objek
);
const openDialog = (itemData: any,action : string) => {
  visibleDialog.value = true;
  actionDialog.value = action;
  selectedItem.value = itemData;
}


function onSubmitFilters( data: any) {
  visibleFilter.value = false
  filters.value = data
  filters.value.page = page.value
  filters.value.status = data.status
  filters.value.user_id = data.user_id
  refresh()
}


const confirmDelete = (id: any) => {
    confirm.require({
        message: 'Menghapus tagihan master akan menghapus seluruh tagihan terkait!',
        header: 'Hapus Tagihan',
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
              await client('/api/tagihanmaster/'+id, { method: 'DELETE' }) 
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
