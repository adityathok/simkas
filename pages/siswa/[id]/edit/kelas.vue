<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Kelas Siswa
    </div>

    <div class="text-end">
      <Button @click="openDialog('','add')" size="small">
        <Icon name="lucide:plus" /> Tambah
      </Button>
    </div>

    <DataTable :value="dataKelas"  class="text-sm" stripedRows scrollable>
      
      <Column field="nama" header="Kelas" />
      <Column field="tahun_ajaran" header="Tahun" />
      <Column field="unit_sekolah" header="Unit" />
      <Column field="active" header="Status">
        <template #body="slotProps">
          <Badge v-if="slotProps.data.active" severity="success">Active</Badge>
          <Badge v-else severity="secondary">Riwayat</Badge>
        </template>
      </Column>
      <Column field="act" header="">
        <template #body="slotProps">
          <div class="flex justify-end items-center gap-1">
            <Button severity="info" @click="openDialog(slotProps.data,'edit')">
              <Icon name="lucide:square-pen" />
            </Button>
            <Button severity="danger" @click="confirmDelete(slotProps.data)">
              <Icon name="lucide:trash" />
            </Button>

          </div>
        </template>
      </Column>

    </DataTable>

  </SiswaLayoutEdit>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Tambah Kelas" :style="{ width: '40rem' }">
    <SiswaFormKelas :idSiswa="idUnit" :action="actionDialog" :data="selectedItem" @submit="refreshKelas()"/>
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const toast = useToast();
const confirm = useConfirm();

const { data: dataKelas, status: statusKelas, error: errorKelas, refresh: refreshKelas } = await useAsyncData(
  'siswakelas-'+idUnit,
  () => client('/api/siswakelas?id_siswa='+idUnit)
)

const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);

const openDialog = (itemData: any,action : string) => {
    visibleDialog.value = true;
    actionDialog.value = action;
    selectedItem.value = itemData;
}

const confirmDelete = (data: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus kelas dari siswa ?',
        header: 'Hapus Kelas',
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
            await client('/api/siswakelas/'+data.kelas_id+'?siswa='+idUnit, { method: 'DELETE' })   
            refreshKelas()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
        },
    });
};
</script>