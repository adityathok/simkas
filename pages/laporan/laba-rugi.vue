<template>
  
  <div>
    <DatePicker v-model="tanggal" dateFormat="mm/yy/dd" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide-search" class="mr-1" /> Reload
    </Button>
  </div>

    <DashCard class="mt-3 mx-1 shadow hover:shadow-xl md:max-w-[50rem]">
    <div class="text-center mb-5">
      <h3 class="text-lg">Laporan Keuangan</h3>
      <h3 class="text-xl md:text-4xl font-bold mb-2"> Realisasi</h3>
      <p class="text-gray-500">
        {{ dayjs(tanggal).utc().local().format('DD-MM-YYYY') }}
      </p>
    </div>

    <table class="w-full table-auto border-collapse">
      <thead>
        <tr class="bg-slate-800 text-white">
          <th class="py-3 px-3 border border-gray-300 text-left">Akun</th>
          <th class="py-3 px-3 border border-gray-300 text-right">Pendapatan</th>
          <th class="py-3 px-3 border border-gray-300 text-right">Biaya</th>
        </tr>
      </thead>
      <tbody>
        <tr class="bg-gray-100 dark:bg-gray-800">
          <td class="font-bold py-2 px-3 border border-gray-300" colspan="3">Pendapatan</td>
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
          <td class="font-bold py-2 px-3 border border-gray-300" colspan="3">Biaya</td>
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
        <tr class="bg-gray-100 dark:bg-gray-800">
          <td class="font-bold py-2 px-3 border border-gray-300">Laba rugi</td>
          <td class="font-bold py-2 px-3 border border-gray-300 text-end" colspan="2">
            {{ formatUang(dataNeraca.total_laba_rugi)  }}
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
const tanggal = reactive(
  route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any
)

const { data:dataNeraca, refresh } = await useAsyncData(
    'laba_rugi-'+tanggal,
    () => client('/api/laba_rugi/'+dayjs(tanggal).utc().local().format('YYYY-MM-DD'))
)
</script>
