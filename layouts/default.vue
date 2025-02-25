<template>
  
    <div class="relative h-full md:flex min-h-svh w-full bg-gray-100">

            <AppSidebar />

            <main class="relative min-h-svh flex-1 md:max-w-[calc(100%-14rem)]">
                
                <AppHeader />

                <div class="p-5 md:pt-3 md:p-6 md:pb-10 pb-10">
                    <slot />
                </div>

                <AppFooter />
                
            </main>


    </div>

</template>

<script setup lang="ts">
  const client = useSanctumClient(); 
  const { setInfoApp,infoApp } = useGlobalStore()   
  const { data } = await useAsyncData(
      'app',
      () => client('/infoapp')
  )
  setInfoApp(data.value)
</script>