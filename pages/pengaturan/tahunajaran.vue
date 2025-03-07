<template>
  
  <PengaturanLayout>
    <template #content>
      
      <div class="text-end mb-4">        
        <Button @click="openDialog('','add')" size="small" class="md:px-2!">
            <Icon name="lucide:circle-plus" mode="svg"/> Tambah
        </Button>
      </div>
      
      <DataTable :value="data" size="small" class="text-sm text-nowrap" stripedRows scrollable>
        <Column field="nama" header="Tahun Ajaran">
          <template #body="slotProps">
            {{ slotProps.data.nama }}
            <Badge v-if="slotProps.data.active" severity="success" class="font-size-10">
              {{ slotProps.data.active ? 'Aktif' : 'Tidak Aktif' }}
            </Badge>
          </template>
        </Column>
        <Column field="mulai" header="Mulai"></Column>
        <Column field="akhir" header="Akhir"></Column>
        <Column field="options" header="">
          <template #body="slotProps">
            <div class="flex justify-end">
              <Button @click="openDialog(slotProps.data,'edit')" severity="secondary" variant="text" class="md:px-2!">
                <Icon name="lucide:pencil" mode="svg"/>
              </Button>
              <Button @click="confirmDelete(slotProps.data.id)" severity="danger" variant="text" class="md:px-2!">
                <Icon name="lucide:trash" mode="svg"/>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

    </template>
    </PengaturanLayout>

    <Dialog v-model:visible="visibleDialog" :modal="true" :header="actionDialog === 'edit' ? 'Edit Tahun Ajaran' : 'Tambah Tahun Ajaran'" :style="{ width: '30rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <TahunAjaranFormEdit v-if="actionDialog === 'edit'" :data="selectedItem" @update="refresh()" />
      <TahunAjaranFormEdit v-else @update="refresh()" />
    </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Pengaturan',
    caption: 'Tahun Ajaran',
})
const toast = useToast();
const client = useSanctumClient();
const isLoading = ref(false)
const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);

const { data, status, error, refresh } = await useAsyncData(
    'tahun-ajaran',
    () => client('/api/tahunajaran')
)


const openDialog = (itemData: any,action : string) => {
  visibleDialog.value = true;
  actionDialog.value = action;
  selectedItem.value = itemData;
}

const confirm = useConfirm();
const confirmDelete = (id : any) => {
      confirm.require({
          message: 'Yakin untuk menghapus ini ?',
          header: 'Hapus Tahun Ajaran',
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
              await client('/api/tahunajaran/'+id, { method: 'DELETE' })   
              refresh()
              toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
          },
      });
  };

</script>
