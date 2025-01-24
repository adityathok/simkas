<template>

  <Card>

    <template #header>
      <div class="bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-slate-800 via-slate-700 to-slate-800 min-h-[5em] md:min-h-[8em] rounded-t-xl text-white p-5">
        
        <div class="flex justify-start gap-3 items-center">
          <div>
            <img v-if="datas?.logo_url" :src="datas?.logo_url" alt="" class="aspect-square object-cover rounded w-[3em] h-[3em] md:w-[6em] md:h-[6em]">
            <img v-else src="~/public/default-ava-unit.jpg" alt="" class="aspect-square object-cover rounded w-[3em] h-[3em] md:w-[6em] md:h-[6em]">
          </div>
          <div class="md:pt-3">
            <div class="text-xl font-bold">{{ datas?.nama||'-' }}</div>
            <span class="text-sm opacity-60">{{ datas?.jenjang||'-' }} </span>
          </div>
        </div>

      </div>
    </template>

    <template #content>

      <AppMenuTabs :items="menus" :active="route.path" class="mb-4" />

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
