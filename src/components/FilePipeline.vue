<template>
    <div @click="openFileDialog" @dragover.prevent="dragOverHandler" @dragleave="dragLeaveHandler"
        @drop.prevent="dropHandler"
        :class="isDraggingOver ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'"
        class="border p-6 rounded-md transition-colors duration-300">
        <input type="file" ref="fileInput" @change="handleFiles" multiple hidden>
        <p v-if="!newKnowledgeProfile?.files?.length" class="text-center text-gray-500 dark:text-gray-200">
            Drag and drop or click to select your .html, .json, .txt, .docx, or .pdf files here.
        </p>
        <ul v-else>
            <li v-for="file in newKnowledgeProfile.files" :key="file.name">
                {{ file.name }}
            </li>
        </ul>
    </div>
</template>

<script setup>
import { ref } from 'vue';

import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
const { newKnowledgeProfile } = useKnowledgeProfiles()

const isDraggingOver = ref(false);
const fileInput = ref(null);  // reference to the file input element

const dragOverHandler = () => {
    isDraggingOver.value = true;
};

const dragLeaveHandler = () => {
    isDraggingOver.value = false;
};

const openFileDialog = () => {
    fileInput.value.click();
};


const processFiles = (filesArray) => {
    const processedFiles = [...filesArray].filter(
        file => ['text/plain', 'text/html', 'application/json', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
    );
    newKnowledgeProfile.value.files = [...newKnowledgeProfile.value.files, ...processedFiles];
};

const dropHandler = (event) => {
    isDraggingOver.value = false;
    processFiles(event.dataTransfer.files);
};

const handleFiles = () => {
    processFiles(fileInput.value.files);
};



</script>