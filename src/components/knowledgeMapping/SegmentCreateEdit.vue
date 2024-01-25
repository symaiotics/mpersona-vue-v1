<template>
    <div v-if="localDocument"
        class="overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start shadow-md sm:rounded-lg m-2">
        <div class="w-full">

            <button @click="close"
                class="absolute top-1 right-1 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
                &times;
            </button>


            <!-- Name and Description Fields -->
            <div v-if="localDocument?.name">
                <label class="font-bold">{{ L_("Name") }}</label>
                <input v-model="localDocument.name.en" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    :placeholder="L_('Name') + ' (EN)'" @input="onLocalDocumentChange" />
                <input v-model="localDocument.name.fr" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    :placeholder="L_('Name') + ' (FR)'" @input="onLocalDocumentChange" />
            </div>
            <div class="py-2" v-if="localDocument?.description">
                <label class="font-bold">{{ L_("Description") }}</label>
                <textarea v-model="localDocument.description.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (EN)'"
                    @input="onLocalDocumentChange"></textarea>
                <textarea v-model="localDocument.description.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (FR)'"
                    @input="onLocalDocumentChange"></textarea>
            </div>
            

            <div v-if="localDocument?.documentName">
                <label class="font-bold">{{ L_("Document Name") }}</label>
                <input v-model="localDocument.documentName.en" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    :placeholder="L_('Name') + ' (EN)'" @input="onLocalDocumentChange" />
                <input v-model="localDocument.documentName.fr" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    :placeholder="L_('Name') + ' (FR)'" @input="onLocalDocumentChange" />
            </div>

            <div class="py-2" v-if="localDocument?.documentDescription">
                <label class="font-bold">{{ L_("Document Description") }}</label>
                <textarea v-model="localDocument.documentDescription.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (EN)'"
                    @input="onLocalDocumentChange"></textarea>
                <textarea v-model="localDocument.documentDescription.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" :placeholder="L_('Description') + ' (FR)'"
                    @input="onLocalDocumentChange"></textarea>
            </div>


            <div class="py-2">
                <label class="font-bold">{{ L_("Keywords") }}</label>

                <div class="px-6 pt-4 pb-2">
                    <span
                        class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2"
                        v-for="(keyword, index) in localDocument.keywords" :key="index">
                        {{ keyword.en }} | {{ keyword.fr }}
                    </span>
                </div>

            </div>

            <div class="py-2">
                <label class="font-bold">{{ L_("Categories") }}</label>

                <div v-for="(category, index) in localDocument.categories" :key="`category-${index}`" class="mb-4">
                    <div class="text-sm font-semibold mb-1">{{ category.name.en }} | {{ category.name.fr }} ({{
                        category.score }})</div>
                    <VueSlider :modelValue="category.score" @update:modelValue="value => updateCategoryScore(value, index)"
                        :min="0" :max="100" />
                </div>

            </div>




            <!-- Action Buttons -->
            <div class="flex flex-row justify-start space-x-2 mt-2">
                <button v-if="localDocument._id" @click="update"
                    class="bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold py-2 px-4 rounded">
                    {{ L_('Update') }}
                </button>

                <button @click="close"
                    class="bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold py-2 px-4 rounded">
                    {{ L_('Close') }}
                </button>

            </div>


        </div>
    </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import { useLexicon } from '@/composables/useLexicon.js';

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


const { L_ } = useLexicon();
const emit = defineEmits(['update:modelValue', 'close', 'update']);
const props = defineProps({
    modelValue: Object
});

const localDocument = ref(createDefaultDocument());

// Sync the localDocument with the modelValue prop
watch(() => props.modelValue, (newVal) => {
    if (newVal) {
        localDocument.value = { ...newVal };
    }
}, { deep: true });

// Function to be called when user makes changes
function onLocalDocumentChange() {
    emit('update:modelValue', localDocument.value);
}

// Call this function on user input events instead of watching localDocument
// For example, bind this function to input event listeners in your template

function createDefaultDocument() {
    return {
        name: { en: '', fr: '' },
        description: { en: '', fr: '' },
        original: {
            name: '',
            type: '',
            size: null,
            lastModified: null,
        },
        // Additional fields based on schema can be added here
    };
}

function close() {
    emit('close');
}


function update() {
    emit('update', localDocument.value);
}

const updateCategoryScore = (newScore, categoryIndex) => {

    // Update the score for the specified category
    if (localDocument?.value?.categories?.[categoryIndex]) {
        localDocument.value.categories[categoryIndex].score = newScore;
    }
    // Emit the updated data
    emit('update:modelValue', localDocument.value);
};


</script>
