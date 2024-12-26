<template>

    <PageHeader>
        <template #title>
            Pegawai
        </template>

        <template #subtitle>
            Semua pegawai yang terdaftar
        </template>
    </PageHeader>
  
    <div class="rounded-md border overflow-hidden text-nowrap">
      <DataTable :value="data.data" stripedRows scrollable scrollHeight="calc(100dvh - 240px)" tableStyle="min-width: 50rem">

        <Column field="nama" header="Nama">            
            <template #body="slotProps">
                <div class="font-bold truncate" style="width: 200px">
                    {{ slotProps.data.nama }}
                </div>
            </template>
        </Column>
        <Column field="nip" header="NIP"></Column>
        <Column field="email" header="Email">                       
            <template #body="slotProps">
                <div class="truncate" style="width: 200px">
                    {{ slotProps.data.email }}
                </div>
            </template>
        </Column>
        <Column field="jenis_kelamin" header="JK"></Column>
        <Column field="status" header="Status"></Column>
        <Column field="tanggal_masuk" header="Masuk" class="hidden 2xl:table-cell"></Column>
        <Column field="tanggal_lahir" header="Lahir" class="hidden 2xl:table-cell"></Column>
        <Column :exportable="false"  header="Aksi">
            <template #body="slotProps">                
                <div class="flex justify-end">
                    <Button outlined rounded size="small" class="mr-2 !px-3 !py-0" @click="editPegawai(slotProps.data)" >
                        <Icon name="lucide:pencil" mode="svg"/>
                    </Button>
                    <Button outlined rounded severity="danger" class="!px-3 !py-3" >
                        <Icon name="lucide:trash" mode="svg"/>
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
        <template v-if='pegawaiDialog'>
            <div class="mb-5">
                <SelectButton v-model="selectTab" :options="optionsTab" />
            </div>
            <PegawaiForm v-if='selectTab == "Profil"' :idpegawai="idpegawai"/>
        </template>
    </Dialog>

</template>

<script setup lang="ts">
  const pegawaiDialog = ref(false);
  const idpegawai = ref({});
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);

  const selectTab = ref('Profil');
  const optionsTab = ref(['Profil', 'Foto']);

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

const editPegawai = (datapegawai:any) => {
    idpegawai.value = datapegawai.id;
    pegawaiDialog.value = true;

};
</script>
