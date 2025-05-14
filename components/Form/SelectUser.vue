<template>

  <div class="relative">
    <Button severity="secondary" class="w-full !justify-start" @click="openDialog" :disabled="props.disabled">

        <div v-if="selectData" class="flex justify-start item-center w-full">
          <div class="w-10">
            <img :src="selectData?.avatar_url" class="aspect-square rounded-full w-full"/>
          </div>
          <div class="ps-3 text-left">
              <div class="font-bold">
                {{ selectData?.nama }}
              </div>
              <div v-if="selectData?.nis" class="text-xs text-slate-400">
                {{ selectData?.nis }} | {{ selectData?.kelas_siswa?.nama }} / {{ selectData?.kelas_siswa?.tahun_ajaran }}
              </div>
              <div v-if="selectData?.nip" class="text-xs text-slate-400">
                {{ selectData?.nip }}
              </div>
            </div>
        </div>

        <div v-else class="flex justify-between item-center w-full">
          Pilih Siswa/Pegawai      
          <div class="px-1">
            <Icon name="lucide:user-search" />
          </div>
        </div>

    </Button>
    <Button v-if="selectData?.nama" @click="clearOption" class="!absolute end-0 top-0 bottom-0" severity="danger" variant="text" :disabled="props.disabled">X</Button>
  </div>

  <Dialog v-model:visible="visibleDialog" :modal="true" header="Cari Siswa/Pegawai" :style="{ width: '30rem' }">
    <Select v-model="formSearch.type" :options="[{label:'Siswa',value:'siswa'},{label:'Pegawai',value:'pegawai'}]" optionLabel="label" optionValue="value" class="w-full" />
    <div class="my-1">
      <InputText
          type="text"
          v-model="formSearch.key"
          @input="onSearch"
          placeholder="Ketik nama / nis / nip"
          class="w-full"
        />
    </div>

    <div v-if="isLoading" class="animate-pulse flex justify-center items-center gap-2 bg-gray-200 px-2 py-3 rounded-lg">
      <Icon name="lucide:loader" class="animate-spin"/> Mencari..
    </div>

    <div v-if="result">
      <div v-for="item in result" :key="item.id" class="pt-1">

        <Button @click="onSelect(item)" severity="secondary" class="w-full !justify-start">
          <div class="w-10">
            <UserAvatar v-if="item.avatar_url" :url="item.avatar_url" :name="item.nama" :size="50" class="w-100"/>
          </div>
          <div class="w-full text-start">
            {{ item.nama }}
            <div class="w-full text-sm mt-1 flex justify-between">

              <span v-if="item.nis" class="opacity-50 ">{{ item.nis }}</span>
              <span v-if="item.nip" class="opacity-70 ">{{ item.nip }}</span>

              <SiswaStatusBadge :status="item.status" />
            </div>
          </div>
        </Button>

      </div>
    </div>

  </Dialog>

</template>

<script setup lang="ts">
const client = useSanctumClient();
const emit = defineEmits(['selected','clear'])
const props = defineProps(['user_id','disabled'])
const user_id = props.user_id
const selectData = ref('' as any);
const isLoading = ref(false)

const result = ref('' as any)
const errors = ref('' as any)

const visibleDialog = ref(false);
const openDialog = () => {
    visibleDialog.value = true;
}

const formSearch = ref({
  type: 'siswa',
  key: '',
})

const onSearch  = async () => {
  if(formSearch.value.key.length > 2) {
    result.value = {}
    errors.value = ''
    isLoading.value = true
    try {
        if(formSearch.value.type == 'siswa'){
          const res = await client('api/siswa/search', {
            method: 'POST',
            body: {cari: formSearch.value.key}
          })
          result.value = res
        } else {
          const res = await client('api/pegawai/search/'+formSearch.value.key)
          result.value = res
        }
    } catch (error) {
        console.log(error);
        errors.value = error
    }    
    isLoading.value = false
  }
}

function onSelect(data: any) {  
  emit('selected',data)
  visibleDialog.value = false;
  selectData.value = data
}

const clearOption = () => {
  emit('clear')
  selectData.value = ''
}

if(user_id){
  try {    
    const res = await client('api/user/searchbyid/'+user_id)
    if(res){
      selectData.value = res
    }
  }catch(er){
    console.log(er)
  }
}
</script>
