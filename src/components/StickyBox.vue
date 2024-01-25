<template>
    <div class="flex min-h-screen">
      <!-- Left Column -->
      <div class="w-3/4 bg-gray-300 p-4 overflow-y-auto">
 
 
 
      </div>
      
      <!-- Right Column -->
      <div class="w-1/4 p-4 bg-gray-400">
        <div id="rightColumn" class="bg-white p-4">
  

          
  
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { onMounted } from 'vue';
  import Sticky from 'sticky-js';
  
  onMounted(() => {
    new Sticky("#rightColumn");
  });
  </script>
  
  <style scoped>
  /* Your styles here, if needed */
  </style>