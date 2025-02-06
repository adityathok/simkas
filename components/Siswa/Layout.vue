<template>
  <Card>

    <template #header>
      <div class="bg-gradient-to-tr from-sky-100 to-purple-200 min-h-[5em] md:min-h-[6em] rounded-t-xl px-6 py-5">        
        <div class="flex justify-start gap-3 items-center">
          <div>
            <div class="aspect-square bg-slate-100 rounded min-w-[5rem] md:min-w-[8rem]">

            </div>
          </div>
            <div>
              <h3 class="md:text-xl font-bold">
                {{ datas?.nama||'-' }}
              </h3>
              <small>
                {{ datas?.kelas?.nama||'-' }} | {{ datas?.kelas?.tahun_ajaran||'-' }}
              </small>
            </div>
        </div>
      </div>
    </template>

    <template #content>
      <AppMenuTabs :items="menus" :active="route.path" class="mb-4 mx-[-1rem] mt-[-1rem]" />
      <slot/>
    </template>

  </Card>
</template>

<script setup lang="ts">
  const emit = defineEmits(['siswadata'])
  const route = useRoute()
  const idUnit = route.params.id
  const client = useSanctumClient();
  const datas = ref({} as any)

try {
  const data = await client('/api/siswa/'+idUnit)
  datas.value = data
  emit('siswadata', data)
} catch (e) {
  const err = useSanctumError(e);
  if(err.code == 404){
    navigateTo('/siswa')
  }
  console.log(err);
}

const menus = [
  {label: 'Profil', route: '/siswa/'+idUnit+'/'},
  {label: 'Edit', route: '/siswa/'+idUnit+'/edit'},
  // {label: 'Siswa', route: '/kelas/'+idUnit+'/pegawai'}
]

</script>