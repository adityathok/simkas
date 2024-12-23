<template>
  
    <div class="relative h-full md:flex min-h-svh w-full bg-gray-100">

            <AppSidebar />

            <main class="relative min-h-svh flex-1 p-5 md:pt-3 md:p-6 md:pb-10 pb-10">
                
                <AppHeader />

                <slot />

                <AppFooter />
                
            </main>


    </div>

</template>