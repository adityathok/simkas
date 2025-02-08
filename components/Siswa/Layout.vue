<template>

  <div v-if="fetchData">    
    <div class="bg-gradient-to-tr from-sky-100 to-sky-200 min-h-[5em] md:min-h-[6em] mb-3 rounded-xl px-6 py-5 shadow-sm">        
        <div class="flex justify-start gap-3 items-center">
          <div>
            <div class="aspect-square bg-slate-100 rounded min-w-[5rem] md:min-w-[8rem]">

            </div>
          </div>
            <div>
              <h3 class="md:text-xl font-bold">
                {{ data?.nama||'-' }}
              </h3>
              <div class="text-sm">
                {{ data?.kelas?.nama||'-' }} | {{ data?.kelas?.tahun_ajaran||'-' }}
              </div>
            </div>
        </div>
      </div>
      <AppMenuTabs :items="menus" :active="route.path" class="mb-4" />
      
      <slot/>

  </div>

  <div v-else class="flex flex-col justify-center items-center p-5">
    <Icon name="lucide:user-x" mode="svg" size="4em"/>
    <h1 class="mt-3 mb-5 text-xl">! Data Siswa Tidak Ditemukan</h1>
    <Button as="router-link" to="/siswa">
      <Icon name="lucide:chevron-left" mode="svg" /> Kembali
    </Button>
  </div>

</template>

<script setup lang="ts">
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const data = ref({} as any)

const { data: fetchData, status, error, refresh } = await useAsyncData(
  'siswa-'+idUnit,
  () => client('/api/siswa/'+idUnit)
)

 // Ensure data is reactive
 data.value = fetchData.value

// Confirm reactivity setup
// console.log('Initial data:', data.value)

//emit
// const emit = defineEmits(['siswadata'])
watch(fetchData, (newValue) => {
  console.log('Watch:',newValue)
  // emit('siswadata', 'KIKIRI')
})

const menus = [
  {label: 'Profil', route: '/siswa/'+idUnit+'/'},
  {label: 'Edit', route: '/siswa/'+idUnit+'/edit'},
  // {label: 'Siswa', route: '/kelas/'+idUnit+'/pegawai'}
]

</script>