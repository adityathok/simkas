<template>

  <PageHeader>
      <template #title>          
          <template v-if="idPegawai">Edit Pegawai</template>
          <template v-else>Tambah Pegawai</template>
      </template>
  </PageHeader>

  <Card>
    <template #content>
      <div class="mb-5">
            <SelectButton v-model="selectTab" :options="optionsTab" />
      </div>

      <PegawaiAkun v-if="selectTab == 'Akun'" :idpegawai="idPegawai" />
      <PegawaiForm v-else :idpegawai="idPegawai" />

    </template>
  </Card>

</template>

<script setup lang="ts">
  const toast = useToast();
  const route = useRoute()
  const idPegawai = route.query.id || '';

  const selectTab = ref('Profil');
  const optionsTab = ref(['Profil', 'Akun']);

</script>