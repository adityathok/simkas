<template>
    <div class="flex flex-col md:flex-row gap-2 border-2 rounded-md bg-white shadow-sm">
      
      <div class="md:basis-1/2 border-b-2 md:border-r-2 min-h-52 p-4">

        <div class="flex justify-start items-center gap-2">
          <Select v-model="tahunFrom" :options="optionTahunAjaran" optionLabel="label" optionValue="value"/>
        </div>

      </div>
      <div class="md:basis-1/2 min-h-52 p-4">
        <div class="flex justify-start items-center gap-2">
          <Select v-model="tahunTo" :options="optionTahunAjaran" optionLabel="label" optionValue="value"/>
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

</script>