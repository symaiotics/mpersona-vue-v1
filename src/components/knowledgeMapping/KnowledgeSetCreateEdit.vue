<template>
    <div v-if="selectedKnowledgeSet"
        class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start m-2">

        <div class="w-full">
            <p>Name</p>
            <div class="py-2">
                <input v-model="selectedKnowledgeSet.name.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full font-bold" placeholder="Name (EN)" />
                <input v-model="selectedKnowledgeSet.name.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full  font-bold" placeholder="Name (FR)" />
            </div>
            <p>Description</p>
            <div class="py-2">
                <textarea v-model="selectedKnowledgeSet.description.en"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" placeholder="Description (EN)"></textarea>
                <textarea v-model="selectedKnowledgeSet.description.fr"
                    class="form-input rounded-md shadow-sm mt-1 block w-full" placeholder="Description (FR)"></textarea>
            </div>
        </div>


        <button v-if="!selectedKnowledgeSet._id" @click="save"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Save') }}
        </button>

        <button v-if="selectedKnowledgeSet._id" @click="update"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Update') }}
        </button>



    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

import { useLexicon } from '@/composables/useLexicon.js'
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

const props = defineProps({
    wrappUuid: { type: String },
    rosterUuid: { type: String },
})

function save() {
    createKnowledgeSets([selectedKnowledgeSet.value], props.rosterUuid)
}

function update() {
    updateKnowledgeSets([selectedKnowledgeSet.value], props.rosterUuid)
}

</script>