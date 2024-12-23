<script setup lang="ts">
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const client = useSanctumClient();
  const { data, status, error, refresh } = await useAsyncData(
      'pegawai',
      () => client('/api/pegawai/?page='+page.value)
  )

  const onPaginate = (event: { page: number }) => {
        page.value = event.page + 1; 
        refresh()
        navigateTo('/users?page='+page.value)
  };
</script>

<template>

    <PageHeader>
        <template #title>
            Pegawai
        </template>

        <template #subtitle>
            Semua pegawai yang terdaftar
        </template>
    </PageHeader>
  
    <div class="rounded-md border overflow-hidden">
      <DataTable :value="data.data" stripedRows scrollable scrollHeight="calc(100dvh - 200px)" tableStyle="min-width: 50rem">

        <Column field="nip" header="NIP"></Column>
        <Column field="nama" header="Nama"></Column>
        <Column field="email" header="Email"></Column>

      </DataTable>
      <Paginator
                :rows="data.per_page"
                :totalRecords="data.total"
                @page="onPaginate"
                :pt="{
                    root: (event) => {
                        const itemForPage =  data.per_page;
                        const currentPage =  page - 1;
                        event.state.d_first = itemForPage * currentPage;
                    },
                }"
            >
            </Paginator>
    </div>

</template>

<style scoped></style>
