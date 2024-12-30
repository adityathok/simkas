<template>

  <PageHeader>
      <template #title>          
          <template>Edit Pegawai</template>
      </template>
  </PageHeader>

  <Card class="mb-5">
    <template #content>
      <SelectButton size="small" v-model="selectTab" :options="optionsTab" @change="tabclick"/></template>
  </Card>

  <Card>
    <template #content>
      
      <PegawaiAkun v-if="selectTab == 'Akun'" :idpegawai="idPegawai" />

      <UserFormAvatar v-else-if="selectTab == 'Foto'" :idpegawai="idPegawai" />

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

  const tabclick = (e:any) => {
    navigateTo({ path: '/pegawai/edit', query: { id: idPegawai, tab: e.value } });
  };

  const { data, status, error, refresh } = await useAsyncData(
        'pegawai'+idPegawai,
        () => client('/api/pegawai/'+idPegawai)
  )
 
</script>