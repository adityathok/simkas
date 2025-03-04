<template>
  <UnitSekolahLayout>

    <div class="flex justify-end items-center">
      <Button @click="openDialog('','add')" size="small">
        <Icon name="lucide:circle-plus" mode="svg"/>
        Tambah
      </Button>
    </div>
    
    <DataTable :value="data.data"  class="text-sm" stripedRows scrollable>
      <Column field="nama" header="Kelas">        
        <template #body="slotProps">
          <NuxtLink :to="'/kelas/'+slotProps.data.id" target="_blank" class="cursor-pointer hover:underline">
            {{ slotProps.data.nama }}
          </NuxtLink>
        </template>
      </Column>
      <Column field="tahun_ajaran" header="Tahun" />
      <Column field="tingkat" header="Tingkat" />
      <Column field="wali_id" header="Wali">
        <template #body="slotProps">
          <NuxtLink :to="'/pegawai/'+slotProps.data.wali.pegawai.id" target="_blank" class="cursor-pointer hover:underline">
            {{ slotProps.data.wali?.pegawai.nama }}
          </NuxtLink>
        </template>
      </Column>
      <Column field="act" header="">
        <template #body="slotProps">
          <div class="flex justify-end items-center">
            <Button severity="secondary" variant="text" @click="$router.push('/kelas/'+slotProps.data.id)" class="!px-1" v-tooltip="'Edit'">
              <Icon name="lucide:square-pen" mode="svg"/>
            </Button>
            <Button severity="danger" variant="text" @click="confirmDelete(slotProps.data.id)" class="!px-1" v-tooltip="'Hapus'">
                <Icon name="lucide:trash" mode="svg"/>
            </Button>
          </div>
        </template>
      </Column>
    </DataTable>

  </UnitSekolahLayout>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Tambah Kelas" :style="{ width: '40rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <KelasFormCreate @add="refresh()" :idunit="idUnit" />
  </Dialog>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Kelas Unit Sekolah',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const toast = useToast();
const confirm = useConfirm();
const isLoading = ref(false)
const errors = ref({} as any)

const { data, status, error, refresh } = await useAsyncData(
    'unitsekolahkelas-'+idUnit,
    () => client('/api/unitsekolahkelas/'+idUnit)
)

const confirmDelete = (id : any) => {
      confirm.require({
          message: 'Yakin untuk menghapus kelas ini ?',
          header: 'Hapus Kelas',
          rejectLabel: 'Cancel',
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
              await client('/api/kelas/'+id, { method: 'DELETE' })   
              refresh()
              toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
          },
      });
  };

  const visibleDialog = ref(false);
  const openDialog = (itemData: any,action : string) => {
      visibleDialog.value = true;
  }

</script>
