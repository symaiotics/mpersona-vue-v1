<template>
    <div class="fixed bottom-4 right-4  bg-white dark:bg-gray-800 p-4 rounded shadow-lg " style = "z-index:30">
      <button @click="emitCommand('context')" class="bg-red-500 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-800 text-white font-bold py-2 px-4 rounded m-2">Context</button>
      <button @click="emitCommand('structure')" class="bg-blue-500 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-800 text-white font-bold py-2 px-4 rounded m-2">Structure</button>
      <button @click="emitCommand('content')" class="bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-600 dark:hover:bg-yellow-800 text-white font-bold py-2 px-4 rounded m-2">Content</button>
    </div>
  </template>
  
  <script setup>
  // Any logic related to this component will go here


  const emit = defineEmits(['command-clicked']);


const emitCommand = (command) => {
  emit('command-clicked', command);
};


</script>
  
  <style scoped>
  /* Add any additional styles here */
  </style>
  