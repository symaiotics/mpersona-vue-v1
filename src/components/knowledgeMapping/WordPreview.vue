<template>
    <div class="">
      <div v-for="(filePreview, index) in filePreviews" :key="filePreview.name" 
           class="relative rounded-lg shadow-md bg-white dark:bg-gray-800 p-4 cursor-pointer"
           :class="{ 'border-4 border-blue-500': index === selectedIndex }">

           <input type="checkbox" class="form-checkbox h-6 w-6 absolute top-0 left-0 m-1" @change="emitChecked($event.target.checked, index)">


        <button @click.stop="emitDeleteFile(index)"
                class="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
          &times;
        </button>
        <div @click="emitSelectedIndex(index)" class="flex flex-col items-center">
          <p class="text-sm text-gray-700 dark:text-gray-200 break-all mb-2 w-full text-center">{{ filePreview.name }}</p>
          <div class="w-full bg-gray-100 dark:bg-gray-700 aspect-w-17 aspect-h-22">
            <img :src="filePreview.imgSrc" :alt="filePreview.name" class="object-cover w-full h-full">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, defineEmits, defineProps } from 'vue';
  
  const props = defineProps({
    filePreviews: Array
  });
  
  const selectedIndex = ref(null);
  const emit = defineEmits(['selected', 'deleteFile', 'checked']);
  
  const emitSelectedIndex = (index) => {
    selectedIndex.value = index;
    emit('selected', index);
  };
  
  const emitDeleteFile = (index) => {
    emit('deleteFile', index);
  };

  const emitChecked = (index) => {
    emit('checked', index);
  };

  </script>