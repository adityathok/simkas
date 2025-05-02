<template>

  <div class="flex justify-end mb-5">
      <Button @click="openDialog('','add')" size="small">
          <Icon name="lucide:circle-plus" />
          Tambah
      </Button>
  </div>

  <Card>
    <template #content>

      <DataTable :value="data.data"  class="text-sm" stripedRows scrollable>

        <Column field="nama" header="Nama">
          <template #body="slotProps">
            <span @click="openDialog(slotProps.data,'view')" class="cursor-pointer">
              {{ slotProps.data.nama }}
            </span>
          </template>
        </Column>
        <Column field="jenjang" header="Jenjang" class="hidden lg:table-cell"></Column>
        <Column field="telepon" header="Telepon" class="hidden lg:table-cell"></Column>
        <Column field="whatsapp" header="Whatsapp"  class="hidden sm:table-cell"></Column>
        <Column field="email" header="Email" class="hidden xl:table-cell"></Column>
        <Column field="option">
            <template #body="slotProps">                           
              <div class="flex justify-end items-center gap-1"> 
                  <Button as="router-link" :to="'/unitsekolah/'+slotProps.data.id" variant="text" size="small" class="!px-1">
                    <Icon name="lucide:eye" />
                  </Button> 
                  <Button as="router-link" :to="'/unitsekolah/'+slotProps.data.id+'/edit'" severity="secondary" variant="text" size="small" class="!px-1">
                    <Icon name="lucide:pencil" />
                  </Button>                
                  <!-- <Button @click="openDialog(slotProps.data,'view')" severity="danger" variant="text" size="small" class="!px-1">
                    <Icon name="lucide:trash-2" />
                  </Button>    -->
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
                Tampil {{ data.from }} sampai {{ data.to }} dari {{ data.total }}
              </span>

          </div>
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
      </div>

    </template>
  </Card>

  <Dialog v-model:visible="visibleDialog" :modal="true" :header="actionDialog === 'edit' ? 'Edit Unit Sekolah' : 'Tambah Unit Sekolah'" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <UnitSekolahFormEdit v-if="actionDialog === 'edit'" :data="selectedItem" />
    <UnitSekolahView v-else-if="actionDialog === 'view'" :data="selectedItem" />
    <UnitSekolahFormAdd v-else />
  </Dialog>

</template>

<script lang="ts" setup>
  definePageMeta({
      title: 'Unit Sekolah',
  })
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const client = useSanctumClient();
  const { data, status, error, refresh } = await useAsyncData(
      'unitsekolah-page-'+page.value,
      () => client('/api/unitsekolah?page='+page.value)
  )

  const onPaginate = (event: { page: number }) => {
      page.value = event.page + 1; 
      refresh()
      navigateTo('/unitsekolah?page='+page.value)
  };

  const visibleDialog = ref(false);
  const actionDialog = ref('add');
  const selectedItem = ref({} as any);

  const openDialog = (itemData: any,action : string) => {
      visibleDialog.value = true;
      actionDialog.value = action;
      selectedItem.value = itemData;
  }

</script>
