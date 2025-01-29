<template>
  
  <PengaturanLayout>
    <template #content>
      
      
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
              <Button severity="secondary" variant="text" class="md:!px-2">
                <Icon name="lucide:pencil" mode="svg"/>
              </Button>
              <Button @click="confirmDelete(slotProps.data.id)" severity="danger" variant="text" class="md:!px-2">
                <Icon name="lucide:trash" mode="svg"/>
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

    </template>
    </PengaturanLayout>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Pengaturan',
    caption: 'Tahun Ajaran',
})
const toast = useToast();
const client = useSanctumClient();
const isLoading = ref(false)

const { data, status, error, refresh } = await useAsyncData(
    'tahun-ajaran',
    () => client('/api/tahunajaran')
)

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
