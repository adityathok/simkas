<template>
    
    <p v-if="loading">Memuat konfigurasi...</p>
    <p v-else-if="error" style="color: red;">Error: {{ error }}</p>

    <div v-if="configApp" class="flex items-center gap-2 max-w-[12rem]">
        <img v-if="configApp?.value?.logo" :src="configApp.value.logo" alt="Logo App" class="max-h-10">
        <img v-else src="~/public/logo.png" alt="Logo App" class="max-h-10">
        <div>
            <div class="text-sm font-bold">SIMKAS</div>
            <div class="text-xs">{{ configApp?.value?.lembaga }}</div>
        </div>
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

// Inisialisasi store
const configStore = useConfigStore();

// Ambil state dan action dari store
const { configApp, setConfig,loading, error } = configStore;
onMounted(() => {
    setConfig()
})

</script>