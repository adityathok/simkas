<template>
  <Card>
    <template #title>
      <div class="flex items-center gap-2">
        <Icon name="lucide:users" mode="svg"/> Wali Siswa
      </div>
    </template>
    <template #content>
      <DataTable :value="data"  class="text-sm" stripedRows scrollable>        
        <Column field="nama" header="Nama">
          <template #body="slotProps">
            <div class="cursor-pointer hover:underline" @click="openDialog(slotProps.data)">
              {{ slotProps.data.nama }}
            </div>
          </template>
        </Column>
        <Column field="hubungan" header="Hubungan" />
        <Column field="pekerjaan" header="Pekerjaan" />
        <Column field="telepon" header="Telepon" />
      </DataTable>
    </template>
  </Card>

  <Dialog 
    v-model:visible="visibleDialog" 
    :modal="true"
    header="Profil Wali Siswa"
    :style="{ width: '40rem' }"
  >
  <SiswaWaliView :data="dataWali" @edit="navigateTo('/siswa/'+idSiswa+'/edit/wali')" />
</Dialog>

</template>

<script setup lang="ts">
const client = useSanctumClient();
const props = defineProps(['id'])
const idSiswa = props.id

const { data, status, error, refresh } = await useAsyncData(
  'siswawali-'+idSiswa,
  () => client('/api/siswawali',{
    params: {
      siswa_id: idSiswa
    }
  })
)

const visibleDialog = ref(false);
const dataWali = ref('' as any);
const openDialog = (data:any) => {
    visibleDialog.value = true
    dataWali.value = data
}
</script>
