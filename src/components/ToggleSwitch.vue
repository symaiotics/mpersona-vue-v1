<template>
    <div class="flex items-center">
      <label for="toggle" class="relative inline-block w-14 h-8 cursor-pointer">
        <input
          type="checkbox"
          id="toggle"
          class="sr-only"
          :checked="modelValue"
          @change="$emit('update:modelValue', $event.target.checked)"
        />
        <span
          class="absolute inset-0 transition duration-200 ease-in bg-gray-300 rounded-full dark:bg-gray-600"
          :class="{ 'bg-green-400 dark:bg-green-600': modelValue }"
        ></span>
        <span
          class="absolute left-1 top-1 transition-all duration-200 ease-in bg-white rounded-full shadow-md w-6 h-6 dark:bg-gray-400"
          :class="{ 'translate-x-7': modelValue }"
        ></span>
      </label>
    </div>
  </template>
  
  <script setup>
  import { defineProps, defineEmits } from 'vue';
  
  const props = defineProps({
    modelValue: Boolean
  });
  
  const emit = defineEmits(['update:modelValue']);
  </script>
  
  <style>
  /* Add additional styles if needed */
  </style>