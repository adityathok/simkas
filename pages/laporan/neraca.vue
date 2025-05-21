<template>
  <div>
    <DatePicker v-model="filters.bulan" placeholder="Bulan" view="month" dateFormat="mm/yy" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide-search" class="mr-1" /> Reload
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
    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-blue-800 text-white">
          <th class="py-3 px-3 border border-gray-300 text-left">Akun</th>
          <th class="py-3 px-3 border border-gray-300 text-right">Debet</th>
          <th class="py-3 px-3 border border-gray-300 text-right">Kredit</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-gray-100 dark:bg-gray-800">
          <td class="font-bold py-2 px-3 border border-gray-300" colspan="3">Aktiva</td>
        </tr>
        <tr v-for="(item, index) in dataNeraca?.data.pendapatan" :key="index">
          <td class="py-2 px-3 border border-gray-300">{{ item.nama }}</td>
          <td class="py-2 px-3 border border-gray-300 text-right">
            {{ formatUang(item.total_nominal)  }}
          </td>
          <td class="py-2 px-3 border border-gray-300 text-right">
            
          </td>
        </tr>

        <tr class="bg-gray-100 dark:bg-gray-800">
          <td class="font-bold py-2 px-3 border border-gray-300" colspan="3">Hutang</td>
        </tr>
        <tr v-for="(item, index) in dataNeraca?.data.pengeluaran" :key="index">
          <td class="py-2 px-3 border border-gray-300">{{ item.nama }}</td>
          <td class="py-2 px-3 border border-gray-300 text-right">
            
          </td>
          <td class="py-2 px-3 border border-gray-300 text-right">
            {{ formatUang(item.total_nominal)  }}
          </td>
        </tr>

        <tr class="bg-gray-100 dark:bg-gray-800">
          <td class="font-bold py-2 px-3 border border-gray-300">Total</td>
          <td class="font-bold py-2 px-3 border border-gray-300 text-end">
            {{ formatUang(dataNeraca.total_pendapatan)  }}
          </td>
          <td class="font-bold py-2 px-3 border border-gray-300 text-end">
            {{ formatUang(dataNeraca.total_pengeluaran)  }}
          </td>
        </tr>
      </tbody>
      </table>
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

const { data:dataNeraca, refresh } = await useAsyncData(
    'neraca-'+filters.bulan,
    () => client('/api/neraca/'+dayjs(filters.bulan).utc().local().format('YYYY-MM'))
)
</script>

