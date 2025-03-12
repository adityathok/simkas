<template>
  
  <PengaturanLayout>
    <template #content>
      
      <form @submit.prevent="handleFormSubmit">

        <div v-for="(jenjang,i) in jenjangs" :key="i" class="py-1 flex">
          <InputText class="w-full rounded-e-none!" v-model="jenjangs[i]" />
          <Button class="rounded-s-none!" @click="removeList(i)" severity="danger">
            <Icon name="lucide:x" />
          </Button>
        </div>
        <div class="flex justify-end gap-1 mt-4">
          <Button @click="jenjangs.push('')" severity="info">
            <Icon name="lucide:plus" />
            Tambah jenjang
          </Button>
          <Button type="submit" severity="success" :loading="isLoading">
            <Icon name="lucide:save" />
            Simpan
          </Button>
        </div>

      </form>

    </template>
    </PengaturanLayout>

</template>

<script setup lang="ts">
definePageMeta({
    title: 'Pengaturan',
    caption: 'Daftar Jenjang',
})
const toast = useToast();
const client = useSanctumClient();
const isLoading = ref(false)

const { data, status } = await useAsyncData(
      'pengaturan-jenjang',
      () => client('/api/setting', {
         method: 'GET',
         params: {
            'keys[]': [
              'jenjang',
            ]
         }
      })
  );
const jenjangs = ref(data.value.jenjang);

const removeList = (i: number) => {
  jenjangs.value.splice(i, 1);
};

const handleFormSubmit = async () => {
  isLoading.value = true;
  try {
    await client('/api/setting', {
      method: 'POST',
      body: {
        jenjang: jenjangs.value
      }
    })
    toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Perubahan berhasil disimpan', life: 3000 });
  } catch (er) {
    const e = useSanctumError(er);
    console.log(e.bag);
    toast.add({ severity: 'error', summary: 'Gagal', detail: 'Perubahan gagal disimpan', life: 3000 });
  }
  isLoading.value = false;
};

</script>
