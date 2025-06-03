<template>

  <div class="flex items-center justify-end">
    <DatePicker v-model="tanggal" dateFormat="dd/mm/yy" :manualInput="true" size="small" />
    <Button @click="refresh()" size="small">
      <Icon name="lucide:refresh-ccw" class="mr-1" /> Reload
    </Button>
  </div>

   <div class="text-center mb-5 md:mb-10">
      <h3 class="text-lg">Laporan Keuangan</h3>
      <h3 class="text-xl md:text-2xl font-bold mb-2">PERUBAHAN MODAL</h3>
      <p class="text-gray-500">
        {{ dayjs(tanggal).utc().local().format('DD-MM-YYYY') }}
      </p>
    </div>
    
    <div class="flex flex-col md:flex-row gap-4 md:gap-10">

      <div class="md:basis-1/2 overflow-x-auto">
        <DashCard>
          <div class="font-bold md:text-lg mb-3 text-sky-700 dark:text-sky-500">
            <Icon name="lucide:chart-spline" /> Perubahan Modal
          </div>
          <table class="w-full table-auto border-collapse">
            <tbody>
              <tr>
                <td class="py-2 px-3 border border-gray-300">Modal Awal</td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(dataTabel.modal_awal)  }}
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3 border border-gray-300">Laba/Rugi Bersih</td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(dataTabel.total_bersih)  }}
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3 border border-gray-300">Penambahan Modal</td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(dataTabel.penambahan_modal)  }}
                </td>
              </tr>
              <tr>
                <td class="py-2 px-3 border border-gray-300">Modal Akhir</td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(dataTabel.saldo_akhir)  }}
                </td>
              </tr>
            </tbody>
          </table>
        </DashCard>

        <DashCard class="mt-5 md:mt-8">
          <div class="font-bold md:text-lg mb-3 text-indigo-700 dark:text-indigo-500">
            <Icon name="lucide:wallet" /> Akun Rekening
          </div>
          <table class="w-full table-auto border-collapse">
            <tbody>
              
              <tr v-for="item in dataTabel.likuiditas_rekening">
                <td class="py-2 px-3 border border-gray-300">
                  {{ item.nama}}
                </td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(item.total_nominal)  }}
                </td>
              </tr>

            </tbody>
          </table>
        </DashCard>

      </div>

      <div class="md:basis-1/2 overflow-x-auto">
        <DashCard>
          <div class="font-bold md:text-lg flex items-center gap-2 mb-3 text-emerald-700 dark:text-emerald-500">
            <Icon name="lucide:grid-2x2-check" /> Laporan Kas/Liquiditas
          </div>
          <table class="w-full table-auto border-collapse">
            <tbody>
              <tr v-for="item in dataTabel.likuiditas_pendapatan">
                <td class="py-2 px-3 border border-gray-300">
                  {{ item.nama}}
                </td>
                <td class="py-2 px-3 border border-gray-300 text-right">
                  {{ formatUang(item.total_nominal)  }}
                </td>
              </tr>
            </tbody>
          </table>
        </DashCard>
      </div>

    </div>

</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

definePageMeta({
    title: 'Laporan Perubahan Modal',
})
const client = useSanctumClient();

const route = useRoute();
const tanggal = ref(
  route.query.tanggal || dayjs().utc().local().format('YYYY-MM-DD') as any
)

const dataTabel = reactive({
  total_bersih: 0,
  modal_awal: 0,
  penambahan_modal: 0,
  saldo_akhir: 0,
  likuiditas_pendapatan: [],
  likuiditas_rekening: [],
} as any);

const isLoadingRefresh = ref(false);
async function refresh() {
  isLoadingRefresh.value = true;
  try {
    const response = await client('/api/laporan_perubahan_modal/'+dayjs(tanggal.value).utc().local().format('YYYY-MM-DD'));
    dataTabel.total_bersih = response.total_bersih;
    dataTabel.modal_awal = response.modal_awal;
    dataTabel.penambahan_modal = response.penambahan_modal;
    dataTabel.saldo_akhir = response.saldo_akhir;
    dataTabel.likuiditas_pendapatan = response.likuiditas_pendapatan;
    dataTabel.likuiditas_rekening = response.likuiditas_rekening;
  } catch (error) {
    console.error(error); 
  }
  isLoadingRefresh.value = false;
}

onMounted(() => {
  refresh(); 
})
</script>
