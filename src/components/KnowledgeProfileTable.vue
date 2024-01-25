<template>
    <div class="flex flex-col-reverse md:flex-row dark:bg-gray-800">
        <!-- Left Column for displaying list -->
        <div class="w-full  p-4 dark:border-gray-700 md:order-2">
            <table class="w-full">
                <thead>
                    <tr>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Description</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300"># Files</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300"># Facts</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(kp, index) in knowledgeProfiles" :key="index" @click="selectKp(index)"
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ kp.name }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ kp.description.en }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ kp.filesCount }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ kp.factsCount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
  
<script setup>

import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js';
const { knowledgeProfiles, selectedKnowledgeProfile, updateKnowledgeProfiles, addLink } = useKnowledgeProfiles();

// let props = defineProps({ personas: { type: Array, default: [] } })
let emit = defineEmits(['changeTab']);

const selectKp = (index) => {
    selectedKnowledgeProfile.value = { ...knowledgeProfiles.value[index] };
    emit('changeTab', 1)
};


</script>
  
