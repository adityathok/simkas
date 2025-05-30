<template>

  <div class="mb-10">
    <DashWelcomeCardIcons :total_pendapatan="data.total_pendapatan" :total_pengeluaran="data.total_pengeluaran"/>   
  </div>

  <div class="flex flex-col md:flex-row gap-4">

    <div class="basis-1 md:basis-[70%]">
      <DashCard>
        <DashWelcomeChartLine />
      </DashCard>
    </div>
    <div class="basis-1 md:basis-[30%]">
      <DashCard>
      </DashCard>
    </div>

  </div>


</template>

<script setup lang="ts">
const client = useSanctumClient();
const { data, refresh } = await useAsyncData(
    'dashboard',
    () => client('/api/dashboard')
)
</script>