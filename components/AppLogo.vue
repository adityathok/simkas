<template>
    <div class="flex items-center gap-2">
        <img src="~/public/logo.png" alt="Logo App" class="max-h-10">
        <span class="text-sm">{{ data.lembaga }}</span>
    </div>
</template>

<script setup lang="ts">
    const client = useSanctumClient();    
    const { data, status, error, refresh } = await useAsyncData(
        'app',
        () => client('/infoapp')
    )
</script>