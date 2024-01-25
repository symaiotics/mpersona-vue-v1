<template>
    <div v-if="inProgress" class="min-h-[200px] flex justify-center items-center w-full">
      <div class="bg-white dark:bg-gray-700 p-6 rounded-lg shadow-lg flex items-center flex-col w-full">
        <svg class="animate-spin -ml-1 mr-3 h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 0116 0H4z"></path>
        </svg>
        <span class="text-gray-800 dark:text-gray-300 mt-2">{{ message }}</span>
        <span v-if="subtext" class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ subtext }}</span>
      </div>
    </div>
  </template>
  
  <script setup>
  const props = defineProps({
    inProgress: Boolean,
    message: {
      type: String,
      default: 'Please wait...'
    },
    subtext: {
      type: String,
      default: ''
    }
  });
  </script>
  
  <style>
  /* Ensure that spinner is accessible by providing sufficient contrast and support for reduced motion */
  @media (prefers-reduced-motion: reduce) {
    .animate-spin {
      animation: none;
    }
  }
  </style>