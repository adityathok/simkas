<template>
    <header class="mb-5">
        <h1 class="text-lg font-medium text-gray-900">
            <slot name="title" />
        </h1>
        <div v-if="$slots.subtitle" class="mt-1 text-sm text-gray-600">
            <slot name="subtitle" />
        </div>
    </header>
</template>