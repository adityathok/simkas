<template>

  <Card>
      <template #title>
          Unit Sekolah
      </template>
    <template #content>

      <DataTable :value="data.data" stripedRows scrollable scrollHeight="100dvh" tableStyle="min-width: 50rem">

        <Column field="nama" header="Nama">
          <template #body="slotProps">
            <span @click="dialogUnit(slotProps.data.id)" class="cursor-pointer">
              {{ slotProps.data.nama }}
            </span>
          </template>
        </Column>
        <Column field="jenjang" header="Jenjang" class="hidden md:table-cell"></Column>
        <Column field="kepala_sekolah" header="Kepala Sekolah" class="hidden xl:table-cell"></Column>
        <Column field="telepon" header="Telepon" class="hidden md:table-cell"></Column>
        <Column field="whatsapp" header="Whatsapp"  class="hidden sm:table-cell"></Column>
        <Column field="email" header="Email" class="hidden xl:table-cell"></Column>
        <Column field="option">
            <template #body="slotProps">
                <div class="flex justify-end items-center">
                    <NuxtLink :to="'/unitsekolah/edit?id='+slotProps.data.id" class="!bg-transparent !border-none !text-slate-800" variant="text" size="small">
                      <Icon name="lucide:pencil" />
                    </NuxtLink>
                </div>
            </template>
        </Column>

      </DataTable>

      <div class="mt-2 md:flex md:justify-between md:items-center">
          <div class="opacity-50 text-sm text-right md:text-left mx-3 mb-2 md:mb-0">                
              <span v-if="status === 'pending'" class="opacity-50">
                  Loading....
              </span>
              <span v-else>
                  Tampil {{ data.per_page }} dari {{ data.total }}
              </span>

          </div>
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
  </Card>

  <div class="rounded-md border overflow-hidden">

    


    
  </div>

  <Dialog v-model:visible="visibleDialog" modal header="Header" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
        <p class="mb-8">
        </p>
    </Dialog>

</template>

<script lang="ts" setup>
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const client = useSanctumClient();
  const { data, status, error, refresh } = await useAsyncData(
      'unitsekolah',
      () => client('/api/unitsekolah/?page='+page.value)
  )

  const onPaginate = (event: { page: number }) => {
        page.value = event.page + 1; 
        refresh()
        navigateTo('/unitsekolah?page='+page.value)
  };

  const Unit = ref({});

  const visibleDialog = ref(false);
  const dialogUnit = (id : string) => {
    visibleDialog.value = true;
    client('/api/unitsekolah/'+id)
        .then((res) => {
            Unit.value = res.data
    })
  }


</script>
