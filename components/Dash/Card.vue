<template>
  <div class="border dark:border-zinc-800 dark:bg-zinc-800 p-5">
    <div v-if="$slots.header" class="mb-4 text-lg font-bold">
      <slot name="header"></slot>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts"></script>
