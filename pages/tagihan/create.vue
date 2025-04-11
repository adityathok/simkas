<template>

<Card>
  <template #content>
    <div class="flex flex-col md:flex-row">

      <div class="md:basis-1/4">
          <div class="grid grid-cols-1 gap-2 border-2 border-sky-100 shadow rounded-xl md:mr-5 p-5">
            <div v-for="(item,i) in fieldsUser" class="pb-2 border-b">
              <label class="block mb-1">
                {{ item.label }}
                <span v-if="item.key == 'kelas_id' && stKelas == 'pending'" class="text-xs text-slate-300 ms-1">Loading..</span>
                <span v-if="item.key == 'user_id' && stSiswa == 'pending'" class="text-xs text-slate-300 ms-1">Loading..</span>
              </label>
              <div>

                <Select v-if="item.key == 'tahun_ajaran'" v-model="forms[item.key]" :options="optionsData?.tahun_ajaran" optionLabel="label" optionValue="value" class="w-full" placeholder="Pilih Tahun Ajaran"/>
                <Select v-else-if="item.key == 'unit_sekolah_id'" v-model="forms[item.key]" :options="optionsData?.unitsekolah" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Sekolah"/>
                <Select v-else-if="item.key == 'kelas_id'" v-model="forms[item.key]" :options="optionKelas" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Kelas"/>
                <Select v-else-if="item.key == 'user_id'" v-model="forms[item.key]" :options="optionSiswa" optionLabel="label" optionValue="value" class="w-full" placeholder="Semua Siswa"/>

              </div>
            </div>
          </div>
        </div>
        <div class="md:flex-1">

          <div class="p-3 border border-emerald-200 bg-emerald-50 rounded-xl flex items-center gap-2">
            <Icon name="lucide:users" />
            <span class="text-lg font-bold">
              {{ countSiswa.total }} siswa
            </span>
          </div>

        </div>

    </div>
  </template>
</Card>

</template>

<script setup lang="ts">
definePageMeta({
  title: 'Tambah Tagihan',
})

const { tahunAjaran, tahunMulai, tahunSelesai } = useTahunAjaran();
const { configApp } = useConfigStore()
const client = useSanctumClient();
const isLoading = ref(false)
const toast = useToast();

const forms = ref({
  tahun_ajaran: configApp?configApp.value?.tahun_ajaran:tahunAjaran,
  unit_sekolah_id:'',
  kelas_id: '',
  user_id:''
} as any)

const { data:optionKelas,status: stKelas,refresh:roKelas } = await useAsyncData(
    'option-kelas',
    () => client('/api/option/kelas',{
      params:{        
        tahun_ajaran: forms.value.tahun_ajaran,
        unit_sekolah: forms.value.unit_sekolah_id
      }
    })
)
const { data:optionSiswa,status: stSiswa, refresh:roSiswa } = await useAsyncData(
    'option-siswa',
    () => client('/api/option/siswakelas',{
      params:{
        kelas_id: forms.value.kelas_id
      }
    })
)
const { data:optionsData } = await useAsyncData(
    'option-rekening',
    () => client('/api/options',{
      params:{
        keys: 'tahun_ajaran,unitsekolah,akunrekening,akunpendapatan,akunpengeluaran'
      }
    })
)

const { data:countSiswa, refresh: reCountSiswa } = await useAsyncData(
    'count-siswa',
    () => client('/api/countsiswa',{
      params:{
        tahun_ajaran: forms.value.tahun_ajaran,
        unit_sekolah_id: forms.value.unit_sekolah_id,
        kelas_id: forms.value.kelas_id
      }
    })
)

//watch kelas
watch(() => [forms.value.tahun_ajaran,forms.value.unit_sekolah_id], () => {
  roKelas()
  forms.value.kelas_id = ''
})
//watch count siswa
watch(() => [forms.value.tahun_ajaran,forms.value.unit_sekolah_id,forms.value.kelas_id], () => {
  reCountSiswa()
})

const fieldsUser = [
  {key:'tahun_ajaran',label:'Tahun Ajaran',options:[''] },
  {key:'unit_sekolah_id',label:'Sekolah',options:['']},
  {key:'kelas_id',label:'Kelas',options:optionKelas},
  {key:'user_id',label:'Siswa',options:optionSiswa},
]

</script>

