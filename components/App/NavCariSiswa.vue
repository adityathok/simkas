<template>
  <form @submit.prevent="handleFormSubmit">
    <div class="flex border border-slate-200 rounded-lg overflow-hidden">
        <InputText id="inputCari" type="text" v-model="form.cari" placeholder="Ketik nama/nis siswa.." class="w-full !border-none px-5 py-3 !rounded-none" />
        <Button type="submit" severity="secondary" variant="text" class="!rounded-none">
            <Icon name="lucide:search" mode="svg" />
        </Button>
    </div>
  </form>

  <div v-if="isLoading" class="flex justify-start items-center opacity-50 my-2">
    <Icon name="lucide:loader" mode="svg" class="animate-spin mr-2"/> mohon tunggu ..
  </div>

  <div v-if="result" class="hasilCari border-t mt-4">
    <div v-for="item in result" :key="item.id">

      <NuxtLink :to="'/siswa/'+item.id" @click="emit('openSiswa')" class="rounded-md p-2 border-b flex justify-start items-center gap-2 hover:bg-slate-900 hover:text-white">
        <div>
          <Avatar v-if="item.avatar_url" :image="item.avatar_url" shape="circle" />
        </div>
        <div>
          {{ item.nama }}
           <div class="text-sm opacity-50 mt-1">{{ item.nis }}</div>
        </div>
      </NuxtLink>

    </div>
  </div>

  <div v-if="errors">
    <Message severity="warn" class="mt-3" closable>
      <div class="flex items-center gap-2">
        <Icon name="lucide:search-x" mode="svg" /> Siswa tidak ditemukan
      </div>
    </Message>
  </div>

</template>

<script setup lang="ts">
const emit = defineEmits(['openSiswa'])
const client = useSanctumClient();
const isLoading = ref(false)
const errors = ref('' as any)

const form = ref({
  cari: ''
})

const result = ref('' as any)

//watch perubahan input
watch(() => form.value.cari, () => {
  //jika input kosong, hapus result
  if(!form.value.cari){
    result.value = {}
    errors.value = ''
  }
})

//mounted #inputCari focus
onMounted(() => {
  const inputCari = document.getElementById('inputCari') as HTMLInputElement
  inputCari.focus()
})

const handleFormSubmit = async () => {
  isLoading.value = true
  result.value = {}
  errors.value = ''
    try {
        const res = await client('api/siswa/search', {
          method: 'POST',
          body: {cari: form.value.cari}
        })
        result.value = res
    } catch (error) {
        console.log(error);
        errors.value = error
    }
    isLoading.value = false
}

</script>
