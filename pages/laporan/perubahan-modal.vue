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
        <table class="w-full table-auto border-collapse">
          <tbody>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Modal Awal</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.modal_awal)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Laba/Rugi Bersih</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.total_bersih)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Penambahan Modal</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.penambahan_modal)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Modal Akhir</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.saldo_akhir)  }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="md:basis-1/2 overflow-x-auto">
        <table class="w-full table-auto border-collapse">
          <tbody>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Modal Awal</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.modal_awal)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Laba/Rugi Bersih</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.total_bersih)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Penambahan Modal</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.penambahan_modal)  }}
              </td>
            </tr>
            <tr>
              <td class="py-2 px-3 border border-gray-300">Modal Akhir</td>
              <td class="py-2 px-3 border border-gray-300">
                {{ formatUang(dataTabel.saldo_akhir)  }}
              </td>
            </tr>
          </tbody>
        </table>
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
} as any);

const isLoadingRefresh = ref(false);
async function refresh() {
  isLoadingRefresh.value = true;
  try {
    const response = await client('/api/laporan_perubahan_modal/'+dayjs(tanggal.value).utc().local().format('YYYY-MM-DD'));
    // dataTabel.data = response.data;
    // dataTabel.total_pendapatan = response.total_pendapatan;
    // dataTabel.total_pengeluaran = response.total_pengeluaran;
    // dataTabel.total_bersih = response.total_bersih;
    // dataTabel.modal_awal = response.modal_awal;
    // dataTabel.saldo_akhir = response.saldo_akhir;
  } catch (error) {
    console.error(error); 
  }
  isLoadingRefresh.value = false;
}

onMounted(() => {
  refresh(); 
})
</script>
