<template>

  <div class="flex justify-end items-center mb-3">
    <span v-if="status==='pending'" class="opacity-50">
      Loading...
    </span>
    <Button size="small">
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus"><path d="M5 12h14"/><path d="M12 5v14"/></svg> Tambah
    </Button>
  </div>

  <Card>
    <template #content>
      
      <DataTable :value="data.data"  class="text-sm" stripedRows scrollable>
        <Column field="nama" header="Nama"></Column>
        <Column field="neraca" header="Neraca">
          <template #body="slotProps">            
            {{ badge(slotProps.data.neraca) }}
          </template>
        </Column>
        <Column field="jurnal_khusus" header="Jurnal Khusus">
          <template #body="slotProps">            
            {{ badge(slotProps.data.jurnal_khusus) }}
          </template>
        </Column>
        <Column field="likuiditas" header="Likuiditas">
          <template #body="slotProps">            
            {{ badge(slotProps.data.likuiditas) }}
          </template>
        </Column>
        <Column field="act" header="">
          <template #body="slotProps">            
            <div class="flex">
              <Button severity="info" variant="text">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-square-pen"><path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"/></svg>
              </Button>
              <Button severity="danger" variant="text">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-trash-2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/></svg>              </Button>
            </div>
          </template>
        </Column>
      </DataTable>
      <Paginator
            :rows="data.per_page"
            :totalRecords="data.total"
            @page="onPaginate"
            :pt="{
                root: (event: any) => {
                    const itemForPage =  data.per_page;
                    const currentPage =  page - 1;
                    event.state.d_first = itemForPage * currentPage;
                },
            }"
        >
      </Paginator>

    </template>
  </Card>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Jurnal Kas',
})
const route = useRoute();
const page = ref(route.query.page ? Number(route.query.page) : 1);
const client = useSanctumClient();

const { data, status, error, refresh } = await useAsyncData(
    'jurnalkas-page-'+page.value,
    () => client('/api/jurnalkas?page='+page.value)
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
    refresh()
    navigateTo('/kelas?page='+page.value)
};

const badge = (value: any) => {
  return value ? 'Ya' : 'Tidak'
}

</script>

