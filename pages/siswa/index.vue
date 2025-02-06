<template>
    
    <div class="flex justify-end mb-5">
        <Button as="router-link" to="/pegawai/add" size="small">
            <Icon name="lucide:user-plus" mode="svg"/>
            Tambah
        </Button>
    </div>

    <Card>
      <template #content>
        <DataTable :value="data.data" size="small" class="text-sm" stripedRows scrollable>
          <Column field="nama" header="Nama">
            <template #body="slotProps">
              <NuxtLink :to="'/siswa/'+slotProps.data.id" class="cursor-pointer">
                {{ slotProps.data.nama }}
              </NuxtLink>
            </template>
          </Column>
          <Column field="nis" header="NIS"></Column>
          <Column field="nisn" header="NISN"></Column>
          <Column field="ttl" header="TTL" class="hidden lg:table-cell"></Column>
          <Column field="kelas" header="Kelas"></Column>
          <Column field="jenis_kelamin" header="JK" class="hidden lg:table-cell"></Column>
          <Column field="option">
            <template #body="slotProps">                           
              <div class="flex justify-end">
                  <Button type="button" @click="displayPop($event, slotProps.data)" variant="text" severity="secondary" rounded>
                      <Icon name="lucide:ellipsis-vertical" mode="svg"/>
                  </Button>
              </div>
            </template>
        </Column>
        </DataTable>
      </template>        
    </Card>

    <Popover ref="popover" :dismissable="true">
      <div v-if="selectedItem" class="flex flex-col">  
        <Button @click="openDialog(selectedItem,'view')" severity="secondary" variant="text" size="small" class="!w-full !flex !justify-start">
          <Icon name="lucide:info" mode="svg"/> Preview
        </Button>    
        <Button as="router-link" :to="'/siswa/'+selectedItem.id" severity="secondary" variant="text" size="small" class="!w-full !flex !justify-start">
          <Icon name="lucide:building" mode="svg"/> Profile
        </Button> 
        <Button as="router-link" :to="'/siswa/'+selectedItem.id+'/edit'" severity="secondary" variant="text" size="small" class="!w-full !flex !justify-start">
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
    navigateTo('/unitsekolah?page='+page.value)
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