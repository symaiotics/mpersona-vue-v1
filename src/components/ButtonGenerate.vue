<template>
<button @click="generate" class="absolute top-2 right-20 bg-green-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150">
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
</button>

</template>

<script setup>

let emit = defineEmits(['generate'])


function generate() {
    emit('generate', true);
}

</script>