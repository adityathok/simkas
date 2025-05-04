<template>
    
    <div class="flex justify-between items-center gap-2 mb-5">
      <Select v-model="filters.per_page" :options="[25,50,100]" size="small" placeholder="Per Page"/>
      <div class="flex justify-end items-center gap-2">
        <Button size="small" @click="visibleFilter = true">
          <Icon name="lucide:filter" /> Filter
        </Button>
        <Button as="router-link" to="/siswa/create" size="small">
          <Icon name="lucide:user-plus"/> Tambah
        </Button>
      </div>
    </div>

    <Card>
      <template #content>
        <DataTable :value="data.data" size="small" class="text-sm" stripedRows scrollable>
          <Column field="avatar" header="">
            <template #body="slotProps">
              <UserAvatar :url="slotProps.data.avatar_url" :name="slotProps.data.nama" :size="32" class="min-w-[32px]"/>
            </template>
          </Column>
          <Column field="nama" header="Nama">
            <template #body="slotProps">
              <NuxtLink :to="'/siswa/'+slotProps.data.id" class="cursor-pointer">
                {{ slotProps.data.nama }}
              </NuxtLink>
              <div class="text-xs opacity-50 mt-2 md:hidden">
                <div>NIS {{ slotProps.data.nis }}</div>
                <div>NISN {{ slotProps.data.nisn }}</div>
              </div>
            </template>
          </Column>
          <Column field="nis" header="NIS" class="hidden md:table-cell"></Column>
          <Column field="nisn" header="NISN" class="hidden md:table-cell"></Column>
          <Column field="kelas" header="Kelas">
            <template #body="slotProps">
              {{ slotProps.data.kelas_siswa?.nama }}<span class="text-xs"> , {{ slotProps.data.kelas_siswa?.tahun_ajaran }}</span>
            </template>
          </Column>
          <Column field="unit_sekolah" header="Unit">
            <template #body="slotProps">
              {{ slotProps.data.kelas_siswa?.unit_sekolah }}
            </template>
          </Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <SiswaStatusBadge :status="slotProps.data.status"/>
            </template>
          </Column>
          <Column field="jenis_kelamin" header="JK" class="hidden lg:table-cell"></Column>
          <Column field="tanggal_lahir" header="Lahir" class="hidden lg:table-cell"></Column>
          <Column field="option">
            <template #body="slotProps">                           
              <div class="flex justify-end items-center">  
                  <Button @click="openDialog(slotProps.data,'view')" severity="secondary" variant="text" size="small" class="!px-1">
                    <Icon name="lucide:eye" />
                  </Button>    
                  <Button as="router-link" :to="'/siswa/'+slotProps.data.id" severity="secondary" variant="text" size="small" class="!px-1">
                    <Icon name="lucide:circle-user" />
                  </Button> 
                  <Button as="router-link" :to="'/siswa/'+slotProps.data.id+'/edit'" severity="secondary" variant="text" class="!px-1">
                    <Icon name="lucide:pencil" />
                  </Button>
              </div>
            </template>
        </Column>
        </DataTable>
        <div class="mt-2 md:flex md:justify-between md:items-center">
            <div class="opacity-50 text-sm text-right md:text-left mx-3 mb-2 md:mb-0">  
                <span v-if="status === 'pending'" class="opacity-50">
                    Loading....
                </span>
                <span v-else>
                    Tampil {{ data.from }} sampai {{ data.to }} dari {{ data.total }}
                </span>
            </div>
            <Paginator
                :rows="data.per_page"
                :totalRecords="data.total"
                @page="onPaginate"
                :pt="{
                    root: (event) => {
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

    <Drawer v-model:visible="visibleFilter" header="Filter" position="right">
        <form @submit.prevent="handleSubmitFilter">
          <div v-for="field in filterFields" :key="field.key" class="py-2">
            <label :for="field.key" class="block mb-1">{{ field.label }}</label>
            <Select v-if="field.type == 'select'" optionLabel="label" optionValue="value" v-model="filters[field.key]" :options="field.options" placeholder="Pilih" class="w-full capitalize"/>
          </div>
          <div class="text-end mt-2">
            <Button type="submit" class="w-full">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
            </Button>
          </div>
        </form>
    </Drawer>
    
    <Dialog v-model:visible="visibleDialog" :modal="true" header="Profil Siswa" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <SiswaPreview :data="selectedItem"/>
    </Dialog>

    <AppLoader :loading="isRefresh"/>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Semua Siswa',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const router = useRouter()
const visibleFilter = ref(false)

const filters = reactive({
  per_page: route.query.per_page ? Number(route.query.per_page) : 25,
  page: computed(() => page.value),
  status: route.query.status || 'aktif',
  tahun_ajaran: route.query.tahun_ajaran || '',
  idunit: route.query.idunit || '' 
} as any)

// Fungsi untuk mengubah params filters menjadi query URL route
function updateRouteParams() {
  router.push({
    query: { ...filters },
  });
}

const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'siswa-page-'+route.query,
    () => client('/api/siswa',{
      params:filters
    })
)

const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth'
    })
    navigateTo('/siswa?page='+page.value)
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

//watch filters
watch(filters, (newValue) => {
  //watch filters.per_page
  if(newValue.per_page) {
   refresh() 
  }
  updateRouteParams()
})

const handleSubmitFilter = () => {
  updateRouteParams()
  refresh()
  visibleFilter.value = false
}

const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);

const openDialog = (itemData: any,action : string) => {
    visibleDialog.value = true;
    actionDialog.value = action;
    selectedItem.value = itemData;
}

const { data: optionFilter,status:soptionFilter,refresh:frefresh } = await useAsyncData(
    'optionsfiltersiswa',
    () => client('/api/options',{
      params:{
        keys: 'tahun_ajaran,unitsekolah'
      }
    })
)

const filterFields = [
  { label: 'Status', key: 'status', type: 'select', options: [{label:'Aktif',value:'aktif'},{label:'Lulus',value:'lulus'},{label:'Pindah',value:'pindah'},{label:'Keluar',value:'keluar'}] },
  { label: 'Tahun Ajaran', key: 'tahun_ajaran', type: 'select', options: optionFilter.value.tahun_ajaran },
  { label: 'Unit Sekolah', key: 'idunit', type: 'select', options: optionFilter.value.unitsekolah },
]


</script>