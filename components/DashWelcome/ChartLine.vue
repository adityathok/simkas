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
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}
</script>

<template>
  <div>
      <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[30rem]"/>
  </div>
</template>

<style scoped></style>
