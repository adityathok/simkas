<template>

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
