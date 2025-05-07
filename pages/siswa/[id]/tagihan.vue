<template>
  <SiswaLayout>
    
    <Card>
      <template #content>

        <div class="flex flex-col md:flex-row md:justify-between justify-end items-center gap-1 mb-3">
          <div class="flex justify-start items-center gap-1">
            <Select v-model="filters.count" :options="[20,50,100]" size="small" />
            <DatePicker v-model="filters.dates" showButtonBar placeholder="Tanggal" selectionMode="range" :manualInput="true" size="small" />
          </div>
          <div class="flex justify-end items-center gap-1">
            <span v-if="status==='pending'" class="text-sm opacity-50">
              Loading...
            </span>
            
            <div v-if="selectedTransaksi && selectedTransaksi.length > 0">
              <span class="me-2 text-xl text-green-700 bg-zinc-200 rounded-xl px-5 py-1">
                Rp{{ formatUang(totalSelectedTransaksi) }}
              </span>
              <Button severity="success">
                <Icon name="lucide:credit-card" /> Bayar Tagihan
              </Button>
            </div>
          </div>
        </div>
    
        <DataTable v-if="data" :value="data.data" class="text-sm text-nowrap" v-model:selection="selectedTransaksi" stripedRows scrollable>          
            <Column selectionMode="multiple"></Column>
            <Column field="nomor" header="No">      
              <template #body="slotProps">
                <button type="button" @click="openDialog(slotProps.data,'preview')" class="cursor-pointer"> 
                  {{ slotProps.data.nomor }}
                </button>
              </template>
            </Column>
            <Column field="nama" header="Nama">      
              <template #body="slotProps">
                <button type="button" @click="openDialog(slotProps.data,'preview')" class="cursor-pointer"> 
                  {{ slotProps.data.tagihan_master.nama }}
                </button>
              </template>
            </Column>
            <Column field="user_id" header="Siswa">          
              <template #body="slotProps">
                <div>
                  {{ slotProps.data.user?.name }}
                </div>
                <NuxtLink :to="'/siswa/'+slotProps.data.user.siswa.id" target="_blank" v-if="slotProps.data.user?.siswa.nis" v-tooltip="'Lihat profil siswa'" class="text-xs text-slate-500">
                  {{ slotProps.data.user.siswa.nis }} / {{ slotProps.data.user.siswa.kelas_siswa.nama }}
                </NuxtLink>
              </template>
            </Column> 
            <Column field="nominal" header="Nominal">         
              <template #body="slotProps">
                {{ slotProps.data.tagihan_master.nominal_label }}
              </template>
            </Column>      
            <Column field="tanggal" header="Tgl" />
            <Column field="status" header="Status">
              <template #body="slotProps">
                <TagihanBagdeStatus :status="slotProps.data.status" />
              </template>
            </Column>
        </DataTable>

        <div v-if="selectedTransaksi && selectedTransaksi.length > 0" class="text-end mt-5">
          <span class="me-2 text-green-700 bg-zinc-200 rounded-xl px-5 py-1">
            Rp{{ formatUang(totalSelectedTransaksi) }}
          </span>
          <Button as="router-link" to="/kasir" severity="success" size="small">
            <Icon name="lucide:credit-card" /> Bayar Tagihan
          </Button>
        </div>

      </template>
    </Card>

  </SiswaLayout>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Tagihan" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <TagihanPreview :data="selectedItem"/>
  </Dialog>
  

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tagihan Siswa',
  description: 'Daftar tagihan dari siswa',
})
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const { setTagihans } = useTagihanStore()
const route = useRoute()
const idSiswa = route.params.id
const page = ref(route.query.page ? Number(route.query.page) : 1)
const client = useSanctumClient()
const visibleDialog = ref(false);
const actionDialog = ref('add');
const selectedItem = ref({} as any);
const toast = useToast();
const visibleFilter = ref(false)

const filters = ref({
  page: route.query.page, 
  count : 20,
  dates: '',
  date_start: '',
  date_end:'',
  status: '',
  siswa_id: idSiswa
} as any)

const { data, status, error, refresh } = await useAsyncData(
    'tagihan-page-'+page.value+idSiswa,
    () => client('/api/tagihan',{
      params : {
        page: page.value,
        count : filters.value.count,
        date_start : filters.value.date_start,
        date_end : filters.value.date_end,
        status: filters.value.status,
        siswa_id: idSiswa
      }
    })
)
const onPaginate = (event: { page: number }) => {
    page.value = event.page + 1; 
};

const openDialog = (itemData: any,action : string) => {
    visibleDialog.value = true;
    actionDialog.value = action;
    selectedItem.value = itemData;
}

//selected tagihan
const selectedTransaksi = ref();
const totalSelectedTransaksi = ref(0);

//watch selected tagihan
watch(
    () => selectedTransaksi.value,
    () => {
      //hitung nominal dari selected tagihan
      totalSelectedTransaksi.value = selectedTransaksi.value.reduce((acc: any, item: any) => acc + parseInt(item.tagihan_master.nominal), 0);

      //buat array tagihan
      const tagihans = selectedTransaksi.value.map((item: any) => {
        return {
          id: item.id,
          user_id: item.user_id,
        }
      })

      setTagihans(tagihans)
    },
    { deep: true } // Untuk memantau perubahan dalam objek
);
</script>
