<template>
    <div class="w-full">
        <div v-for="(item, index) in localCategories" :key="index"
            class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start m-2">
            <button @click="removeCategory(index)"
                class="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
                &times;
            </button>
            <div class="w-full">
                <!-- ... other inputs ... -->
                <p>Category Name</p>
                <div class="py-2">
                    <input v-model="item.name.en" class="form-input rounded-md shadow-sm mt-1 block w-full font-bold"
                        placeholder="Name (EN)" />
                    <input v-model="item.name.fr" class="form-input rounded-md shadow-sm mt-1 block w-full  font-bold"
                        placeholder="Name (FR)" />
                </div>
                <p>Description</p>
                <div class="py-2">
                    <textarea v-model="item.description.en" class="form-input rounded-md shadow-sm mt-1 block w-full"
                        placeholder="Description (EN)"></textarea>
                    <textarea v-model="item.description.fr" class="form-input rounded-md shadow-sm mt-1 block w-full"
                        placeholder="Description (FR)"></textarea>
                </div>

                <p>Context - Important for the AI to understand this category</p>
                <div class="py-2">
                    <textarea v-model="item.context" rows = 6 class="form-input rounded-md shadow-sm mt-1 block w-full"
                        placeholder="Context"></textarea>
                </div>

                <div class="pt-4 pb-2">
                    <span v-for="(keyword, keywordIndex) in item.keywords" :key="keywordIndex"
                        class="inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">
                        {{ keyword }}
                        <button @click="removeKeyword(index, keywordIndex)"
                            class="ml-2 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
                            &times;
                        </button>
                    </span>
                </div>

                <div class="py-2">
                    <input v-model="item.newKeyword" class="form-input rounded-md shadow-sm mt-1 block w-full"
                        placeholder="New Keyword" />
                    <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                        @click="addKeyword(index)">
                        Add Keyword
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>
  
<script setup>
import { ref, watch, toRefs } from 'vue';

const props = defineProps({
    data: Array
});

const { data } = toRefs(props);

const localCategories = ref(data.value.map(category => ({
    ...category,
    newKeyword: '' // Add a newKeyword property for each category
})));

watch(data, (newData) => {
    localCategories.value = JSON.parse(JSON.stringify(newData));
}, { deep: true });

const newKeyword = ref('');

const emit = defineEmits(['update:data', 'removeCategory', 'removeKeyword']);

const removeKeyword = (categoryIndex, keywordIndex) => {
    // localCategories.value[categoryIndex].keywords.splice(keywordIndex, 1);
    // updateData(localCategories.value)
    emit('removeKeyword', { categoryIndex, keywordIndex });
};

const removeCategory = (categoryIndex) => {
    // localCategories.value.splice(categoryIndex, 1);
    // updateData(localCategories.value)
    emit('removeCategory', categoryIndex);
};

const addKeyword = (categoryIndex) => {
    const category = localCategories.value[categoryIndex];
    if (category.newKeyword.trim() !== '') {
        category.keywords.push(category.newKeyword);
        category.newKeyword = ''; // Reset the input after adding
        updateData(localCategories.value)
    }
};

const updateData = (newData) => {
    emit('update:data', newData); // Emit the 'update:data' event whenever you want to update the data
};

</script>