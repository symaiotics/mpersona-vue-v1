<template>
    <button @click="close"
        class="absolute top-2 right-2 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150">
        ×
    </button>
</template>

<script setup>

let emit = defineEmits(['close'])

function close() {
    emit('close', true); }

</script>