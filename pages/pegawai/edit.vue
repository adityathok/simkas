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
      <PegawaiForm v-else :idpegawai="idPegawai" />

    </template>
  </Card>

</template>

<script setup lang="ts">
  const toast = useToast();
  const route = useRoute()
  const idPegawai = route.query.id || '';
  const idTab = route.query.tab || 'Profil';

  const selectTab = ref(idTab);
  const optionsTab = ref(['Profil', 'Akun']); 

  const tabclick = (e:any) => {
    navigateTo({ path: '/pegawai/edit', query: { id: idPegawai, tab: e.value } });
  };
 
</script>