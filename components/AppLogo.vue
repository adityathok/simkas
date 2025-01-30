<template>
    
    <div v-if="infoApp" class="flex items-center gap-2">
        <img src="~/public/logo.png" alt="Logo App" class="max-h-10">
        <span class="text-sm">{{ infoApp?.lembaga }}</span>
    </div>
    
    <div v-else>
        <div class="fixed top-0 end-0 start-0 bottom-0 flex justify-center items-center backdrop-blur-sm z-50">
            <ProgressSpinner strokeWidth="8" />
        </div>
    </div>

</template>

<script setup lang="ts">
    const { infoApp } = useGlobalStore()
</script>