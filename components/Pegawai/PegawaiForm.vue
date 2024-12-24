<template>
  <div class="flex flex-col gap-6">
      <div>
        {{ idpegawai }}
      </div>
  </div>
</template>

<script setup lang="ts">

  const client = useSanctumClient();
  const props = defineProps(['idpegawai']);
  const idPegawai = props.idpegawai;
  
  const { data, status, error, refresh } = await useAsyncData(
      'pegawai'+idPegawai,
      () => client('/api/pegawai/'+idPegawai)
  )
  console.log(props);

</script>

