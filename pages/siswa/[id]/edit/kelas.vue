<template>
  
  <SiswaLayoutEdit>

    <div class="text-xl font-bold mb-3 md:mb-6">
      Edit Kelas Siswa
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

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Edit Siswa',
})
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const isLoading = ref(false)
const errors = ref({})
const toast = useToast();

const form: Record<any, any> = reactive({} as any)

// Access to the cached value of dataSiswa
const { data } = useNuxtData('siswa-'+idUnit)

const { data: dataKelas, status: statusKelas, error: errorKelas, refresh: refreshKelas } = await useAsyncData(
  'siswakelas-'+idUnit,
  () => client('/api/siswakelas?id_siswa='+idUnit)
)


</script>