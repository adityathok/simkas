<template>
    
    <div class="flex justify-end mb-5">
        <Button as="router-link" to="/siswa/create" size="small">
            <Icon name="lucide:user-plus" mode="svg"/>
            Tambah
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
                      <Icon name="lucide:ellipsis-vertical" mode="svg"/>
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
          <Icon name="lucide:info" mode="svg"/> Preview
        </Button>    
        <Button as="router-link" :to="'/siswa/'+selectedItem.id" severity="secondary" variant="text" size="small" class="w-full! flex! justify-start!">
          <Icon name="lucide:building" mode="svg"/> Profile
        </Button> 
        <Button as="router-link" :to="'/siswa/'+selectedItem.id+'/edit'" severity="secondary" variant="text" size="small" class="w-full! flex! justify-start!">
          <Icon name="lucide:pencil" mode="svg"/> Edit
        </Button>
      </div>
    </Popover>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Semua Siswa',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);

const client = useSanctumClient();
const { data, status, error, refresh } = await useAsyncData(
    'siswa-page-'+page.value,
    () => client('/api/siswa?page='+page.value)
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

</script>