<template>
  <div>
    <DatePicker v-model="tanggal" dateFormat="dd/mm/yy" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide:refresh-ccw" class="mr-1" :class="{'animate-spin':isLoadingRefresh}"/> Reload
    </Button>
  </div>

    <DashCard class="mt-3 mx-1 shadow hover:shadow-xl md:max-w-[60rem]">
      <div class="text-center mb-5">
        <h3 class="text-lg">Laporan Keuangan</h3>
        <h3 class="text-xl md:text-2xl font-bold mb-2">BUKU KAS UMUM / ARUS KAS</h3>
        <p class="text-gray-500">
          {{ dayjs(tanggal).utc().local().format('DD-MM-YYYY') }}
        </p>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full table-auto border-collapse">
          <thead>
            <tr class="bg-amber-600 dark:bg-amber-800 text-white">
              <th class="py-3 px-3 border border-gray-300 text-left">Pendapatan</th>
              <th class="py-3 px-3 border border-gray-300 font-normal text-sm opacity-70 text-right">Realisasi</th>
              <th class="py-3 px-3 border border-gray-300 text-left">Biaya</th>
              <th class="py-3 px-3 border border-gray-300 font-normal text-sm opacity-70 text-right">Realisasi</th>
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
              <td class="py-2 px-3 border border-gray-300" colspan="3">Arus Kas Masuk Bersih</td>
              <td class="py-2 px-3 border border-gray-300 text-end">
                {{ formatUang(dataNeraca.total_bersih)  }}
              </td>
            </tr>
            <tr class="bg-gray-200 dark:bg-gray-800">
              <td class="py-2 px-3 border border-gray-300" colspan="3">Kas Modal Awal Periode</td>
              <td class="py-2 px-3 border border-gray-300 text-end">
                {{ formatUang(dataNeraca.modal_awal)  }}
              </td>
            </tr>
            <tr class="bg-gray-300 dark:bg-gray-800">
              <td class="font-bold py-2 px-3 border border-gray-300" colspan="3">Saldo Kas Akhir</td>
              <td class="font-bold py-2 px-3 border border-gray-300 text-end">
                {{ formatUang(dataNeraca.saldo_akhir)  }}
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
    title: 'Laporan Arus Kas',
})
const client = useSanctumClient();

const route = useRoute();
const tanggal = ref(
  route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any
)

const dataNeraca = reactive({
  data: {
    pendapatan: [{}],
    pengeluaran: [{}],
  },
  total_pendapatan: 0,
  total_pengeluaran: 0,
  total_bersih: 0,
  modal_awal: 0,
  saldo_akhir: 0,
} as any);

const isLoadingRefresh = ref(false);
async function refresh() {
  isLoadingRefresh.value = true;
  try {
    const response = await client('/api/laporan_aruskas/'+dayjs(tanggal.value).utc().local().format('YYYY-MM-DD'));
    dataNeraca.data = response.data;
    dataNeraca.total_pendapatan = response.total_pendapatan;
    dataNeraca.total_pengeluaran = response.total_pengeluaran;
    dataNeraca.total_bersih = response.total_bersih;
    dataNeraca.modal_awal = response.modal_awal;
    dataNeraca.saldo_akhir = response.saldo_akhir;
  } catch (error) {
    console.error(error); 
  }
  isLoadingRefresh.value = false;
}

onMounted(() => {
  refresh(); 
})
</script>
