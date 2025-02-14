<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Kelas Siswa
    </div>

    <div class="text-end">
      <Button @click="openDialog('','add')" size="small">
        <Icon name="lucide:plus" mode="svg"/> Tambah
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

    </DataTable>

  </SiswaLayoutEdit>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Tambah Kelas" :style="{ width: '40rem' }">
    <SiswaFormKelas :idSiswa="idUnit" :action="actionDialog" @submit="refreshKelas()"/>
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();

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

</script>