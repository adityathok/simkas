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
      <DataTable :value="data.data" stripedRows scrollable scrollHeight="calc(100dvh - 240px)" tableStyle="min-width: 50rem">

        <Column field="nama" header="Nama" class="font-bold"></Column>
        <Column field="nip" header="NIP"></Column>
        <Column field="email" header="Email"></Column>
        <Column field="jenis_kelamin" header="JK"></Column>
        <Column field="status" header="Status"></Column>
        <Column field="tanggal_masuk" header="Tgl Masuk"></Column>
        <Column field="tanggal_lahir" header="Tgl Lahir"></Column>
        <Column :exportable="false" header="Aksi" class="flex justify-end">
            <template #body="slotProps">
                <Button outlined rounded class="mr-2 !px-3 !py-3" @click="editPegawai(slotProps.data)" >
                    <Icon name="lucide:pencil" />
                </Button>
                <Button outlined rounded severity="danger" class="!px-3 !py-3" @click="editProduct(slotProps.data)" >
                    <Icon name="lucide:trash" />
                </Button>
            </template>
        </Column>

      </DataTable>
      <div class="mt-2 md:flex md:justify-between md:items-center">
            <div class="opacity-50 text-sm text-right md:text-left mx-3 mb-2 md:mb-0">  
                <span v-if="status === 'pending'" class="opacity-50">
                    Loading....
                </span>
                <span v-else>
                    Tampil {{ data.per_page*page }} dari {{ data.total }}
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
    </div>

    <Dialog v-model:visible="pegawaiDialog" :style="{ width: '800px' }" header="Profil Pegawai" :modal="true">
        <PegawaiForm v-if='pegawaiDialog' :idpegawai="idpegawai" />
    </Dialog>

</template>

<script setup lang="ts">
  const pegawaiDialog = ref(false);
  const idpegawai = ref({});
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
        navigateTo('/pegawai?page='+page.value)
  };

const editPegawai = (datapegawai) => {
    idpegawai.value = datapegawai.id;
    pegawaiDialog.value = true;

};
</script>
