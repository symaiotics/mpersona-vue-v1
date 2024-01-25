<template>
    <div class="max-w-full rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex items-start m-2">
        <div v-if="showCheckbox" class="pr-4 flex items-center">
            <input type="checkbox" class="form-checkbox h-6 w-6" @change="emitChecked($event.target.checked)">
        </div>



        <UnfoldMoreHorizontal @click="emitToggleExpand"
            class="absolute top-12 left-4 text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
            :size="24" />


        <div class="flex-grow">
            <button @click="emitDeleteSegment"
                class="absolute top-0 right-0 m-1 bg-red-500 text-white rounded-full p-1 text-xs w-6 h-6 flex items-center justify-center">
                &times;
            </button>


            <div class="px-6 py-2">
                <p class="text-gray-700 dark:text-gray-300 text-base">
                    {{ content }}
                </p>
                <div class="text-xl mb-2">{{ title }}</div>
            </div>


            <div class="px-6 pt-4 pb-2">
                <span
                    class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2"
                    v-for="(keyword, index) in keywords" :key="index">
                    {{ keyword }}
                </span> <span v-if = "!props.showAll">({{ keywordCount }})</span>
            </div>

            <!-- Progress bars for categories -->

            <div v-for="(category, index) in categories" :key="`category-${index}`" class="mb-4">
                <div class="text-sm font-semibold mb-1">{{ category.name.en }} ({{ category.score }})</div>
                <VueSlider :modelValue="category.score" @update:modelValue="value => updateCategoryScore(value, index)"
                    :min="0" :max="100" />
            </div>

        </div>
    </div>
</template>
  
<script setup>
import { computed } from 'vue';

import ClipboardPlus from 'vue-material-design-icons/ClipboardPlus.vue';
import ArrowExpandDown from 'vue-material-design-icons/ArrowExpandDown.vue';
import ArrowExpandUp from 'vue-material-design-icons/ArrowExpandUp.vue';
import UnfoldMoreHorizontal from 'vue-material-design-icons/UnfoldMoreHorizontal.vue';
// UnfoldMoreHorizontal

import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


const props = defineProps({
    index: Number,
    data: Object,
    showCheckbox: Boolean,
    showAll: { type: Boolean, default: false }
});




const emit = defineEmits(['deleteSegment', 'checked', 'toggleExpand', 'update:data']);

const emitDeleteSegment = () => {
    emit('deleteSegment', props.index);
};

const emitChecked = (checked) => {
    emit('checked', { index: props.index, checked });
};

const getNestedValue = (obj, path, defaultValue = undefined) => {
    return path.reduce((acc, key) => {
        return acc && acc[key] !== undefined ? acc[key] : defaultValue;
    }, obj);
};

const title = computed(() => {
    const summary = getNestedValue(props.data, ['json', 'summary', 'en'], '');
    if (props.showAll) return summary;
    else
        return summary.length > 50 ? summary.slice(0, 50) + '...' : summary;
});

const content = computed(() => {
    if (props.data.status == 'pending') {
        const altContent = getNestedValue(props.data, ['message'], '');
        if (altContent) {
            if (props.showAll) return altContent
            else return altContent.length > 200 ? altContent.slice(0, 200) + '...' : altContent;

        }
        else return 'Pending...';
    }
    else {
        const context = getNestedValue(props.data, ['json', 'context', 'en'], '');
        if (props.showAll) return context;
        else return context.length > 200 ? context.slice(0, 200) + '...' : context;

    }
});

const keywords = computed(() => {
    const keywordsArray = getNestedValue(props.data, ['json', 'keywords'], []);
    if (props.showAll) return keywordsArray;
    else return keywordsArray.slice(0, 3);
});

const status = computed(() => {
    return getNestedValue(props.data, ['status'], 'Unknown Status');
});

const keywordCount = computed(() => {
    const keywordsArray = getNestedValue(props.data, ['json', 'keywords'], []);
    return keywordsArray.length;
});


const categories = computed({
    get() {
        return getNestedValue(props.data, ['json', 'categories'], []).map(category => ({
            ...category,
            score: Math.min(100, Math.max(0, category.score || 0)),
            name: {
                en: category.name && category.name.en ? category.name.en : ''
            }
        }));
    },
    set(updatedCategories) {
        // Emit the updated categories to the parent
        emit('update:data', { data: { ...props.data, json: { ...props.data.json, categories: updatedCategories } }, index: props.index });
    }
});
const updateCategoryScore = (newScore, categoryIndex) => {
    // Deep clone the data object
    const updatedData = JSON.parse(JSON.stringify(props.data));

    // Update the score for the specified category
    if (updatedData?.json?.categories?.[categoryIndex]) {
        updatedData.json.categories[categoryIndex].score = newScore;
    }
    // Emit the updated data along with the index to the parent
    emit('update:data', { data: updatedData, index: props.index });
};


const emitUpdate = () => {
    // Deep clone the data object
    const updatedData = JSON.parse(JSON.stringify(props.data));
    // Update the clone with the new categories scores
    updatedData.json.categories = categories.value;
    // Emit the updated data along with the index to the parent
    emit('update:data', { data: updatedData, index: props.index });
};


const emitToggleExpand = () => {
    emit('toggleExpand', props.index);
}

</script>
  
<style scoped>
/* Tailwind CSS styles with dark mode variants */
</style>