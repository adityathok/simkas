<template>
  <div>
    <Card>
      <template #content>

        <div class="flex flex-col md:flex-row min-h-[80vh]">
          <div class="md:basis-1/4 lg:basis-1/5 md:pr-10">

            <div class="overflow-x-auto mb-5">
              <div class="flex md:flex-col mb-3 text-nowrap">
                <div v-for="menu in menus" :key="menu.href" class="border-b flex-1 md:basis-full py-1">
                  <NuxtLink :to="menu.href" class="flex justify-start items-center rounded-sm py-2 px-4 hover:text-sky-700 hover:bg-gray-100" :class="{ 'bg-gray-100 text-sky-600 border-slate-200': isActive(menu.href) }">
                    
                    <Icon v-if="menu.icon" :name="menu.icon"  :ssr="true" class="mr-2"/>
                    <span>{{ menu.label }}</span>
                    
                  </NuxtLink>
                </div>
              </div>
            </div>

          </div>
          <div class="md:flex-1">

            <h3 class="font-bold text-xl">
              {{ $route.meta.caption }}
            </h3>
            <hr class="mt-2 mb-5 md:mb-10">
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
  {label: 'Lembaga', href: '/pengaturan',icon: 'lucide:landmark',},
  {label: 'Tahun Ajaran', href: '/pengaturan/tahunajaran',icon: 'lucide:calendar-clock',},
  {label: 'Jenjang', href: '/pengaturan/jenjang',icon: 'lucide:layers',},
  {label: 'Jabatan', href: '/pengaturan/jabatan',icon: 'lucide:book-user',},
]

</script>
