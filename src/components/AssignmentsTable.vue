<template>
    <div class="flex flex-col-reverse md:flex-row dark:bg-gray-800">
        <div class="w-full  p-4 dark:border-gray-700 md:order-2">

 
            <button @click="saveAssignments"
                class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                Save Assignments
            </button>

            <table class="w-full" v-if="localAssignmentList">
                <thead>
                    <tr>
                        <!-- <th class="border dark:border-gray-700 dark:text-gray-300">Code</th> -->
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name (EN)</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name (FR)</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Persona</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in localAssignmentList" :key="'localAssignment' + index"
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">

                        <!-- <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ item.code }}</td> -->
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ item.name.en }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ item.name.fr }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">

                            <VueMultiselect v-if="personas" v-model="item.persona" placeholder="Select a persona"
                                label="name" track-by="name" :options="personas" :option-height="104"
                                :custom-label="customLabel" :show-labels="false" />

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>
  
<script setup>
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick, watch, watchEffect, computed, reactive } from 'vue';
import VueMultiselect from 'vue-multiselect'

//Composables
import { useAssignments } from '@/composables/useAssignments.js';
const { assignments, createAssignments, deleteAssignments } = useAssignments();
const customLabel = (option) => option ? option.name : '';

let localAssignmentList = ref(null)
const props = defineProps({
    personas: { type: Array, default: [] },
    wrappUuid: { type: String },
    rosterUuid: { type: String },
    assignmentList: { type: Array, default: [] },
})

const emit = defineEmits(['save'])

onBeforeMount(() => {
})

onMounted(() => {
    localAssignmentList.value = props.assignmentList;
})

function saveAssignments() {
    localAssignmentList.value.forEach((assignment) => {
        assignment.personaUuid = assignment.persona.uuid;
    })

    createAssignments(props.wrappUuid, props.rosterUuid, localAssignmentList.value);
}

</script>
  
