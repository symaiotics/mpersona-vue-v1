<template>
    <template v-if="props?.roster">
      <div :class="alignmentClasses">
        
        <div :class="textAlignmentClasses">
          <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-wordwrap">
            {{ props.roster.name }}
          </h5>
          <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 w-128">
            {{ props.roster.description.en }}
          </p>
        </div>
      </div>
    </template>
  </template>
  
  <script setup>
  import { defineProps, computed } from 'vue';
  const props = defineProps({ 
    roster: { type: Object },
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
  