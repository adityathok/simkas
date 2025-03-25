<template>

    <div class="relative">
      
      <div class="rounded w-full py-2 px-3 bg-slate-100 cursor-pointer" @click="openDialog">
        
        <div v-if="selectData?.nama" class="flex items-center relative pe-4">
          <img :src="selectData?.avatar_url" class="aspect-square rounded-full w-15"/>
          <div class="ps-3">
            <div class="font-bold">
              {{ selectData?.nama }}
            </div>
            <div class="text-xs text-slate-400">
              {{ selectData?.nis }} | {{ selectData?.kelas_siswa?.nama }} / {{ selectData?.kelas_siswa?.tahun_ajaran }}
            </div>
          </div>
        </div>
        <template v-else>
          {{ name }}
        </template>

      </div>
      <Button v-if="selectData?.nama" @click="clearOption" class="!absolute end-0 top-0 bottom-0" severity="danger" variant="text">X</Button>
      <span v-else @click="openDialog" class="!absolute end-0 top-0 bottom-0 p-2">
        <Icon name="lucide:user-search" />
      </span>

    </div>

    <Dialog v-model:visible="visibleDialog" :modal="true" header="Cari siswa" :style="{ width: '30rem' }">
      <InputText
          type="text"
          v-model="searchQuery"
          @input="onSearch"
          placeholder="Cari Siswa..."
          class="w-full"
        />
        
        <div>

          <div v-if="isLoading" class="flex items-center py-2 opacity-50 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="animate-spin lucide lucide-loader"><path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/></svg>
            Mencari siswa..
          </div>

          <div v-if="result" class="hasilCari border-t mt-4">
            <div v-for="item in result" :key="item.id">

              <div @click="onSelect(item)" class="cursor-pointer rounded-md p-2 border-b flex justify-start items-center gap-2 hover:bg-slate-900 hover:text-white">
                <div>
                  <UserAvatar v-if="item.avatar_url" :url="item.avatar_url" :name="item.nama" :size="50" />
                </div>
                <div class="w-full">
                  {{ item.nama }}
                  <div class="w-full text-sm mt-1 flex justify-between">
                    <span class="opacity-50 ">{{ item.nis }}</span>
                    <SiswaStatusBadge :status="item.status" />
                  </div>
                </div>
              </div>

            </div>
          </div>

          <div v-if="errors">
            <Message severity="warn" class="mt-3" closable>
              <div class="flex items-center gap-2">
                <Icon name="lucide:search-x"  /> Siswa tidak ditemukan
              </div>
            </Message>
          </div>

        </div>
    </Dialog>

</template>

<script setup lang="ts">
const client = useSanctumClient();
const searchQuery = ref('' as any)
const isLoading = ref(false)
const name = ref('Pilih siswa' as any);
const selectData = ref('' as any);

const result = ref('' as any)
const errors = ref('' as any)

const visibleDialog = ref(false);
const openDialog = () => {
    visibleDialog.value = true;
}

const onSearch  = async () => {
  result.value = {}
  errors.value = ''
  name.value = 'Pilih Siswa'
  selectData.value = {}

  if(searchQuery.value.length > 2) {

    isLoading.value = true
    try {
        const res = await client('api/siswa/search', {
          method: 'POST',
          body: {cari: searchQuery.value}
        })
        result.value = res
    } catch (error) {
        console.log(error);
        errors.value = error
    }
    isLoading.value = false
    
  }

}

// Interface untuk opsi siswa
interface Option {
  id: string;
  user_id: string;
}

const emit = defineEmits<{
  (e: 'selected', option: Option): void;
  (e: 'clear'): void
}>();

const onSelect = (data : any) => {
  emit('selected',data)
  visibleDialog.value = false;
  name.value = data.nama
  selectData.value = data
}

const clearOption = () => {
  emit('clear')
  result.value = {}
  errors.value = ''
  name.value = 'Pilih Siswa'
  selectData.value = {}
}

</script>
