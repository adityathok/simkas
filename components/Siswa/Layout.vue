<template>

  <div v-if="fetchData">
    
    <div class="bg-sky-100 min-h-[5em] md:min-h-[6em] mb-10 mx-[-1.5rem] mt-[-1.5rem] px-6 pt-5 md:px-10 shadow-xs">        
        <div class="flex justify-start gap-3 items-center">
          <div>
            <div class="aspect-square bg-slate-100 rounded w-[5rem] md:w-[8rem]">
              <img v-if="data?.avatar_url" :src="data?.avatar_url" alt="" width="300" class="aspect-square object-cover rounded">
            </div>
          </div>
          <div class="ps-2">
            <h3 class="md:text-xl font-bold">
              {{ data?.nama||'-' }}
            </h3>
            <NuxtLink :to="'/kelas/'+data?.kelas?.id" class="text-sm hover:underline">
              {{ data?.kelas?.nama||'-' }} | {{ data?.kelas?.tahun_ajaran||'-' }}
            </NuxtLink>
          </div>
        </div>
        <AppMenuTabs :items="menus" :active="route.path" class="mt-2" />
      </div>
      
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

const menus = [
  {label: 'Profil', route: '/siswa/'+idUnit+'/'},
  {label: 'Edit', route: '/siswa/'+idUnit+'/edit'},
  // {label: 'Siswa', route: '/kelas/'+idUnit+'/pegawai'}
]

</script>