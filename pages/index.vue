<template>

  <div class="hidden mb-2">
    <DatePicker v-model="bulan" view="month" dateFormat="mm/yy" :manualInput="true" size="small" />
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
      <template #header>
        <Icon name="lucide:chart-no-axes-column-increasing" /> Grafik {{ dayjs().utc().local().format('YYYY') }}
      </template>
        <DashWelcomeChartLine :data="Data.chart"/>
      </DashCard>
    </div>
    <div class="basis-1 md:basis-[20%]">
      <DashCard>
        <template #header>
          <Icon name="lucide:chart-pie" /> Pendapatan {{ bulan }}
        </template>
        <DashWelcomeChartDoughnut :data="Data.chart_pendapatan"/>
      </DashCard>
    </div>

  </div>


</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

const bulan = ref(
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
  const bulane = dayjs(bulan.value).utc().local().format('MM-YYYY')
  try {
    const res = await client('/api/dashboard?bulan='+bulane)
    Data.value = res;
  } catch (error) {
    console.log(error);
  }
}

onMounted(() => {
  getData(); 
})
watch(bulan, () => {
  getData();
})

</script>