<template>
    <div
      @click="openFileDialog"
      @dragover.prevent="dragOverHandler"
      @dragleave="dragLeaveHandler"
      @drop.prevent="dropHandler"
      :class="isDraggingOver ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'"
      class="border p-6 rounded-md transition-colors duration-300 dark:hover:bg-slate-700 hover:bg-gray-200"
      data-aos="fade-down"
      data-aos-delay="300"
    >
      <input type="file" ref="fileInput" @change="handleFiles" accept=".zip" hidden>
      <p class="text-center text-gray-500 dark:text-gray-200">
        Drag and drop or click to select your .zip file here.
      </p>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const isDraggingOver = ref(false);
  const fileInput = ref(null); // Reference to the file input element
  const emit = defineEmits(['fileSelected']);
  
  const dragOverHandler = () => {
    isDraggingOver.value = true;
  };
  
  const dragLeaveHandler = () => {
    isDraggingOver.value = false;
  };
  
  const openFileDialog = () => {
    fileInput.value.click();
  };
  
  const dropHandler = (event) => {
    isDraggingOver.value = false;
    const files = event.dataTransfer.files;
    processFiles(files);
  };
  
  const handleFiles = () => {
    const files = fileInput.value.files;
    processFiles(files);
  };
  
  const processFiles = (files) => {
    // Filter for .zip files
    const zipFiles = Array.from(files).filter((file) => file.type === 'application/zip' || file.name.endsWith('.zip'));
  
    // Emit the first .zip file if it exists
    if (zipFiles.length > 0) {
      emit('fileSelected', zipFiles[0]);
    }
  };
  </script>