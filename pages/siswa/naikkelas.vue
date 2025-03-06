<template>
    <div class="flex flex-col md:flex-row gap-2 border-2 rounded-md bg-white shadow-sm">
      
      <div class="md:basis-1/2 border-b-2 md:border-b-0 md:border-r-2 min-h-[40rem] p-4 relative">

        <div class="hidden md:block absolute z-1 end-[50%] md:end-[-1.5em] top-[50%]">
          <span class="bg-white p-2 inline-block">
            <Icon name="lucide:square-chevron-right" mode="svg" size="2rem" class="opacity-50"/>
          </span>
        </div>

        <h3 class="font-bold mb-3">
          Dari Kelas
        </h3>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm mb-1 opacity-50">Tahun Ajaran</label>
            <Select v-model="tahunFrom" :options="optionTahunAjaran" optionLabel="label" optionValue="value" class="w-full"/>
          </div>
          <div>
            <label class="block text-sm mb-1 opacity-50">Unit Sekolah</label>
            <Select v-model="unitFrom" :options="optionUnit" optionLabel="label" optionValue="value" class="w-full"/>
          </div>       
          <div class="col-span-2">
            <label class="block text-sm mb-1 opacity-50">
              Kelas
              <Icon v-if="sKelasFrom=='pending'" name="lucide:loader" mode="svg" class="inline animate-spin"/>
            </label>
            <Select v-if="optionKelasFrom.length > 0" v-model="kelasFrom" :options="optionKelasFrom" optionLabel="label" optionValue="value" class="w-full"/>
            <div v-else class="bg-slate-100 text-slate-300 p-2 rounded-md">Kelas tidak tersedia</div>
          </div>
        </div>

        <DataTable v-model:selection="selectedKelasFrom" :value="siswaFrom" class="text-sm" stripedRows scrollable>
          <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
          <Column field="nama" header="Nama" />
        </DataTable>

        <div class="text-end mt-2">
          <Button @click="handleMoveSiswa">
            Pindahkan 
            <Icon v-if="isLoading" name="lucide:loader" mode="svg" class="animate-spin" />
            <Icon v-else name="lucide:circle-arrow-out-up-right" mode="svg" />
          </Button>
        </div>

      </div>
      <div class="md:basis-1/2 p-4 min-h-[40rem]">

        <h3 class="font-bold mb-3">
          Ke Kelas
        </h3>
        
        <div class="grid grid-cols-2 gap-2">
          <div>
            <label class="block text-sm mb-1 opacity-50">Tahun Ajaran</label>
            <Select v-model="tahunTo" :options="optionTahunAjaran" optionLabel="label" optionValue="value" class="w-full"/>
          </div>
          <div>
            <label class="block text-sm mb-1 opacity-50">Unit Sekolah</label>
            <Select v-model="unitTo" :options="optionUnit" optionLabel="label" optionValue="value" class="w-full"/>
          </div>
          <div class="col-span-2">
            <label class="block text-sm mb-1 opacity-50">
              Kelas
              <Icon v-if="sKelasTo=='pending'" name="lucide:loader" mode="svg" class="inline animate-spin"/>
            </label>
            <Select v-if="optionKelasTo.length > 0" v-model="kelasTo" :options="optionKelasTo" optionLabel="label" optionValue="value" class="w-full"/>
            <div v-else class="bg-slate-100 text-slate-300 p-2 rounded-md">Kelas tidak tersedia</div>
          </div>
        </div>
      
        <DataTable :value="siswaTo" class="text-sm" stripedRows scrollable>
          <Column field="nama" header="Nama" />
        </DataTable>

      </div>
      
    </div>
</template>

<script setup lang="ts">
definePageMeta({
  title: 'Naik Kelas',
})
const client = useSanctumClient()

const tahunFrom = ref('')
const tahunTo = ref('')
const { data:optionTahunAjaran } = await useAsyncData(
    'option-tahun_ajaran',
    () => client('/api/option/tahun_ajaran')
)
//jika optionTahunAjaran sudah dapat
onMounted(() => {
  tahunFrom.value = optionTahunAjaran.value.find((item: { active: number; }) => item.active === 1)?.value || '';
  tahunTo.value = optionTahunAjaran.value.find((item: { active: number; }) => item.active === 1)?.value || '';
})

const unitFrom = ref('')
const unitTo = ref('')
const { data:optionUnit} = await useAsyncData(
    'option-unitsekolah',
    () => client('/api/option/unitsekolah')
)

const kelasFrom=ref('')
const kelasTo=ref('')

const optionKelasFrom = ref({} as any)
const { data: oKelasFrom, status: sKelasFrom, refresh: refreshoptionKelasFrom } = await useAsyncData(
    'data-kelasFrom',
    () => client('/api/option/kelas',{
      params: {
        tahun_ajaran: tahunFrom.value,
        unit_sekolah: unitFrom.value
      }
    })
)

//watch tahunFrom & unitFrom
watch(() => tahunFrom.value, () => {
  refreshoptionKelasFrom()
})
watch(() => unitFrom.value, () => {
  refreshoptionKelasFrom()
})
watch(() => oKelasFrom.value, () => {
  optionKelasFrom.value = oKelasFrom.value
})


const optionKelasTo = ref({} as any)
const { data: oKelasTo, status: sKelasTo, refresh: refreshoptionKelasTo } = await useAsyncData(
    'data-KelasTo',
    () => client('/api/option/kelas',{
      params: {
        tahun_ajaran: tahunTo.value,
        unit_sekolah: unitTo.value
      }
    })
)

const { data: siswaFrom, status: sSiswaFrom, refresh: fSiswaFrom } = await useAsyncData('siswafrom', () =>
    client('/api/siswakelas/'+kelasFrom.value)
);
//watch kelasFrom
watch(() => kelasFrom.value, () =>{
  fSiswaFrom()
})

//watch tahunTo & unitTo
watch(() => tahunTo.value, () => {
  refreshoptionKelasTo()
})
watch(() => unitTo.value, () => {
  refreshoptionKelasTo()
  fSiswaFrom()
})
watch(() => oKelasTo.value, () => {
  optionKelasTo.value = oKelasTo.value
})

const selectedKelasFrom = ref();

const { data: siswaTo, status: ssiswaTo, refresh: fSiswaTo } = await useAsyncData('siswato', () =>
    client('/api/siswakelas/'+kelasTo.value)
);
//watch kelasTo
watch(() => kelasTo.value, () =>{
  fSiswaTo()
})

const toast = useToast();
const isLoading = ref(false)

const handleMoveSiswa = async () => {
  if(selectedKelasFrom.value){

    isLoading.value = true

    //ambil id siswa nya saja
    const siswaIds = selectedKelasFrom.value.map((item: { id: any, user_id: any }) => ({
      user_id: item.user_id,
      siswa_id: item.id
    }));
    
    try {
      await client('/api/siswakelas/naik_kelas', {
        method: 'POST',
        body: {
          siswa: siswaIds,
          kelas_from: kelasFrom.value,
          kelas_to: kelasTo.value
        }
      })
      toast.add({ severity: 'success', summary: 'Berhasil', detail: 'Perubahan berhasil disimpan', life: 3000 });
    } catch (er) {
      const e = useSanctumError(er);
      console.log(e.bag);
      toast.add({ severity: 'error', summary: 'Gagal', detail: 'Perubahan gagal disimpan', life: 3000 });
    }
    isLoading.value = false
  }
}

</script>