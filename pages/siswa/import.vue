<template>
  <div>
    

    <div class="bg-white p-4 rounded-xl mb-3">
      <h3 class="mb-1 font-semibold">Upload File CSV</h3>
      <Input type="file" @change="handleFileUpload" accept=".csv" class="file:mr-4 file:rounded-xl file:border-0 file:bg-violet-500 file:text-white  file:px-4 file:py-2 file:text-sm file:font-semibold hover:file:text-violet-700 hover:file:bg-violet-100 bg-white p-1 rounded-xl border border-violet-900 file:cursor-pointer" />
    </div>

    <div v-if="csvData.length > 0">
      <h3 class="mb-1 font-semibold">Data dari CSV:</h3>

      <div class="text-end mb-2">
        <Button @click="prosesImport">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-cloud-upload"><path d="M12 13v8"/><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="m8 17 4-4 4 4"/></svg>
          Proses Import
        </Button>
      </div>

      <div class="overflow-x-scroll text-start max-w-[76vw] text-sm md:text-xs shadow-sm p-2 rounded bg-white">
        <table>
          <thead>
            <tr>
              <th v-for="(header, index) in csvHeaders" :key="index" class="bg-slate-700 text-white p-2">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in csvData" :key="rowIndex" class="even:bg-slate-100 odd:bg-white text-slate-600">
              <td v-for="(cell, cellIndex) in row" :key="cellIndex" class="py-1 px-2">
                {{ cell }}

                <div v-if="row.status == 'pending'">
                  Pending
                </div>

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

const handleFileUpload = (event: any) => {
  const file = event.target.files[0];
  Papa.parse(file, {
    header: true, // Menggunakan baris pertama sebagai header
    skipEmptyLines: true,
    complete: (results: any) => {
      csvData.value = results.data.map((row: any) => ({...row, status: 'pending'})); // Simpan data CSV
      csvHeaders.value = Object.keys(results.data[0] || {}); // Ambil header
    },
    error: (error: any) => {
      console.error('Error parsing CSV:', error);
    },
  });
}

const prosesImport = async (data: any) => {
  try {
    const res = await client('/api/siswa/import', {
      method: 'POST',
      body: data
    })
  } catch (error) {
    console.error('Error parsing CSV:', error);
  }
}

</script>
