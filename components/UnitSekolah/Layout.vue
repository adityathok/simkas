<template>

  <Card>

    <template #header>
      <div class="bg-slate-900 min-h-[5em] md:min-h-[8em] rounded-t-xl">
      </div>
    </template>

    <template #content>

      <div class="flex justify-start gap-3 items-center md:mt-[-3em]">
        <div>
          <img src="~/public/default-ava-unit.jpg" alt="" class="rounded aspect-squarew-[5em] h-[5em] md:w-[9em] md:h-[9em]">
        </div>
        <div class="md:pt-3">
          <div class="text-xl font-bold">{{ data.nama }}</div>
          <span class="text-sm opacity-60">{{ data.jenjang }} </span>
        </div>
      </div>

      <Tabs value="/" class="my-5" scrollable>
        <TabList>
            <Tab v-for="tab in menus" :key="tab.label" :value="tab.route">
                <!-- <router-link v-if="tab.route" v-slot="{ href, navigate }" :to="tab.route" custom>
                    <a v-ripple :href="href" @click="navigate" class="flex items-center gap-2 text-inherit">
                        <span>{{ tab.label }}</span>
                    </a>
                </router-link> -->
                <NuxtLink :to="tab.route" class="flex items-center gap-2 text-inherit">
                    <span>{{ tab.label }}</span>
                </NuxtLink>
            </Tab>
        </TabList>
    </Tabs>

    <slot />

    </template>
  </Card>

</template>

<script setup lang="ts">
import { Avatar } from 'primevue';

const route = useRoute()
const idUnit = route.params.id
const client = useSanctumClient();

const { data, status, error, refresh } = await useAsyncData(
    'unitsekolah-'+idUnit,
    () => client('/api/unitsekolah/'+idUnit)
)

const menus = [
  {label: 'Profil', route: '/unitsekolah/'+idUnit+'/'},
  {label: 'Edit', route: '/unitsekolah/'+idUnit+'/edit'},
  // {label: 'Info', route: '/unitsekolah/'+idUnit+'/info'},
  // {label: 'Alamat', route: '/unitsekolah/'+idUnit+'/alamat'},
]

</script>
