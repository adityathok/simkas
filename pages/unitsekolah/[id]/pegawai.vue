<template>  
  <UnitSekolahLayout>
    
    <div class="flex justify-end">
        <Button @click="openDialog('','add')" size="small">
          Tambah Pegawai
        </Button>
    </div>

    <DataTable v-if="data.data" :value="data.data"  class="text-sm" stripedRows scrollable>
      <Column field="nama" header="Nama"></Column>
      <Column field="jabatan" header="Jabatan"></Column>
      <Column field="action" header="">        
        <template #body="slotProps">             
          <div class="flex justify-end gap-1">
              <Button @click="openDialog(slotProps.data,'edit')" type="button" variant="text" severity="secondary" class="px-1!">
                  <Icon name="lucide:pen" />
              </Button>
              <Button @click="confirmDelete(slotProps.data.id)" type="button" variant="text" severity="danger"  class="px-1!">
                  <Icon name="lucide:trash" />
              </Button>
          </div>
        </template>
      </Column>
    </DataTable>

  </UnitSekolahLayout>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Jabatan Pegawai" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <!-- <UnitSekolahFormEdit v-if="actionDialog === 'edit'" :data="selectedItem" /> -->
    <!-- <UnitSekolahView v-else :data="selectedItem" /> -->
     <UnitSekolahJabatanEdit v-if="actionDialog === 'edit'" :data="selectedItem" @edit="refresh()"/>
     <UnitSekolahJabatanAdd v-else :idunit="idUnit" @add="refresh()"/>
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Pegawai di Unit Sekolah',
})
const route = useRoute()
const idUnit = route.params.id
const toast = useToast();
const confirm = useConfirm();
const client = useSanctumClient();
const isLoading = ref(false) 
const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({});

const { data, status, error, refresh } = await useAsyncData(
    'unitsekolahpegawai-'+idUnit,
    () => client('/api/unitsekolahpegawai/',{
        params: {
          unit_sekolah_id: idUnit
        }
    })
)

const openDialog = (itemData: any,action : string) => {
    visibleDialog.value = true;
    actionDialog.value = action;
    selectedItem.value = itemData;
}

const handleEditSubmit = async () => {
    isLoading.value = true;
}

const confirmDelete = (id: string) => {
    confirm.require({
        message: 'Yakin untuk menghapus jabatan dari pegawai ?',
        header: 'Hapus Jabatan',
        icon: 'pi pi-info-circle',
        rejectLabel: 'Cancel',
        rejectProps: {
            label: 'Cancel',
            severity: 'secondary',
            outlined: true
        },
        acceptProps: {
            label: 'Delete',
            severity: 'danger'
        },
        accept: async () => {
            await client('/api/unitsekolahpegawai/'+id, { method: 'DELETE' })   
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
        },
    });
};

</script>

