<template>

  <div class="flex justify-end items-center hidden mb-2">
    <DatePicker v-model="tanggal" view="month" dateFormat="mm/yy" :manualInput="true" size="small" />
  </div>

  <div class="mb-10">
    <DashWelcomeCardIcons
    :total_pendapatan="Data.total_pendapatan"
    :total_pengeluaran="Data.total_pengeluaran"
    :total_hariini="Data.total_hariini"
    :total_tagihan="Data.total_tagihan"/>   
  </div>

  <div class="flex flex-col md:flex-row gap-4">

    <div class="basis-1 md:basis-[80%]">
      <DashCard>
        <DashWelcomeChartLine :data="Data.chart"/>
      </DashCard>
    </div>
    <div class="basis-1 md:basis-[20%]">
      <DashCard>
        <DashWelcomeChartDoughnut :data="Data.chart_pendapatan"/>
      </DashCard>
    </div>

  </div>


</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const tanggal = ref(
  dayjs().utc().local().format('MM/YYYY') as any
)
const client = useSanctumClient();
const Data = ref({
  total_pendapatan: 0,
  total_pengeluaran: 0,
  total_hariini: 0,
  total_tagihan: 0,
  chart: {
    labels: ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'],
    datasets: []
  },
  chart_pendapatan: {
    labels: [],
    datasets: []
  }
} as any);

async function getData() {
  const tanggal_e = dayjs(tanggal.value).utc().local().format('MM-YYYY')
  try {
    const res = await client('/api/dashboard?bulan='+tanggal_e)
    Data.value = res;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getData(); 
})
watch(tanggal, () => {
  getData();
})

// const { data, refresh } = await useAsyncData(
//     'dashboard',
//     () => client('/api/dashboard?bulan='+tanggal.value)
// )
// watch(tanggal, () => {
//   refresh();
// })
</script>