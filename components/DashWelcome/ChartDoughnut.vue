<template>
  <div class="card flex justify-center">
      <Chart type="doughnut" :data="chartData" :options="chartOptions" class="w-full md:w-[30rem]" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps(['data'])
const data = props.data;

onMounted(() => {
    chartData.value = data;
    chartOptions.value = setChartOptions();
});

watch(props, () => {
    chartData.value = props.data;
});

const chartData = ref();
const chartOptions = ref();

const setChartOptions = () => {
    return {
        maintainAspectRatio: true,
        plugins: {
            legend: {
                labels: {
                    cutout: '60%',
                }
            }
        }
    };
};
</script>

