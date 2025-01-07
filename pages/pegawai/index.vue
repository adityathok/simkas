<template>

    <div class="flex justify-end mb-5">
        <Button as="router-link" to="/pegawai/add" size="small">
            <Icon name="lucide:user-plus" mode="svg"/>
            Tambah
        </Button>
    </div>

  <div class="rounded-md border overflow-hidden text-nowrap bg-white shadow-sm">
    <DataTable :value="data.data" size="small" stripedRows scrollable tableStyle="min-width: 50rem">

      <Column field="foto" header="">            
          <template #body="slotProps">
              
            <span class="cursor-pointer" @click="showPegawai(slotProps.data)">
              <img v-if="slotProps.data.user.avatar" :src="slotProps.data.user.avatar_file.url" alt="" class="rounded-full aspect-square object-cover" width="32" height="32">
              <Avatar v-else :label="firstName(slotProps.data.nama)" shape="circle" />
            </span>

          </template>
      </Column>
      <Column field="nama" header="Nama">            
          <template #body="slotProps">
              <div class="truncate cursor-pointer" style="max-width: 200px" @click="showPegawai(slotProps.data)">
                  {{ slotProps.data.nama }}
              </div>
          </template>
      </Column>
      <Column field="nip" header="NIP"></Column>
      <Column field="email" header="Email">                       
          <template #body="slotProps">
              <div class="truncate" style="max-width: 200px">
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

  <Dialog v-model:visible="pegawaiDialog" :style="{ width: '500px' }" header="Profil Pegawai" :modal="true">
      <template v-if='pegawaiDialog'>
          
        <PegawaiProfil :idpegawai="idpegawai" :data="itemPegawai" />

      </template>
  </Dialog>

    <Popover ref="op" :dismissable="true">
        <div v-if="selectedItem" class="rounded flex flex-col">            
            
            <div class="truncate border-b text-xs pb-2 opacity-50" style="max-width: 100px">
                {{ selectedItem.nama }}  
            </div>       
            
            <Button @click="showPegawai(selectedItem)" severity="secondary" variant="text" size="small" class="w-full !justify-start">
                <Icon name="lucide:eye" mode="svg"/> Lihat
            </Button>
            <Button as="router-link" severity="info" variant="text" size="small" :to="'/pegawai/edit?id='+selectedItem.id" class="w-full !justify-start">
                <Icon name="lucide:pencil" mode="svg"/> Edit
            </Button>
            <Button v-if="useUser.currentUser.id!==selectedItem.user_id" @click="confirmDelete(selectedItem.id)" severity="danger" variant="text" size="small" class="w-full !justify-start">
                <Icon name="lucide:trash" mode="svg"/> Hapus
            </Button>
        </div>
    </Popover>

</template>

<script setup lang="ts">
import PegawaiProfil from '~/components/Pegawai/PegawaiProfil.vue';

    definePageMeta({
        title: 'Semua Pegawai',
    })
    const useUser = useUserStore()
    const pegawaiDialog = ref(false);
    const confirm = useConfirm();
    const toast = useToast();
    const idpegawai = ref({});
    const itemPegawai = ref();
    const route = useRoute();
    const page = ref(route.query.page ? Number(route.query.page) : 1);
    const selectedItem = ref();
    const op = ref();

    const firstName = (name: string) => {
        return Array.from(name)[0];
    }

    const client = useSanctumClient();
    const { data, status, error, refresh } = await useAsyncData(
        'pegawai-page-'+page.value,
        () => client('/api/pegawai/?page='+page.value)
    )

    const onPaginate = (event: { page: number }) => {
        page.value = event.page + 1; 
        refresh()
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
        navigateTo('/pegawai?page='+page.value)
    };

    const showPegawai = (datapegawai:any) => {
        op.value.hide();
        idpegawai.value = datapegawai.id;
        pegawaiDialog.value = true;
        itemPegawai.value = datapegawai;
    };

  const displayPop = (event: Event, pegawai: any) => {
    op.value.hide();
    selectedItem.value = pegawai;
    op.value.show(event);
  }

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

