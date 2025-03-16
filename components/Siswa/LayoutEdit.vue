<template>

  <SiswaLayout>
    <Card>
      <template #content>
        <div class="flex flex-col md:flex-row min-h-[50vh]">
          <div class="md:basis-1/5 lg:basis-1/6">

            <Menu :model="items" class="hidden md:block">              
              <template #item="{ item, props }">
                <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
                  <a v-ripple :href="href" v-bind="props.action" @click="navigate" :class="{'bg-gray-100 border-slate-200': isRouteActive(item.route) }">
                      <Icon v-if="item.icon" :name="item.icon"  :ssr="true" class="me-1"/>
                      <span>{{ item.label }}</span>
                  </a>
                </router-link>
              </template>
            </Menu>

            <Button @click="visible = true" severity="info" class="w-full mb-4 md:hidden!">
              <Icon name="lucide:settings" />
              Menu Edit Siswa
            </Button>

          </div>
          <div class="md:flex-1 md:ps-10">
            <slot/>
          </div>
        </div>
      </template>
    </Card>
  </SiswaLayout>

  <Dialog v-model:visible="visible" modal header="Menu Edit Profile" :style="{ width: '25rem' }">
    <Menu :model="items" class="md:hidden">              
      <template #item="{ item, props }">
        <router-link v-if="item.route" v-slot="{ href, navigate }" :to="item.route" custom>
          <a v-ripple :href="href" v-bind="props.action" @click="navigate" :class="{'bg-gray-100 border-slate-200': isRouteActive(item.route) }">
              <Icon v-if="item.icon" :name="item.icon"  :ssr="true" class="me-1"/>
              <span>{{ item.label }}</span>
          </a>
        </router-link>
      </template>
    </Menu>
  </Dialog>

</template>

<script setup lang="ts">
const route = useRoute()
const idUnit = route.params.id
const items = ref([
    {
        label: 'Profil',
        route: '/siswa/'+idUnit+'/edit',
        icon: 'lucide:user'
    },
    {
        label: 'Alamat',
        route: '/siswa/'+idUnit+'/edit/alamat',
        icon: 'lucide:map'
    },
    {
        label: 'Informasi',
        route: '/siswa/'+idUnit+'/edit/informasi',
        icon: 'lucide:info'
    },
    {
        label: 'Wali',
        route: '/siswa/'+idUnit+'/edit/infowali',
        icon: 'lucide:users-round'
    },
    {
        label: 'Foto',
        route: '/siswa/'+idUnit+'/edit/foto',
        icon: 'lucide:square-user'
    },
    {
        label: 'Kelas',
        route: '/siswa/'+idUnit+'/edit/kelas',
        icon: 'lucide:notebook'
    }
]);
const visible = ref(false);

const isRouteActive = (path: string) => {
  return route.path === path;
}

</script>
