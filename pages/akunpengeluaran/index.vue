<template>

  <div class="flex justify-end items-center mb-3">
    <span v-if="status==='pending'" class="opacity-50">
      Loading...
    </span>
    <Button size="small" @click="openDialog('','add')">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
    </Button>
  </div>

  <Card>
    <template #content>

      <DataTable v-if="data.data" :value="data.data"  class="text-sm text-nowrap" stripedRows scrollable>
        <Column field="nama" header="Nama">      
          <template #body="slotProps">   
            <button type="button" class="cursor-pointer hover:underline" @click="openDialog(slotProps.data,'edit')">
              {{ slotProps.data.nama }}
            </button>   
          </template>
        </Column>
        <Column field="pendapatan" header="Sumber Pendapatan">        
          <template #body="slotProps">            
            <span v-if="slotProps.data.akunpendapatan">
              {{ slotProps.data.akunpendapatan.nama }}
            </span>
          </template>
        </Column>
        <Column field="id" header="Kode" />  
        <Column field="act" header="">
          <template #body="slotProps">            
            <div class="flex">
              <Button severity="info" variant="text"  class="!px-2" @click="openDialog(slotProps.data,'edit')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
              </Button>
              <Button severity="danger" variant="text" class="!px-2" @click="confirmDelete(slotProps.data.id)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>              </Button>
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

  <Dialog v-model:visible="visibleDialog" :modal="true" :header="actionDialog === 'edit' ? 'Edit Akun Biaya' : 'Tambah Akun Biaya'" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <AkunPengeluaranForm :action="actionDialog" :data="selectedItem" @update="refresh()" />
  </Dialog>

</template>


<script setup lang="ts">
definePageMeta({
    title: 'Akun Biaya',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();
const confirm = useConfirm();
const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);
const toast = useToast();

const { data, status, error, refresh } = await useAsyncData(
    'akunpengeluaran-page-'+page.value,
    () => client('/api/akunpengeluaran?page='+page.value)
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/akunpengeluaran?page='+page.value)
};

const badge = (value: any) => {
  return value ? 'Ya' : 'Tidak'
}

const openDialog = (itemData: any,action : string) => {
  visibleDialog.value = true;
  actionDialog.value = action;
  selectedItem.value = itemData;
}

const confirmDelete = (id: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus akun biaya ?',
        header: 'Hapus Biaya',
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
              await client('/api/akunpengeluaran/'+id, { method: 'DELETE' }) 
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

