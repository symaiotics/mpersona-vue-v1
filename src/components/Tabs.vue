<template>
    <div>
      <div class="tabs flex border-b border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 rounded-t">
        <button 
          v-for="(tab, index) in tabs" 
          :key="index" 
          :class="[
            'flex-grow', 
            'py-2', 
            'px-4', 
            'cursor-pointer', 
            'rounded-t', 
            { 'bg-white border-b-2 border-blue-500 dark:bg-gray-800 dark:border-blue-400': modelValue === index }, 
            { 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600': modelValue !== index }
          ]" 
          @click="changeTab(index)"
        >
          {{ tab.label }}
        </button>
      </div>
      <div class="tab-content p-4 border border-t-0 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-b">
        <template v-for="(tab, index) in tabs"  :key="'tab'+index">
          <div v-show="modelValue === index">
            <slot :name="`tab-${index}`"></slot>
          </div>
        </template>
      </div>
    </div>
  </template>
  
  <script setup>
  const { tabs, modelValue } = defineProps(['tabs', 'modelValue']);
  const emit = defineEmits();
  
  function changeTab(index) {
    emit('update:modelValue', index);
  }
  </script>
  