<template>
  <UnitSekolahLayout>

    <div>
      Page: unitsekolah/[id]/index
    </div>

  </UnitSekolahLayout>
</template>

<script setup lang="ts">
  definePageMeta({
      title: 'Unit Sekolah',
  })
  const route = useRoute()
  const idUnit = route.params.id
  const client = useSanctumClient();

  const { data, status, error, refresh } = await useAsyncData(
      'unitsekolah-'+idUnit,
      () => client('/api/unitsekolah/'+idUnit)
  )
</script>