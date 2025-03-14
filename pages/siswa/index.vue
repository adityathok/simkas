<template>
    
    <div class="flex justify-end items-center gap-2 mb-5">
      <div v-if="status == 'pending'">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-refresh-ccw animate-spin"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 16h5v5"/></svg>
      </div>
      <Button size="small" @click="visibleFilter = true">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-filter"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg> Filter
      </Button>
      <Button as="router-link" to="/siswa/create" size="small">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user-plus"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/></svg> Tambah
      </Button>
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
          <Column field="ttl" header="TTL" class="hidden lg:table-cell"></Column>
          <Column field="kelas" header="Kelas"></Column>
          <Column field="status" header="Status">
            <template #body="slotProps">
              <SiswaStatusBadge :status="slotProps.data.status"/>
            </template>
          </Column>
          <Column field="jenis_kelamin" header="JK" class="hidden lg:table-cell"></Column>
          <Column field="option">
            <template #body="slotProps">                           
              <div class="flex justify-end relative">
                  <Button type="button" @click="displayPop($event, slotProps.data)" variant="text" severity="secondary" rounded>
                      <Icon name="lucide:ellipsis-vertical" />
                  </Button>
                  <div v-if="popover?.visible" class="absolute end-0 top-0 w-full h-full"></div>
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

    <Popover ref="popover" :dismissable="true">
      <div v-if="selectedItem" class="flex flex-col">  
        <Button @click="openDialog(selectedItem,'view')" severity="secondary" variant="text" size="small" class="w-full! flex! justify-start!">
          <Icon name="lucide:info" /> Preview
        </Button>    
        <Button as="router-link" :to="'/siswa/'+selectedItem.id" severity="secondary" variant="text" size="small" class="w-full! flex! justify-start!">
          <Icon name="lucide:building" /> Profile
        </Button> 
        <Button as="router-link" :to="'/siswa/'+selectedItem.id+'/edit'" severity="secondary" variant="text" size="small" class="w-full! flex! justify-start!">
          <Icon name="lucide:pencil" /> Edit
        </Button>
      </div>
    </Popover>    

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

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Semua Siswa',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const router = useRouter()
const visibleFilter = ref(false)

const filters = computed(() => ({
  page: page.value || 1,
  status: route.query.status || 'aktif',
  tahun_ajaran: route.query.tahun_ajaran || '',
  idunit: route.query.idunit || ''
} as any))

const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'siswa-page-'+route.query,
    () => client('/api/siswa',{
      params:filters.value
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


const handleSubmitFilter = () => {
  router.push({
    path: '/siswa',
    query: {
      page: page.value,
      status: filters.value.status || undefined,
      tahun_ajaran: filters.value.tahun_ajaran || undefined,
      idunit: filters.value.idunit || undefined,
    }
  })
  refresh()
  visibleFilter.value = false
}

const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);
const popover = ref();

const openDialog = (itemData: any,action : string) => {
    popover.value.hide();
    visibleDialog.value = true;
    actionDialog.value = action;
    selectedItem.value = itemData;
}
const displayPop = (event: Event, itemData: any) => {
  popover.value.hide();
  selectedItem.value = itemData;
  popover.value.show(event);
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