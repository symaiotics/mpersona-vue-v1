<template>
    <!-- {{ props.data }} -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div v-for="item in props.data" :key="item._id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div class="p-5 cursor-pointer" @click="select(item)">
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white" v-if="item.name?.en">{{ item.name.en }}</h2>
                <h2 class="text-xl font-semibold text-gray-800 dark:text-white" v-if="item.name?.fr">{{ item.name.fr }}</h2>
                <p class="text-gray-600 dark:text-gray-400 mt-2" v-if="item.description?.en">{{ item.description.en }}</p>
                <p class="text-gray-600 dark:text-gray-400 mt-2" v-if="item.description?.fr">{{ item.description.fr }}</p>
                <ul class="mt-4">
                    <li v-for="(value, key) in item" :key="key">
                        <div v-if="Array.isArray(item[key])">
                            <span
                                class="w-full font-medium text-gray-900 dark:text-white inline-flex items-center bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2"
                                v-if="uuidLabels[key]">
                                {{ uuidLabels[key].en }} / {{ uuidLabels[key].fr }}: {{ value.length }}
                            </span>

                        </div>
                        <!-- <span class="font-medium text-gray-900 dark:text-white">{{ uuidLabels[key].en }} ({{ uuidLabels[key].fr }}): </span>{{ value.length }} -->
                    </li>
                </ul>
            </div>

            <button @click="select(item)"
                class="  bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                {{ L_('Select') }}
            </button>

            <button @click="deleteItem(item)"
                class="  bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                {{ L_('Delete') }} <span v-if="item._initiateDelete">(Check to confirm)</span>
            </button>

            <div v-if="item._initiateDelete" class="pl-2">
                <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="item._confirmDelete" class="mr-1 checkbox-large" />
                    Yes, I am sure.
                </label><br />
                <!-- <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="item._confirmDeleteAssociated" class="mr-1 checkbox-large" />
                    Delete associated knowledge.
                </label> -->
            </div>
        </div>
    </div>
</template>
  
<script setup>

import { useLexicon } from '@/composables/useLexicon.js';
import { useKnowledgeSets } from '@/composables/knowledgeMapping/useKnowledgeSets.js'

const { L_ } = useLexicon()
const { defaultKnowledgeSet,
    newKnowledgeSet,
    knowledgeSets,
    selectedKnowledgeSet,
    addNewKnowledgeSet,
    resetKnowledgeSet,
    getKnowledgeSets,
    createKnowledgeSets,
    updateKnowledgeSets,
    deleteKnowledgeSets } = useKnowledgeSets();

    const emit = defineEmits(['selected'])
const props = defineProps({
    new: { type: Boolean, default: false },
    data: {
        type: Array,
        default: []
    },
    rosterUuid: { type: String, default: null }
});

// Lookup table for UUID array labels
const uuidLabels = {
    categoryUuids: { en: 'Categories', fr: 'Catégories' },
    documentUuids: { en: 'Documents', fr: 'Documents' },
    segmentUuids: { en: 'Segments', fr: 'Segments' },
    mappingUuids: { en: 'Mappings', fr: 'Mappages' },
    artifactUuids: { en: 'Artifacts', fr: 'Artefacts' },
    tagUuids: { en: 'Tags', fr: 'Étiquettes' }
};

function select(item) {
    selectedKnowledgeSet.value = item;
    emit('selected', item)
}

function deleteItem(item) {
    if (!item._initiateDelete) {
        item._initiateDelete = true;
    }
    else if (item._initiateDelete && item._confirmDelete && props.rosterUuid) {
        deleteKnowledgeSets(item.uuid, props.rosterUuid)
    }

    else if (item._initiateDelete && !item._confirmDelete) {
        item._initiateDelete = false;
        item._confirmDelete = false;
        item._confirmDeleteAssociated = false;
    }

    else { }
}
</script>
  
<style>
/* Ensure you have Tailwind CSS configured with dark mode classes */
</style>