<template>

  <div v-if="fetchData">
    
    <div class="rounded min-h-[5em] md:min-h-[6em] mb-5 shadow-xs overflow-hidden bg-blue-100 dark:bg-zinc-800">        
        <div class="flex justify-start gap-3 items-center p-5">
          <div>
            <Button as="router-link" :to="'/siswa/'+idUnit+'/edit/foto'" variant="text" class="!p-0 w-[5rem] md:w-[8rem]" v-tooltip="'Ubah Foto'">
              <img v-if="data?.avatar_url" :src="data?.avatar_url" alt="" width="200" class="aspect-square object-cover rounded-sm">
            </Button>
          </div>
          <div class="ps-2">
            <h3 class="md:text-xl font-bold">
              {{ data?.nama||'-' }}
            </h3>

            <div>
              <NuxtLink v-if="data.kelas_siswa" :to="'/kelas/'+data?.kelas_siswa?.id" class="text-sm hover:underline">
                {{ data?.kelas_siswa?.nama||'-' }} | {{ data?.kelas_siswa?.tahun_ajaran||'-' }}
              </NuxtLink>
            </div>

          </div>
        </div>
        <div class="bg-blue-200 dark:bg-zinc-700">
          <AppMenuTabs :items="menus" :active="route.path" class="mt-2" />
        </div>
      </div>
      
      <slot/>

  </div>

  <div v-else class="flex flex-col justify-center items-center p-5">
    <Icon name="lucide:user-x"  size="4em"/>
    <h1 class="mt-3 mb-5 text-xl">! Data Siswa Tidak Ditemukan</h1>
    <Button as="router-link" to="/siswa">
      <Icon name="lucide:chevron-left"  /> Kembali
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
  {label: 'Kelas', route: '/siswa/'+idUnit+'/kelas'},
  {label: 'Tagihan', route: '/siswa/'+idUnit+'/tagihan'}
]

</script>