<template>
  <UnitSekolahLayout>

    <div class="md:max-w-150">
      <div class="flex justify-end items-center gap-2">
        <span v-if="status == 'pending'">
          <Icon name="lucide:loader"  class="animate-spin"/>
        </span>
        <Select v-model="filterTahun" :options="optionTahunAjaran" optionLabel="label" optionValue="value"/>
        <Button @click="openDialog('','add')" size="small">
          <Icon name="lucide:circle-plus" />
          Tambah
        </Button>
      </div>
      
      <DataTable v-if="data.data.length > 0" :value="data.data"  class="text-sm" stripedRows scrollable>
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
              <Button severity="secondary" variant="text" @click="$router.push('/kelas/'+slotProps.data.id)" class="px-1!" v-tooltip="'Edit'">
                <Icon name="lucide:pen" />
              </Button>
              <Button severity="danger" variant="text" @click="confirmDelete(slotProps.data.id)" class="px-1!" v-tooltip="'Hapus'">
                  <Icon name="lucide:trash-2" />
              </Button>
            </div>
          </template>
        </Column>
      </DataTable>

      <Message v-else severity="warn">Tidak ada data..</Message>

    </div>

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

const filterTahun = ref('')
  const { data:optionTahunAjaran } = await useAsyncData(
      'option-tahun_ajaran',
      () => client('/api/option/tahun_ajaran')
  )
  //jika optionTahunAjaran sudah dapat
  onMounted(() => {
    filterTahun.value = optionTahunAjaran.value.find((item: { active: number; }) => item.active === 1)?.value || '';
  })

  //watch filterTahun
  watch(() => filterTahun.value, () => {
    refresh()
  })

const { data, status, error, refresh } = await useAsyncData(
    'unitsekolahkelas-'+idUnit,
    () => client('/api/unitsekolahkelas/'+idUnit,
    {
      params:{
        tahun_ajaran: filterTahun.value
      }
    })
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
