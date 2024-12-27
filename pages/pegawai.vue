<template>

    <PageHeader>
        <template #title>
            Pegawai
        </template>

        <template #subtitle>
            Semua pegawai yang terdaftar
        </template>
    </PageHeader>

    <Button @click="addPegawai" label="Tambah Pegawai" class="mb-3" />
  
    <div class="rounded-md border overflow-hidden text-nowrap">
      <DataTable :value="data.data" size="small" stripedRows scrollable tableStyle="min-width: 50rem">

        <Column field="foto" header="">            
            <template #body="slotProps">
                
                <!-- <Avatar v-if="slotProps.data.foto" :image="urlStorage+slotProps.data.foto" shape="circle" /> -->
                <img v-if="slotProps.data.foto" :src="urlStorage+slotProps.data.foto" alt="" class="rounded-full aspect-square object-cover" width="32" height="32">
                <Avatar v-else :label="firstName(slotProps.data.nama)" shape="circle" />

            </template>
        </Column>
        <Column field="nama" header="Nama">            
            <template #body="slotProps">
                <div class="font-bold truncate" style="width: 100%">
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
        <Column :exportable="false"  header="">
            <template #body="slotProps">                
                <div class="flex justify-end">
                    <Button outlined rounded size="small" class="mr-2 !px-3 !py-0" @click="editPegawai(slotProps.data)" >
                        <Icon name="lucide:pencil" mode="svg"/>
                    </Button>
                    <Button outlined rounded severity="danger" class="!px-3 !py-3" @click="confirmDelete(slotProps.data.id)">
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
                    Tampil {{ data.from }} sampai {{ data.to }} dari {{ data.total }}
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

            <PegawaiForm v-if='selectTab == "Profil"' :idpegawai="idpegawai" @update="pegawaiDialog = false; refresh()"/>

        </template>
    </Dialog>
    <Toast />
    <ConfirmDialog></ConfirmDialog>

</template>

<script setup lang="ts">
  const pegawaiDialog = ref(false);
  const { urlStorage } = useGlobalStore()
  const confirm = useConfirm();
  const toast = useToast();
  const idpegawai = ref({});
  const route = useRoute();
  const page = ref(route.query.page ? Number(route.query.page) : 1);

  const firstName = (name: string) => {
        return Array.from(name)[0];
    }

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

    const addPegawai = () => {
        pegawaiDialog.value = true;
        refresh
    };

    /**
     * Confirm delete a pegawai
     * @param {string} id
     */
    const confirmDelete = (id: string) => {
        confirm.require({
            message: 'Yakin untuk menghapus pegawai ini ?',
            header: 'Hapus User',
            icon: 'pi pi-info-circle',
            rejectLabel: 'Cancel',
            rejectProps: {
                label: 'Cancel',
                severity: 'secondary',
                outlined: true
            },
            acceptProps: {
                label: 'Delete',
                severity: 'danger'
            },
            accept: async () => {
                await client('/api/pegawai/'+id, { method: 'DELETE' })   
                refresh()
                toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Berhasil dihapus', life: 3000 });
            },
        });
    };

</script>

<style scoped>
    .p-avatar img {
        object-fit: cover;
    }
</style>
