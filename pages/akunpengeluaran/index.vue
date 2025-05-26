<template>

  <div class="max-w-200">

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
                <Button severity="secondary" variant="text" class="!px-2" @click="openDialog(slotProps.data,'edit')" v-tooltip="'edit'">
                  <Icon name="lucide-pen" />
                </Button>
                <Button severity="danger" variant="text" class="!px-2" @click="confirmDelete(slotProps.data.id)" v-tooltip="'hapus'">
                  <Icon name="lucide-trash-2" />
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

  </div>

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

