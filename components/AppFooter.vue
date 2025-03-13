<template>
    <div class="text-end text-xs opacity-50 p-3">
        <span>
            Copyright © {{ data.lembaga }}
        </span>
        <span class="mx-1">|</span>
        <span>
            {{ data.tahun_ajaran }}
        </span>
        <span class="mx-1">|</span>
        <span>
            {{ data.date }}
        </span>
        <br>
        <span class="opacity-70">Design by <a href="https://ideya.web.id" target="_blank">Ideya.web.id</a></span>
    </div>
</template>

<script setup lang="ts">
const client = useSanctumClient(); 
const { setConfig, configApp } = useConfigStore()   
const { data } = await useAsyncData(
    'configapp',
    () => client('/api/config_app')
)

</script>