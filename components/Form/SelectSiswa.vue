<template>

    <div class="relative">
      
      <div class="rounded w-full py-2 px-3 bg-slate-100 cursor-pointer" @click="openDialog">
        {{ name }}
      </div>

    </div>

    <Dialog v-model:visible="visibleDialog" :modal="true" header="Tambah Siswa di Kelas" :style="{ width: '30rem' }">
      <InputText
          type="text"
          v-model="searchQuery"
          @input="onSearch"
          placeholder="Cari Siswa..."
          class="w-full"
        />
        
        <div>

          <div v-if="result" class="hasilCari border-t mt-4">
            <div v-for="item in result" :key="item.id">

              <div @click="onSelect(item)" class="cursor-pointer rounded-md p-2 border-b flex justify-start items-center gap-2 hover:bg-slate-900 hover:text-white">
                <div>
                  <UserAvatar v-if="item.avatar_url" :url="item.avatar_url" :name="item.nama" :size="50" />
                </div>
                <div>
                  {{ item.nama }}
                  <div class="text-sm opacity-50 mt-1">{{ item.nis }}</div>
                </div>
              </div>

            </div>
          </div>

          <div v-if="errors">
            <Message severity="warn" class="mt-3" closable>
              <div class="flex items-center gap-2">
                <Icon name="lucide:search-x" mode="svg" /> Siswa tidak ditemukan
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

const result = ref('' as any)
const errors = ref('' as any)

const visibleDialog = ref(false);
const openDialog = () => {
    visibleDialog.value = true;
}

const onSearch  = async () => {
  result.value = {}
  errors.value = ''

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
  id: number;
  label: string;
}

const emit = defineEmits<{
  (e: 'selected', option: Option): void;
}>();

const onSelect = (data : any) => {
  emit('selected',data)
  visibleDialog.value = false;
  name.value = data.nama
}

</script>
