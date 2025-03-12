<template>
  <SiswaLayoutEdit>

    <div class="text-end mb-3">
      <Button @click="openDialog('add','')" size="small">
        <Icon name="lucide:plus" /> Tambah
      </Button>
    </div>

    <DataTable :value="data"  class="text-sm" stripedRows scrollable>
        <Column field="nama" header="Nama">
          <template #body="slotProps">
            <div class="cursor-pointer hover:underline" @click="openDialog('view',slotProps.data)">
              {{ slotProps.data.nama }}
            </div>
          </template>
        </Column>
        <Column field="hubungan" header="Hubungan" />
        <Column field="pekerjaan" header="Pekerjaan" />
        <Column field="telepon" header="Telepon" />
        <Column field="alamat" header="Alamat" />
        <Column field="act" header="" >
          <template #body="slotProps">
            <div class="flex justify-end items-center gap-1">

              <Button severity="info" variant="text" class="!px-1" @click="openDialog('edit',slotProps.data)">
                <Icon name="lucide:square-pen" />
              </Button>
              <Button severity="danger" variant="text" class="!px-1" @click="confirmDelete(slotProps.data.id)">
                <Icon name="lucide:trash" />
              </Button>

            </div>
          </template>
        </Column>
    </DataTable>

  </SiswaLayoutEdit>

  <Dialog 
    v-model:visible="visibleDialog" 
    :modal="true"
    :header="actionDialog === 'edit' ? 'Edit Wali' : actionDialog === 'add' ? 'Tambah Wali' : 'Profil Wali Siswa'"
    :style="{ width: '40rem' }"
  >
    <SiswaWaliForm v-if="actionDialog=='add' || actionDialog=='edit'" :action="actionDialog" :idSiswa="idSiswa" :data="dataWali" @submit="refresh"/>
    <SiswaWaliView v-else :data="dataWali" @edit="openDialog('edit',dataWali)" />
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Wali Siswa',
})
const client = useSanctumClient();
const toast = useToast();
const route = useRoute()
const idSiswa = route.params.id

const { data, status, error, refresh } = await useAsyncData(
  'siswawali-'+idSiswa,
  () => client('/api/siswawali',{
    params: {
      siswa_id: idSiswa
    }
  })
)

const visibleDialog = ref(false);
const actionDialog = ref('add');
const dataWali = ref('' as any);
const openDialog = (action:any,data:any) => {
    visibleDialog.value = true
    actionDialog.value = action
    dataWali.value = data
}

const confirm = useConfirm();
const confirmDelete = (data_id: any) => {
    confirm.require({
        message: 'Yakin untuk menghapus wali dari siswa ?',
        header: 'Hapus Wali',
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
            await client('/api/siswawali/'+data_id, { method: 'DELETE' })   
            refresh()
            toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
        },
    });
};
</script>
