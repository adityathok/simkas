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
//watch tahunTo & unitTo
watch(() => tahunTo.value, () => {
  refreshoptionKelasTo()
})
watch(() => unitTo.value, () => {
  refreshoptionKelasTo()
})
watch(() => oKelasTo.value, () => {
  optionKelasTo.value = oKelasTo.value
})

</script>