<template>
  
  <PengaturanLayout>
    <template #content>
      
      <form @submit.prevent="handleFormSubmit">

        <div v-for="(jabatan,i) in jabatans" :key="i" class="py-1 flex">
          <InputText class="w-full !rounded-e-none" v-model="jabatans[i]" />
          <Button class="!rounded-s-none" @click="removeList(i)" severity="danger">
            <Icon name="lucide:x" mode="svg"/>
          </Button>
        </div>
        <div class="flex justify-end gap-1 mt-4">
          <Button @click="jabatans.push('')" severity="info">
            <Icon name="lucide:plus" mode="svg"/>
            Tambah Jabatan
          </Button>
          <Button type="submit" severity="success" :loading="isLoading">
            <Icon name="lucide:save" mode="svg"/>
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
    caption: 'Daftar Jabatan',
})
const toast = useToast();
const client = useSanctumClient();
const isLoading = ref(false)

const { data, status } = await useAsyncData(
      'pengaturan-jabatan',
      () => client('/api/setting', {
         method: 'GET',
         params: {
            'keys[]': [
              'jabatan',
            ]
         }
      })
  );
const jabatans = ref(data.value.jabatan);

const removeList = (i: number) => {
  jabatans.value.splice(i, 1);
};

const handleFormSubmit = async () => {
  isLoading.value = true;
  try {
    await client('/api/setting', {
      method: 'POST',
      body: {
        jabatan: jabatans.value
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
