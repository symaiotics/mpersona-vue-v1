
<template>
  <template v-if="props?.persona">
    <div :class="alignmentClasses">
      <div class="flex items-center">
        <img
          v-if="props.persona.url"
          class="object-cover rounded-t-lg md:h-24 md:w-24 rounded"
          :src="props.persona.url"
          alt=""
        />
        <img
          v-else
          class="object-cover rounded-t-lg md:h-24 md:w-24 rounded"
          :src="defaultImage"
          alt=""
        />
      </div>
      <div :class="textAlignmentClasses">
        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white overflow-hidden break-words">
          {{ props.persona.name }}
        </h5>
        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400 w-full overflow-hidden break-words">
          {{ props.persona.description.en }}
        </p>
      </div>
    </div>
  </template>
</template>


  <script setup>
  import { defineProps, computed } from 'vue';
  import defaultImage from "../images/persona1.png";
  const props = defineProps({ 
    persona: { type: Object },
    personaIndex: { type: Number },
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
  