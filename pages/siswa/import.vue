<template>
  <div>
    
    <div class="bg-white p-4 rounded-xl mb-3">
      <h3 class="mb-1 font-semibold">Upload File CSV</h3>
      <input type="file" @change="handleFileUpload" accept=".csv" class="file:mr-4 file:rounded-xl file:border-0 file:bg-violet-500 file:text-white  file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:text-violet-700 hover:file:bg-violet-100 bg-white p-1 rounded-xl border border-violet-900 file:cursor-pointer" />
    </div>

    <div v-if="csvData.length > 0">
      <h3 class="mb-1 font-semibold">Data dari CSV:</h3>

      <div class="mb-2">
        <Button @click="prosesImport">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>
          Proses Import
        </Button>
      </div>

      <div v-if="processedRows > 0" class="my-5 bg-white p-4 rounded-xl border border-dashed border-amber-200">
        <ProgressBar :value="progressPercentage">
          {{ (Math.round(progressPercentage*100)/100) }}%
        </ProgressBar>
        <span class="text-xs"> {{ processedRows }} dari {{ totalRows }} baris telah diproses. <span class="text-green-700 font-bold">{{ successRows }} baris berhasil diimport.</span></span>
        <Message severity="warn" class="mt-2">
          Mohon jangan menutup halaman ini sampai proses selesai.
        </Message>
      </div>

      <div class="overflow-scroll text-start max-h-[50vh] max-w-[76vw] text-sm md:text-xs shadow-sm p-2 rounded bg-white">
        <table>
          <thead>
            <tr>
              <th class="bg-slate-700 text-white p-2">Status</th>
              <th v-for="(header, index) in csvHeaders" :key="index" class="bg-slate-700 text-white p-2">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in csvData" :key="rowIndex" class="even:bg-slate-100 odd:bg-white text-slate-600" :class="[{'text-green-700': row.statusrow === 'success' }]">
              <td>
                <span v-if="row.statusrow !== 'pending'" class="py-1 px-2" :class="[row.statusrow === 'success' ? 'text-green-700' : 'text-red-700']">
                  {{ logs[rowIndex] }}
                </span>
              </td>
              <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="py-1 px-2">
                {{ cell }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<script setup lang="ts">
import Papa from 'papaparse';
definePageMeta({
  title: 'Import Data Siswa',
})

const client = useSanctumClient();
const csvData = ref({} as any)
const csvHeaders = ref({} as any)
const logs = ref([] as any)
const totalRows = ref(0)
const processedRows = ref(0)
const successRows = ref(0)
const progressPercentage = ref(0)

const handleFileUpload = (event: any) => {

  csvData.value = [];
  csvHeaders.value = [];
  logs.value = [];

  const file = event.target.files[0];
  Papa.parse(file, {
    header: true, // Menggunakan baris pertama sebagai header
    skipEmptyLines: true,
    transformHeader: (header) => {
      // Ubah header menjadi huruf kecil dan ganti spasi dengan underscore
      return header.toLowerCase().replace(/\s+/g, '_');
    },
    complete: (results: any) => {
      csvData.value = results.data.map((row: any) => ({...row, statusrow: 'pending'})); // Simpan data CSV
      csvHeaders.value = Object.keys(results.data[0] || {}); // Ambil header
    },
    error: (error: any) => {
      console.error('Error parsing CSV:', error);
    },
  });
}

computed(() => {
  progressPercentage.value = (processedRows.value / totalRows.value) * 100
})

watch(() => csvData.value, () => {
  totalRows.value = csvData.value.length
  processedRows.value = csvData.value.filter((row: any) => row.statusrow === 'success').length
})
watch(() => logs.value.length, () => {
  totalRows.value = csvData.value.length
  processedRows.value = logs.value.length
  successRows.value = csvData.value.filter((row: any) => row.statusrow === 'success').length
  progressPercentage.value = (processedRows.value / totalRows.value) * 100
})

const prosesImport = async () => {
  for(const row of csvData.value) {

    if(row.statusrow === 'failed') {
      continue;
    }

    if(row.nis === '') {
      row.statusrow = 'failed';
      logs.value.push('NIS tidak boleh kosong')
      continue;
    }

    try {
      if (row.statusrow === 'pending') {
        row.statusrow = 'process';
        await sendImport(row);
        row.statusrow = 'success';
        logs.value.push('Berhasil')
      }
    } catch (error) {
      row.statusrow = 'failed';
      console.error('Gagal mengirim baris:', row, error);
      logs.value.push('Gagal')
    }
  }
}

const sendImport = async (data: any) => {
  try {
    const res = await client('/api/siswa_import', {
      method: 'POST',
      body: data
    })
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }
}

</script>
