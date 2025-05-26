<template>

  <Message v-if="loadingTagihan" severity="warn" class="my-2">
    Memuat data tagihan...
  </Message>
  
  <DataTable v-if="dataTagihan?.data" :value="dataTagihan?.data" class="text-sm text-nowrap" stripedRows scrollable scrollHeight="400px">
    <!-- <Column selectionMode="multiple"></Column> -->  
    <Column field="tagihan" header="Tagihan">         
      <template #body="slotProps">
        <div class="font-bold text-xs">
          {{ slotProps.data.nomor }}
        </div>
        <div class="truncate max-w-60" v-tooltip="slotProps.data.tagihan_master.nama">
          {{ slotProps.data.tagihan_master.nama }}
        </div>
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
    <Column field="act" header="">
      <template #body="slotProps">
        <Button @click="addSelected(slotProps.data)" v-tooltip="'Tambahkan'">
          <Icon name="lucide:circle-plus" />
        </Button>
      </template>
    </Column>
  </DataTable>
  <div class="flex flex-col md:flex-row md:justify-between items-center">
    <div class="text-sm text-slate-400">
      {{ dataTagihan.to }} / {{ dataTagihan.total }}
    </div>
    <Paginator
          :rows="dataTagihan.per_page"
          :totalRecords="dataTagihan.total"
          @page="onPaginate"
          :pt="{
              root: (event: any) => {
                  const itemForPage =  dataTagihan.per_page;
                  const currentPage =  page - 1;
                  event.state.d_first = itemForPage * currentPage;
              },
          }"
      >
    </Paginator>
  </div>

</template>

<script setup lang="ts">
const emit = defineEmits(['selected']);
const props = defineProps(['user_id','siswa_id','tagihans'])
const userId = computed(() => props.user_id)
const siswaId = props.siswa_id
const client = useSanctumClient();

const page = ref(1)
const dataTagihan = ref({
  data: []
} as any)

const loadingTagihan = ref(false)
async function getTagihan(){
  loadingTagihan.value = true
  try {
    const res = await client('/api/tagihan',{
      params:{
        page: page.value,
        // user_id: userId.value,
        // siswa_id: siswaId.value
      }
    })
    dataTagihan.value = res
  } catch (error) {
    const r = useSanctumError(error)
  }
  loadingTagihan.value = false
}
const onPaginate = (event: { page: number }) => {
  page.value = event.page + 1;
  getTagihan()
};

//watch jika userId berubah
watch(() => userId.value, () => {
  page.value = 1;
  getTagihan()
})

const selectedTagihans = ref({} as any);
const addSelected = (data: Object) => {
  //send data to emit
  emit('selected', data)
}
</script>
