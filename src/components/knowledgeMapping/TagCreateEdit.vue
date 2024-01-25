<template>
    <div v-if="selectedTag"
        class="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-800 p-4 relative flex flex-col items-start m-2">

        <div class="w-full">
            <p>Name</p>
            <div class="py-2">
                <input v-model="selectedTag.name.en" class="form-input rounded-md shadow-sm mt-1 block w-full font-bold"
                    placeholder="Name (EN)" />
                <input v-model="selectedTag.name.fr" class="form-input rounded-md shadow-sm mt-1 block w-full  font-bold"
                    placeholder="Name (FR)" />
            </div>


        </div>


        <button v-if="!selectedTag._id" @click="save"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Save') }}
        </button>

        <button v-if="selectedTag._id" @click="update"
            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
            {{ L_('Update') }}
        </button>



    </div>
</template>
  
<script setup>
import { ref, watch } from 'vue';

import { useLexicon } from '@/composables/useLexicon.js'
import { useTags } from '@/composables/knowledgeMapping/useTags.js'
const { L_ } = useLexicon()
const { defaultTag,
    newTag,
    tags,
    selectedTag,

    addNewTag,
    resetTag,

    getTags,
    createTags,
    updateTags,
    deleteTags } = useTags();

const props = defineProps({
    knowledgeSetUuid: { type: String },
})

function save() {
    createTags(props.knowledgeSetUuid, [selectedTag.value])
    selectedTag.value = null;
}

function update() {
    updateTags(props.knowledgeSetUuid, [selectedTag.value])
    selectedTag.value = null;
}

</script>