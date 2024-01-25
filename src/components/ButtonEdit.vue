<template>
    <button @click="edit"
        class="absolute top-2 right-11 bg-blue-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 30" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-edit-3">
            <path d="M12 20h9"></path>
            <path d="M17 6l5 5L7 25H2v-5L17 6z"></path>
        </svg>
    </button>
</template>

<script setup>

let emit = defineEmits(['edit'])


function edit() {
    emit('edit', true);
}

</script>