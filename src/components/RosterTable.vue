<template>
    <div class="flex flex-col-reverse md:flex-row dark:bg-gray-800">
        <div class="w-full  p-4 dark:border-gray-700 md:order-2">
            <table class="w-full" v-if="rosters">
                <thead>
                    <tr>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Brand</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Description</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Number of Rosters</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(roster, index) in rosters" :key="index" @click="selectRoster(index)"
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">
                            <img v-if="roster.url" class="object-cover rounded-lg md:w-48 h-auto  rounded"
                                :src="roster.url" alt="" />
                        </td>

                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ roster.name }} {{ roster.isOwner ? "" : " (Contributor)" }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ roster.description.en }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ roster.personasCount }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
  
<script setup>


import { useRosters } from '@/composables/useRosters.js';
const { rosters, selectedRoster, resetRoster } = useRosters();

let emit = defineEmits(['changeTab']);

const selectRoster = (index) => {
    selectedRoster.value = { ...rosters.value[index] };
    resetRoster();
    emit('changeTab', 1)
};

</script>
  
