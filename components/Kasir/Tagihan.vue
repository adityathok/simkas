<template>
  <div>
    <div class="border p-4 rounded-lg mb-5">
      <div class="mb-2 font-bold">User</div>
      <FormSelectUser :user_id="form.user_id" @selected="onUserSelect" @clear="onUserSelectClear"/>
    </div>

    <div v-if="dataTagihan.data && dataTagihan.data.length > 0" class="border p-4 rounded-lg mb-5">
      <div class="mb-2 font-bold">
        Daftar Tagihan
      </div>
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
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps(['user_id','siswa_id','tagihans'])
const emit = defineEmits(['update','selected']);
const client = useSanctumClient();

const form = ref({
  user_id:'' as any,
  siswa_id:'' as any,
  pegawai_id:'' as any,
  user_type:'' as any,
} as any)

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

function onUserSelect(data : any){
  dataTagihan.value = {}
  dataTagihan.value.data = []

  form.value.user_id = data.user_id
  if(data.kelas_siswa){
    form.value.siswa_id = data.id
    form.value.user_type = 'siswa'
    getTagihan()
  } else {
    form.value.pegawai_id = data.id
    form.value.user_type ='pegawai'
  }
  emit('update',form.value)
}
function onUserSelectClear(){
  dataTagihan.value = {}
  dataTagihan.value.data = []
  form.value.user_id = ''
  form.value.siswa_id = ''
  form.value.pegawai_id = ''
}

// const selectedTagihans = ref({} as any);
const addSelected = (data: any) => {
  //tambahkan data ke selectedTagihans
  // selectedTagihans.value[data.id] = data;

  //send data to emit
  emit('selected', data)
}
</script>
