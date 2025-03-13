<template>
  <div v-if="configApp.value" class="text-xs opacity-50 p-3">
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 inline-block mb-1 lucide lucide-calendar-clock"><path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h5"/><path d="M17.5 17.5 16 16.3V14"/><circle cx="16" cy="16" r="6"/></svg>
        {{ configApp.value.tahun_ajaran }}
      </span>
      <span class="mx-1">|</span>
      <span>
        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-50 inline-block mb-1 lucide lucide-calendar"><path d="M8 2v4"/><path d="M16 2v4"/><rect width="18" height="18" x="3" y="4" rx="2"/><path d="M3 10h18"/></svg>
        {{ configApp.value.date }}
      </span>
      <br>
      <span class="text-xs opacity-70">Sistem Informasi Manajemen Keuangan Sekolah ( {{ configApp.value.version }} ). Copyright © {{ configApp.value.year }} {{ configApp.value.lembaga }}<span class="hidden"> Design by <a href="https://ideya.web.id" target="_blank">Ideya.web.id</a></span></span>
  </div>
</template>

<script setup lang="ts">
const { configApp } = useConfigStore()   
</script>