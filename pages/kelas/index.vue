<template>

  <div class="flex justify-end mb-5">
      <Button @click="openDialog('','add')" size="small">
          <Icon name="lucide:circle-plus" mode="svg"/>
          Tambah
      </Button>
  </div>

  
  <Card>
    <template #content>

      <DataTable :value="data.data"  class="text-sm" stripedRows scrollable>

        <Column field="nama" header="Nama">
          <template #body="slotProps">
            <NuxtLink :to="'/unitsekolah/'+slotProps.data.id" class="cursor-pointer">
              {{ slotProps.data.nama }}
            </NuxtLink>
          </template>
        </Column>
        <Column field="tingkat" header="Tingkat" class="hidden sm:table-cell"></Column>
        <Column field="tahun_ajaran" header="Tahun" class="hidden sm:table-cell">
          <template #body="slotProps">
              {{ slotProps.data.tahun_ajaran }}
          </template>
        </Column>
        <Column field="unit_sekolah" header="Unit"  class="hidden sm:table-cell">
          <template #body="slotProps">
              {{ slotProps.data.unit_sekolah?.nama }}
          </template>
        </Column>
        <Column field="wali_id" header="Wali Kelas" class="hidden xl:table-cell"></Column>
        <Column field="option">
            <template #body="slotProps">                           
              <div class="flex justify-end">
                  <Button type="button" @click="displayPop($event, slotProps.data)" variant="text" severity="secondary" rounded>
                      <Icon name="lucide:ellipsis-vertical" mode="svg"/>
                  </Button>
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

</template>

<script setup lang="ts">
  definePageMeta({
      title: 'Kelas',
  })
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);
  const client = useSanctumClient();
  const { data, status, error, refresh } = await useAsyncData(
      'kelas-page-'+page.value,
      () => client('/api/kelas?page='+page.value)
  )
  
  const onPaginate = (event: { page: number }) => {
      page.value = event.page + 1; 
      refresh()
      navigateTo('/kelas?page='+page.value)
  };

  const visibleDialog = ref(false);
  const actionDialog = ref('add');
  const selectedItem = ref({} as any);
  const popover = ref();

  const openDialog = (itemData: any,action : string) => {
      popover.value.hide();
      visibleDialog.value = true;
      actionDialog.value = action;
      selectedItem.value = itemData;
  }
  const displayPop = (event: Event, itemData: any) => {
    popover.value.hide();
    selectedItem.value = itemData;
    popover.value.show(event);
  }
</script>
