<template>


  <div class="flex justify-end gap-2 mb-3">
    <Button as="router-link" to="/pegawai" variant="outlined" size="small">
        <Icon name="lucide:list" mode="svg"/>
        Semua
    </Button>
  </div>

    <Card>
      <template #content>

        <PegawaiFormProfil :action="'add'" />              

      </template>
    </Card>

</template>

<script setup lang="ts">
  definePageMeta({
    title: 'Tambah Pegawai',
  })
</script>
