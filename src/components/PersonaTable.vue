<template>
    <div class="flex flex-col-reverse md:flex-row dark:bg-gray-800">
        <div class="w-full  p-4 dark:border-gray-700 md:order-2">
            <table class="w-full" v-if="personas">
                <thead>
                    <tr>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Avatar</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Name</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Description</th>
                        <th class="border dark:border-gray-700 dark:text-gray-300">Interact</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(persona, index) in personas" :key="index" 
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td @click="selectPersona(index)" class="border dark:border-gray-700 dark:text-gray-300 p-3">
                            <img v-if="persona.url" class="object-cover rounded-t-lg md:h-24 md:w-24 rounded"
                                :src="persona.url" alt="" />
                            <img v-else class="object-cover rounded-t-lg md:h-24 md:w-24 rounded" :src="defaultImage"
                                alt="" />
                        </td>
                        <td @click="selectPersona(index)" class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ persona.name }} {{ persona.isOwner ? "" : " (Contributor)" }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ persona.description.en }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">
                            

                            <button  @click="openChat(persona.uuid)" class="btn bg-blue-500 text-white dark:bg-blue-700">Chat</button>

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>


    </div>
</template>
  
<script setup>

import defaultImage from "../images/persona1.png";
import { useRouter } from 'vue-router';

import { usePersonas } from '@/composables/usePersonas.js';
const { personas, selectedPersona, resetPersona } = usePersonas();

let emit = defineEmits(['changeTab']);
const router = useRouter();

const selectPersona = (index) => {
    selectedPersona.value = { ...personas.value[index] };
    resetPersona();
    emit('changeTab', 1)
};

const openChat = (uuid)=>{

    router.push({ name: "chat", params: { personaId: uuid } });


}
</script>
  
