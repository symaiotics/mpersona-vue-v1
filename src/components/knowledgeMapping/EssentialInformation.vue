<template>
    <div v-if="localDocument" class="overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start shadow-md sm:rounded-lg m-2">
      <div class="w-full">
        <button @click="close" class="absolute top-1 right-1 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
          &times;
        </button>
  
        <div class="py-2" v-if = "localDocument?.name">
          <label class="font-bold">{{ L_("Name") }}</label>
          <input v-model="localDocument.name.en" class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Name') + ' (EN)'" @input="updateDocument" />
          <input v-model="localDocument.name.fr" class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Name') + ' (FR)'" @input="updateDocument" />
        </div>
  
        <div class="py-2" v-if = "localDocument?.description">
          <label class="font-bold">{{ L_("Description") }}</label>
          <textarea v-model="localDocument.description.en" class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (EN)'" @input="updateDocument"></textarea>
          <textarea v-model="localDocument.description.fr" class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (FR)'" @input="updateDocument"></textarea>
        </div>
  
        <div v-if = "localDocument?.keywords?.length" class="py-2">
          <label class="font-bold">{{ L_("Keywords") }}</label>
          <div class="px-6 pt-4 pb-2">
            <span class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2" v-for="(keyword, index) in localDocument.keywords" :key="index">
              {{ keyword.en }} | {{ keyword.fr }}
            </span>
          </div>
        </div>
  
        <div v-if = "localDocument?.categories?.length" class="py-2">
          <label class="font-bold">{{ L_("Categories") }}</label>
          <div v-for="(category, index) in localDocument.categories" :key="`category-${index}`" class="mb-4">
            <div class="text-sm font-semibold mb-1">{{ category.name.en }} | {{ category.name.fr }} ({{ category.score }})</div>
            <VueSlider :modelValue="category.score" @update:modelValue="value => updateCategoryScore(value, index)" :min="0" :max="100" />
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, nextTick } from 'vue';
  import { useLexicon } from '@/composables/useLexicon.js';
  import VueSlider from 'vue-slider-component';
  import 'vue-slider-component/theme/default.css';
  
  const { L_ } = useLexicon();
  const emit = defineEmits(['update:modelValue', 'close']);
  const props = defineProps({
    modelValue: Object
  });
  
  const localDocument = ref({ ...createDefaultDocument() });
  
  watch(() => props.modelValue, (newVal) => {
    localDocument.value = { ...newVal };
  }, { deep: true, immediate: true });
  
  function updateDocument() {
    nextTick(() => {
      emit('update:modelValue', localDocument.value);
    });
  }
  
  function createDefaultDocument() {
    return {
      name: { en: '', fr: '' },
      description: { en: '', fr: '' },
      keywords: [],
      categories: []
    };
  }
  
  function close() {
    emit('close');
  }
  
  function updateCategoryScore(newScore, categoryIndex) {
    localDocument.value.categories[categoryIndex].score = newScore;
    updateDocument();
  }
  </script>