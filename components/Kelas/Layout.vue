<template>
  <Card>

    <template #header>
      <div class="bg-gradient-to-r from-gray-800 to-teal-800 min-h-[5em] md:min-h-[6em] rounded-t-xl text-white px-6 py-5">        
        <div class="md:flex justify-start md:justify-between gap-3 items-center">
            <div>
              <h3 class="text-3xl font-bold">
                {{ datas?.nama||'-' }}
              </h3>
              <small>
                {{ datas?.tahun_ajaran||'-' }}
              </small>
            </div>
            <div>
              {{ datas?.unit_sekolah.nama||'-' }}
            </div>
        </div>
      </div>
    </template>

    <template #content>
      <AppMenuTabs :items="menus" :active="route.path" class="mb-4" />
      <slot/>
    </template>

  </Card>
</template>

<script setup lang="ts">
const emit = defineEmits(['kelasdata'])
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const datas = ref({} as any)

try {
  const data = await client('/api/kelas/'+idUnit)
  datas.value = data
  emit('kelasdata', data)
} catch (e) {
  const err = useSanctumError(e);
  if(err.code == 404){
    navigateTo('/kelas')
  }
  console.log(err);
}

const menus = [
  {label: 'Profil', route: '/kelas/'+idUnit+'/'},
  {label: 'Edit', route: '/kelas/'+idUnit+'/edit'},
  // {label: 'Siswa', route: '/kelas/'+idUnit+'/pegawai'}
]

</script>