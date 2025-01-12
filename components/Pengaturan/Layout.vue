<template>
  <div>
    <Card>
      <template #content>

        <div class="flex flex-col md:flex-row min-h-[80vh]">
          <div class="md:basis-1/4 lg:basis-1/5 md:pr-5">

            <div class="overflow-x-auto">
              <div class="flex md:flex-col mb-3">
                <div v-for="menu in menus" :key="menu.href" class="flex-1 md:basis-full">
                  <NuxtLink :to="menu.href" class="block rounded mr-1 md:mb-1 py-2 px-4 text-slate-500 hover:text-slate-900 hover:bg-gray-100 border border-slate-50" :class="{ 'bg-gray-100 text-slate-900 border-slate-200': isActive(menu.href) }">
                    {{ menu.label }}
                  </NuxtLink>
                </div>
              </div>
            </div>

          </div>
          <div class="md:flex-1">

            <h3 class="font-bold text-xl">
              {{ $route.meta.caption }}
            </h3>
            <hr class="mt-2 mb-5">
            <slot name="content" />
          </div>
        </div>

      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
//route, cek halaman aktif
const route = useRoute()
const isActive = (path: string) => {
  return route.path === path
}

const menus = [
  {label: 'Lembaga', href: '/pengaturan'},
  {label: 'Jenjang', href: '/pengaturan/jenjang'},
  {label: 'Jabatan', href: '/pengaturan/jabatan'},
]

</script>
