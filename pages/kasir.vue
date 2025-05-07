<template>


  <div class="flex flex-col md:flex-row gap-5">
    
    <Card class="md:flex-1">
      <template #content>
        <div class="mb-5">
          <FormSelectSiswa :user_id="form.user_id" @selected="onSiswaSelect" @clear="onSiswaSelectClear"/>
        </div>

        <div>
          <DataTable v-if="dataTagihans" :value="dataTagihans" v-model:selection="selectedTagihan" class="text-sm text-nowrap" stripedRows scrollable>
            <Column selectionMode="multiple"></Column>
            <Column field="nomor" header="No"></Column>
            <Column field="nama" header="Nama">      
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
          </DataTable>
          
          <Message severity="warn" v-else>
            <div class="flex justify-center items-center gap-2">
              <Icon name="lucide:info" class="text-xl text-yellow-400"/>
              <span>Tidak ada data</span>
            </div>
          </Message>

          
        </div>
      </template>
    </Card>
    
    <Card class="md:basis-[20em]">
      <template #content>
      </template>
    </Card>

  </div>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
const { tagihans } = useTagihanStore()
const client = useSanctumClient();

const selectedTagihan = ref();
const dataTagihans = ref({} as any)
const loadingTagihans = ref(false)
const errorTagihans = ref({} as any)
async function getTagihans() {
  loadingTagihans.value = true
  try {
    const res = await client('/api/tagihan', {
      method: 'GET',
      params: {
        user_id: form.value.user_id,
        siswa_id: form.value.siswa_id,
      }
    })
    dataTagihans.value = res.data
  }
  catch (error) {
    const er = useSanctumError(error)
    errorTagihans.value = er.bag
  }
}

const form = ref({
  user_id: '',
  siswa_id: '',
})

function onSiswaSelect(selected: { id: any; user_id: any; }) {
  if(selected.user_id) {
    form.value.siswa_id = selected.id
    form.value.user_id = selected.user_id
    getTagihans()
  } else {
    form.value.siswa_id = ''
    form.value.user_id = ''
  }
}
function onSiswaSelectClear(){
  form.value.siswa_id = ''
  form.value.user_id = ''
}
</script>
