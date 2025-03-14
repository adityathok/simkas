<template>
    <div class="text-end text-xs opacity-50 p-3">
        <span>
            Copyright © {{ configApp.lembaga }}
        </span>
        <span class="mx-1">|</span>
        <span>
            {{ configApp.tahun_ajaran }}
        </span>
        <span class="mx-1">|</span>
        <span>
            {{ configApp.date }}
        </span>
        <br>
        <span class="opacity-70">Design by <a href="https://ideya.web.id" target="_blank">Ideya.web.id</a></span>
    </div>
</template>

<script setup lang="ts">
const client = useSanctumClient(); 
const { configApp } = useConfigStore()
</script>