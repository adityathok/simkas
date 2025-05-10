<template>
  
  <DataTable v-if="dataTagihan?.data" :value="dataTagihan?.data" class="text-sm text-nowrap" stripedRows scrollable scrollHeight="400px">
    <!-- <Column selectionMode="multiple"></Column> -->
    <Column field="nomor" header="No" />    
    <Column field="tagihan" header="Tagihan">         
      <template #body="slotProps">
        {{ slotProps.data.tagihan_master.nama }}
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

</template>

<script setup lang="ts">
const emit = defineEmits(['selected']);
const props = defineProps(['user_id','siswa_id'])
const userId = computed(() => props.user_id)
const siswaId = props.siswa_id
const client = useSanctumClient();

const page = ref(1)
const dataTagihan = ref({
  data: []
} as any)

async function getTagihan(){
  try {
    const res = await client('/api/tagihan',{
      params:{
        page: page.value,
        user_id: userId.value,
        siswa_id: siswaId.value
      }
    })
    dataTagihan.value = res
  } catch (error) {
    const r = useSanctumError(error)
  }
}

//watch jika userId berubah
watch(() => userId.value, () => {
  getTagihan()
})

const selectedTagihans = ref({} as any);
const addSelected = (data: Object) => {
  //send data to emit
  emit('selected', data)
}
</script>
