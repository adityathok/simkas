<template>
  
  <div class="flex justify-end gap-2 mb-3">
    <Button as="router-link" to="/pegawai" variant="outlined" size="small">
        <Icon name="lucide:list" mode="svg"/>
        Semua
    </Button>
    <Button as="router-link" to="/pegawai/add" size="small">
        <Icon name="lucide:user-plus" mode="svg"/>
        Tambah
    </Button>
  </div>

  <Card>
    <template #content>

      <h2 class="font-bold text-xl mb-5">
        {{ data.nama }}
      </h2>

      <div class="mb-3">
        <SelectButton v-model="selectTab" :options="optionsTab" @change="tabclick"/>
      </div>
      
      <PegawaiAkun v-if="selectTab == 'Akun'" :idpegawai="idPegawai" />

      <UserFormAvatar v-else-if="selectTab == 'Foto'" :iduser="data.user_id" />

      <PegawaiFormProfil v-else :idpegawai="idPegawai" :data="data" :action="'edit'" />

    </template>
  </Card>

</template>

<script setup lang="ts">
  definePageMeta({
    title: 'Edit Pegawai',
  })
  const client = useSanctumClient();
  const route = useRoute()
  const idPegawai = route.query.id || '';
  const idTab = route.query.tab || 'Profil';

  const selectTab = ref(idTab);
  const optionsTab = ref(['Profil', 'Akun', 'Foto']); 

  onMounted(() => {
    if (idPegawai == '') {
      navigateTo('/pegawai/add');
    }
  })

  const tabclick = (e:any) => {
    navigateTo({ path: '/pegawai/edit', query: { id: idPegawai, tab: e.value } });
  };

  const { data, status, error, refresh } = await useAsyncData(
    'pegawai'+idPegawai,
    () => client('/api/pegawai/'+idPegawai)
  )
 
</script>