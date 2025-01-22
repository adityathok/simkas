<template>

  <Card>

    <template #header>
      <div class="bg-gradient-to-r from-cyan-500 to-blue-500 min-h-[5em] md:min-h-[8em] rounded-t-xl">
      </div>
    </template>

    <template #content>

      <div class="flex justify-start gap-3 items-center md:mt-[-3em]">
        <div>
          <img v-if="datas?.logo_url" :src="datas?.logo_url" alt="" class="rounded aspect-squarew-[5em] h-[5em] md:w-[9em] md:h-[9em]">
          <img v-else src="~/public/default-ava-unit.jpg" alt="" class="rounded aspect-squarew-[5em] h-[5em] md:w-[9em] md:h-[9em]">
        </div>
        <div class="md:pt-3">
          <div class="text-xl font-bold">{{ datas?.nama||'-' }}</div>
          <span class="text-sm opacity-60">{{ datas?.jenjang||'-' }} </span>
        </div>
      </div>

      <AppMenuTabs :items="menus" :active="route.path" class="mt-5 mb-4" />

    <slot />

    </template>
  </Card>

</template>

<script setup lang="ts">
const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();
const datas = ref({} as any)

try {
  const data = await client('/api/unitsekolah/'+idUnit)
  datas.value = data
} catch (e) {
  const err = useSanctumError(e);
  if(err.code == 404){
    navigateTo('/unitsekolah')
  }
  console.log(err);
}

const menus = [
  {label: 'Profil', route: '/unitsekolah/'+idUnit+'/'},
  {label: 'Edit', route: '/unitsekolah/'+idUnit+'/edit'},
  {label: 'Pegawai', route: '/unitsekolah/'+idUnit+'/pegawai'}
]

</script>
