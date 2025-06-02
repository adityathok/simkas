<template>
  <div>
    <DatePicker v-model="filters.bulan" placeholder="Bulan" view="month" dateFormat="mm/yy" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide:refresh-ccw" class="mr-1" :class="{'animate-spin':isLoadingRefresh}"/> Reload
    </Button>
  </div>

  <DashCard class="mt-3 mx-1 shadow hover:shadow-xl md:max-w-[50rem]">
    <div class="text-center mb-5">
      <h3 class="text-lg">Laporan Keuangan</h3>
      <h3 class="text-xl md:text-4xl font-bold mb-2"> Neraca</h3>
      <p class="text-gray-500">
        {{ dayjs(filters.bulan).utc().local().format('YYYY-MM') }}
      </p>
    </div>
    
    <div class="overflow-x-auto">
      <table class="w-full table-auto border-collapse">        
          <thead>
            <tr class="bg-slate-800 text-white">
              <th class="py-3 px-3 border border-gray-300 text-left" colspan="2">Aktiva</th>
              <th class="py-3 px-3 border border-gray-300 text-left" colspan="2">Hutang</th>
            </tr>
          </thead>
          <tbody>
            
              <tr v-if="dataNeraca?.data?.pendapatan" v-for="(item, index) in dataNeraca?.data.pendapatan" :key="index">
               <td class="py-2 px-3 border border-gray-300">            
                  <template v-if="item.nama != 0">
                    {{ item.nama }}
                  </template>
                </td>
                <td class="py-2 px-3 border border-gray-300 text-right">                 
                  <template v-if="item.nama != 0">
                    {{ formatUang(item.total_nominal)  }}
                  </template>
                </td>
                <td class="py-2 px-3 border border-gray-300">
                  <template v-if="dataNeraca?.data.pengeluaran[index] && dataNeraca?.data.pengeluaran[index].nama != 0">
                      {{ dataNeraca?.data.pengeluaran[index].nama  }}
                  </template>
                </td>
                <td class="py-2 px-3 border border-gray-300 text-right">            
                  <template v-if="dataNeraca?.data.pengeluaran[index] && dataNeraca?.data.pengeluaran[index].nama != 0">
                      {{ formatUang(dataNeraca?.data.pengeluaran[index].total_nominal)  }}
                  </template>
                </td>
              </tr>
              
              <tr class="bg-gray-100 dark:bg-gray-800">
                <td class="font-bold py-2 px-3 border border-gray-300">Total</td>
                <td class="font-bold py-2 px-3 border border-gray-300 text-end">
                  {{ formatUang(dataNeraca.total_pendapatan)  }}
                </td>
                <td class="font-bold py-2 px-3 border border-gray-300">Total</td>
                <td class="font-bold py-2 px-3 border border-gray-300 text-end">
                  {{ formatUang(dataNeraca.total_pengeluaran)  }}
                </td>
              </tr>

          </tbody>
      </table>
    </div>

  </DashCard>


</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
import { formatUang } from '~/utils/formatUang';
definePageMeta({
    title: 'Laporan Neraca',
})
const client = useSanctumClient();

const route = useRoute();
const filters = reactive({
  bulan: route.query.bulan || dayjs().utc().local().format('YYYY-MM') as any,
} as any)

const dataNeraca = reactive({
  data: {
    pendapatan: [{}],
    pengeluaran: [{}],
  },
  total_pendapatan: 0,
  total_pengeluaran: 0,
} as any);

const isLoadingRefresh = ref(false);
async function refresh() {
  isLoadingRefresh.value = true;
  try {
    const response = await client('/api/neraca/'+dayjs(filters.bulan).utc().local().format('YYYY-MM'));
    dataNeraca.data = response.data;
    dataNeraca.total_pendapatan = response.total_pendapatan;
    dataNeraca.total_pengeluaran = response.total_pengeluaran;
  } catch (error) {
    console.error(error); 
  }
  isLoadingRefresh.value = false;
}

onMounted(() => {
  refresh(); 
})

</script>

