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
        
        <DataTable :value="data.data"  class="text-sm" stripedRows scrollable>
          <Column field="nama" header="Nama">            
            <template #body="slotProps">  
              <span @click="openDialog(slotProps.data,'edit')" class="cursor-pointer">
                {{ slotProps.data.nama }}
              </span>
            </template>
          </Column>
          <Column field="neraca" header="Neraca">
            <template #body="slotProps">
              <Icon name="lucide-circle-check" v-if="slotProps.data.neraca" size="1.15em" class="mx-auto font-bold text-green-600" v-tooltip="'Ya'"/>
              <Icon name="lucide-circle-x" v-else size="1.15em" class="font-bold opacity-50"/>
            </template>
          </Column>
          <Column field="jurnal_khusus" header="Jurnal Khusus">
            <template #body="slotProps">            
              <Icon name="lucide-circle-check" v-if="slotProps.data.jurnal_khusus" size="1.15em" class="mx-auto font-bold text-green-600" v-tooltip="'Ya'"/>
              <Icon name="lucide-circle-x" v-else size="1.15em" class="font-bold opacity-50"/>
            </template>
          </Column>
          <Column field="likuiditas" header="Likuiditas">
            <template #body="slotProps">            
              <Icon name="lucide-circle-check" v-if="slotProps.data.likuiditas" size="1.15em" class="mx-auto font-bold text-green-600" v-tooltip="'Ya'"/>
              <Icon name="lucide-circle-x" v-else size="1.15em" class="font-bold opacity-50"/>
            </template>
          </Column>
          <Column field="act" header="">
            <template #body="slotProps">            
              <div class="flex justify-end items-center gap-1">
                <Button severity="secondary" variant="text" @click="openDialog(slotProps.data,'edit')" class="!px-1" v-tooltip="'edit'">
                  <Icon name="lucide-pen" />
                </Button>
                <Button severity="danger" variant="text" @click="confirmDelete(slotProps.data.id)" class="!px-1" v-tooltip="'hapus'">                
                  <Icon name="lucide-trash-2" />
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

  </div>

  <Dialog v-model:visible="visibleDialog" :modal="true" :header="actionDialog === 'edit' ? 'Edit Jurnal' : 'Tambah Jurnal'" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <JurnalKasForm :action="actionDialog" :data="selectedItem" @update="refresh()" />
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Jurnal Kas',
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
    'jurnalkas-page-'+page.value,
    () => client('/api/jurnalkas?page='+page.value)
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/jurnalkas?page='+page.value)
};

const badge = (value: any) => {
  if(value) {
    return '<Badge label="Ya"/>'
  } else {
    return value ? '<Badge label="Ya"/>' : 'Tidak'
  }
}

const openDialog = (itemData: any,action : string) => {
  visibleDialog.value = true;
  actionDialog.value = action;
  selectedItem.value = itemData;
}

const confirmDelete = (id: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus jurnal kas ?',
        header: 'Hapus Jurnal',
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
              await client('/api/jurnalkas/'+id, { method: 'DELETE' }) 
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

