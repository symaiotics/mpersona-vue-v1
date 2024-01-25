<template>
    <div v-if="selectedCategory"
        class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start m-2">

        <div class="w-full">
            <p>Name</p>
            <div class="py-2">
                <input v-model="selectedCategory.name.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full font-bold" placeholder="Name (EN)" />
                <input v-model="selectedCategory.name.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full  font-bold" placeholder="Name (FR)" />
            </div>
            <p>Description</p>
            <div class="py-2">
                <textarea v-model="selectedCategory.description.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" placeholder="Description (EN)"></textarea>
                <textarea v-model="selectedCategory.description.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" placeholder="Description (FR)"></textarea>
            </div>

            <p>Context</p>
            <div class="py-2">
                <textarea v-model="selectedCategory.context.en" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    placeholder="Context (EN)"></textarea>
                <textarea v-model="selectedCategory.context.fr" class="form-input rounded-md shadow-sm mt-1 block w-full"
                    placeholder="Context (FR)"></textarea>
            </div>

        </div>


        <button v-if="!selectedCategory._id" @click="save"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Save') }}
        </button>

        <button v-if="selectedCategory._id" @click="update"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Update') }}
        </button>



    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

import { useLexicon } from '@/composables/useLexicon.js'
import { useCategories } from '@/composables/knowledgeMapping/useCategories.js'
const { L_ } = useLexicon()
const { defaultCategory,
    newCategory,
    knowledgeSets,
    selectedCategory,
    addNewCategory,
    resetCategory,
    getCategories,
    createCategories,
    updateCategories,
    deleteCategories } = useCategories();

const props = defineProps({
    knowledgeSetUuid: { type: String },
})

function save() {
    createCategories(props.knowledgeSetUuid, [selectedCategory.value])
    selectedCategory.value= null;
}

function update() {
    updateCategories(props.knowledgeSetUuid, [selectedCategory.value])
    selectedCategory.value= null;
}

</script>