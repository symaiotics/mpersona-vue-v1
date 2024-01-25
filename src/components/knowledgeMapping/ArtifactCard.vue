<template>
    <div  @click = "emitEventSelect" class="card bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 m-4">

        <div v-if="props.data" class="card-content">

            <p v-if="props?.data?.prompt" class="w-full text-xl dark:text-white">
                Prompt: <span class = "font-semibold">{{ props.data.prompt.substring(0, 100) }}...</span>
            </p>

            <p v-if="props?.data?.message" class="w-full  text-xl  dark:text-white">
                Message: <span class = "font-semibold">{{ props.data.message.substring(0, 100) }}... </span>
            </p>

            <p v-if="props?.data?.finalText?.en" class="w-full  text-xl  dark:text-white">
                Final (EN): <span class = "font-semibold">{{ props.data.finalText.en.substring(0, 100) }}... </span>
            </p>
            <p v-if="props?.data?.finalText?.fr" class="w-full  text-xl  dark:text-white">
                Final (FR): <span class = "font-semibold">{{ props.data.finalText.fr.substring(0, 100) }}... </span>
            </p>


            <p v-if="props?.data?.createdBy" class="w-full  text-xl  dark:text-white">
                Created by: <span class = "font-semibold"> {{ props.data.createdBy }}</span>
            </p>


         
            <div class="scoring mt-4">

                <div class="score-item">
                    <span class="font-bold dark:text-white">Audited:</span> {{ audited }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Chat:</span> {{hasChatHistory }}
                </div>


                <div class="score-item">
                    <span class="font-bold dark:text-white">Completeness:</span> {{ props.data.completeness }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Accuracy:</span> {{ props.data.accuracy }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Tone:</span> {{ props.data.tone }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Overall:</span> {{ props.data.overall }}
                </div>
                <div class="score-item">
                    <span class="font-bold dark:text-white">Comments:</span> {{ props.data.comments }}
                </div>
            </div>


        </div>
        <div v-else class="text-center text-gray-600 dark:text-gray-400">
            No data available.
        </div>
    </div>
</template>
  
<script setup>
import { computed, ref } from 'vue';

const props = defineProps({
    data: Object
});

const emit = defineEmits(['select'])

const audited = computed(() => props.data.auditJson !== null);
const hasChatHistory = computed(() => (props.data.messageHistory && props.data.messageHistory.length > 0|| props.data.chatMessageHistory && props.data.chatMessageHistory.length > 0));

const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
};

function emitEventSelect()
{
emit('select')
}
</script>
  
<style scoped>
.card-content {
    /* max-width: 400px; */
}

.score-item {
    margin-bottom: 0.5rem;
}
</style>