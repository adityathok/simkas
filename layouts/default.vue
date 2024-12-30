<template>
  
    <div class="relative h-full md:flex min-h-svh w-full bg-gray-100">

            <AppSidebar />

            <main class="relative min-h-svh flex-1 p-5 md:pt-3 md:p-6 md:pb-10 pb-10 md:max-w-[calc(100%-14rem)]">
                
                <AppHeader />

                <h1 class="text-lg font-medium text-gray-900 mb-5">
                    {{ $route.meta.title }}
                </h1>

                <slot />

                <AppFooter />
                
            </main>


    </div>

</template>

<script>
</script>