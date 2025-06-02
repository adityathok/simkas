<template>
  
  <div>
    <DatePicker v-model="tanggal" dateFormat="dd/mm/yy" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide:refresh-ccw" class="mr-1" /> Reload
    </Button>
  </div>

    <DashCard class="mt-3 mx-1 shadow hover:shadow-xl md:max-w-[60rem]">
      <div class="text-center mb-5">
        <h3 class="text-lg">Laporan Keuangan</h3>
        <h3 class="text-xl md:text-4xl font-bold mb-2">Realisasi</h3>
        <p class="text-gray-500">
          {{ dayjs(tanggal).utc().local().format('DD-MM-YYYY') }}
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-emerald-600 text-white">
              <th class="py-3 px-3 border border-gray-300 text-left" colspan="2">Pendapatan</th>
              <th class="py-3 px-3 border border-gray-300 text-left" colspan="2">Biaya</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(item, index) in dataNeraca?.data.pendapatan">
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
            <tr class="bg-gray-200 dark:bg-gray-800">
              <td class="font-bold py-2 px-3 border border-gray-300" colspan="2">Laba rugi</td>
              <td class="font-bold py-2 px-3 border border-gray-300 text-end" colspan="2">
                {{ formatUang(dataNeraca.total_laba_rugi)  }}
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
    title: 'Laporan Labarugi',
})
const client = useSanctumClient();

const route = useRoute();
const tanggal = ref(
  route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any
)

const { data:dataNeraca, refresh } = await useAsyncData(
    'laba_rugi-'+tanggal,
    () => client('/api/laba_rugi/'+dayjs(tanggal.value).utc().local().format('YYYY-MM-DD'))
)
</script>
