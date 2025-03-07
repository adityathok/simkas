<template>
    
    <div v-if="infoApp" class="flex items-center gap-2 max-w-[11rem]">
        <img src="~/public/logo.png" alt="Logo App" class="max-h-10">
        <span class="text-sm font-bold">{{ infoApp?.lembaga }}</span>
    </div>
    
    <div v-else>
        <div class="fixed top-0 end-0 start-0 bottom-0 flex justify-center items-center backdrop-blur-xs z-50 p-3">
            
            <div class="bg-white p-4 border border-yellow-400 rounded-sm shadow-sm text-center">
                <div>
                    <ProgressSpinner strokeWidth="4" />
                </div>
                Sepertinya ada kesalahan pada server.
                <br>Silahkan muat ulang halaman, atau hubungi admin
            </div>
        </div>
    </div>

</template>

<script setup lang="ts">
    const { infoApp } = useGlobalStore()
</script>