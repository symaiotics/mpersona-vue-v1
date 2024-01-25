<template>
    <template v-if="props?.record">
      <div :class="alignmentClasses">
        
        <div :class="textAlignmentClasses">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-wordwrap">
            {{ props.record.name }}
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
            {{ props.record.description.en }}
          </p>
        </div>
      </div>
    </template>
  </template>
  
  <script setup>
  import {  computed } from 'vue';
  const props = defineProps({ 
    record: { type: Object },
    alignment: { type: String, default: 'left' }
  });
  
  const alignmentClasses = computed(() => ({
    flex: true,
    'flex-col': true,
    'items-center': props.alignment === 'center',
  }));
  
  const textAlignmentClasses = computed(() => ({
    'text-center': props.alignment === 'center',
    'pl-3': props.alignment !== 'center',
    'pr-2': props.alignment !== 'center',
    'pt-3': props.alignment !== 'center',
    'leading-normal': true,
  }));
  
  </script>
  