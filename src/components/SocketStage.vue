<template>
    <div class="flex flex-col md:flex-row">

        <!-- First Column -->
        <div class="w-full md:w-1/4 p-4">
            <p>Stage {{ props.stageIndex + 1 }}</p>

            <!-- {{ localModel }} -->
            <!-- <p>Select your model</p> -->
            <VueMultiselect v-model="localModel" @update:modelValue='handleUpdateModel' :options="adminModels"
                :searchable="false" :close-on-select="false" :custom-label="customLabelModel" :show-labels="false"
                placeholder="Pick a model" />

            <!-- User Prompt -->
            <textarea :value="props.userPrompt" @input="updateUserPrompt($event.target.value)" id="response" rows="4"
                class="form-textarea w-full " placeholder="Enter your prompts here"></textarea>


            <!-- Append Previous Outputs-->
            <div v-if="props.stageIndex" class=" mb-2">
                <label v-if="props.stageIndex" for="includePrevOutput" class="ml-2 text-gray-700 dark:text-gray-300">
                    Append Previous Output</label>
                <VueMultiselect v-if="props.stageIndex" v-model="localSelectedSessionsContent"
                    @update:modelValue='handleSessionContentInput' :options="sessionsContentFiltered" :searchable="true"
                    :close-on-select="false" :custom-label="customLabelContent" :multiple="true" :show-labels="false"
                    label="label" track-by="label" placeholder="Append previous content" />

                <AppendOptions v-if="localSelectedSessionsContent.length" :options="props.options"
                    @update:options="handleUpdateOptions" />
                <!-- {{ stageOptions }} -->
            </div>

            <!-- Buttons -->
            <div class="flex flex-wrap items-center space-x-2 space-y-2">

                <div class="flex flex-wrap items-center space-y-2 w-full">
                    <button @click="generateStage"
                        class="whitespace-nowrap w-auto md:w-full self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold p-3 rounded ">
                        Generate Stage
                    </button>

                    <button @click="deleteStage"
                        class="whitespace-nowrap w-full md:w-auto flex-grow bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold p-3 rounded md:mr-2 ">
                        Delete Stage
                    </button>

                    <!-- Up Chevron Button -->
                    <button v-if="props.stageIndex" @click="moveStageUp"
                        class="bg-blue-500 text-white rounded flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150 mr-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 -4 24 24"
                            fill="currentColor" class="w-12 h-12">
                            <path d="M12 6l-4 4h8z" />
                        </svg> </button>

                    <!-- Down Chevron Button -->
                    <button @click="moveStageDown"
                        class="bg-red-500 text-white rounded flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 32"
                            fill="currentColor" class="w-12 h-12">
                            <path d="M12 18l-4-4h8z" />
                        </svg>
                    </button>
                </div>

            </div>
        </div>

        <!-- Second Column -->

        <div class="w-full md:w-3/4 p-4">

            <p>Select your personas</p>
            <div class="flex items-center">

                <!-- {{ personas }} -->
                <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                    track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                    :show-labels="false" />

                <button @click="addToSockets"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Add to Stage
                </button>

            </div>


            <!-- TODO change this from the persona Roster-->
            <!-- TODO Fix the key-->
            <template v-for="(socket, index) in props.sockets" :key="'stageSocket'+index">
                <!-- {{ props }} -->
                <!-- {{ localModel }} -->
                <!-- {{ socket.knowledgeProfiles.map((kp)=>{return kp.uuid}) }} -->
                <Socket 
                :trigger="triggerGeneration" 
                :stageIndex="props.stageIndex" 
                :stageUuid="props.stageUuid"
                :sessionId="socket.sessionId" 
                :socketIndex="index" 
                :userPrompt="props.userPrompt"
                :model="localModel" 
                :temperature="0.5" 
                :persona="socket.persona"
                :appendedContent="localSelectedSessionsContent" 
                :knowledgeProfileUuids = "socket.knowledgeProfiles ? socket.knowledgeProfiles.map((kp)=>{return kp.uuid}): []"
                @like="like(persona)" 
                @close="removeFromSockets(index)"
                @edit="edit(persona)" 
                @addSocket="addSocket" 
                @removeSocket="removeSocket"
                :stageOptions="props.options" >

                <KnowledgeProfileSelector :index = "index" :selected = "socket.knowledgeProfiles" @knowledgeProfilesUpdate="knowledgeProfilesUpdate" />
                </Socket>   
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';

//Libs
import VueMultiselect from 'vue-multiselect'

//Components
import Socket from '@/components/Socket.vue'
import KnowledgeProfileSelector from '@/components/KnowledgeProfileSelector.vue'
import AppendOptions from '@/components/AppendOptions.vue'

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js'
import { useModels } from '@/composables/useModels.js'
import { usePrompts } from '@/composables/usePrompts.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { sessionsContent, sessions } = useWebsockets()
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories, updatePersonas } = usePersonas()
const { categories, selectedCategory, getCategories } = useCategories()
const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()
const { adminModels, selectedModel } = useModels()

//Definitions
// let userPrompt = ref("");
// let personaRoster = ref([]);
let triggerGeneration = ref(false);
let localSelectedSessionsContent = ref([]);
let localModel = ref(null)
let stageOptions = ref(null);
let props = defineProps({

    selectedSessionsContent: { type: Array, default: [] },
    userPrompt: { type: String, default: "" },
    sockets: { type: Array, default: [] },
    stageIndex: { type: Number, default: 0 },
    stageUuid: { type: String },
    options: { type: Object },
    model: { type: Object },

})

let emit = defineEmits(['deleteStage', 'moveStageUp', 'moveStageDown', 'addToSockets', 'removeFromSockets', 'update:userPrompt', 'update:options', 'update:model', 'updateSessionContent', 'addSocket', 'removeSocket', 'knowledgeProfilesUpdate'])

//Tabs
let activeTab = ref(0)
const tabs = ref([
    { label: 'Interact' },
    { label: 'Edit' },
    { label: 'Results' },
]);

//Multiselect
const customLabel = (option) => option ? option.name : '';
const customLabelModel = (option) => option ? option.name.en: '';
const customLabelContent = (option) => option ? ("(" + (option.stageIndex + 1) + "." + (option.socketIndex + 1) + "): " + (option.content.length ? option.content.slice(0, 25) : "Content pending...")) : '';

let sessionsContentFiltered = computed(() => {
    return sessionsContent.value.filter((session) => { return session.stageIndex != props.stageIndex })
})

//Lifecycle hooks
onMounted(() => {
    getPersonas();
    getUsedCategories();
    if (props.selectedSessionsContent) localSelectedSessionsContent.value = props.selectedSessionsContent;
    console.log("PROPS MODEL", props.model)
    if (props.model) localModel.value = props.model;
    // else localModel.value =  //default to the first model
})

// TODO update so the selectedSessionContent (selectedStageContent?) is saved into the stage itself
// const selectedSessionContent = computed(() => props.selectedSessionContent);


watch(sessionsContent, (newValue, oldValue) => {
    //Update the selected 
    //props.selectedSessionsContent
    localSelectedSessionsContent.value.forEach((tag, index, origArray) => {
        if (sessions.value[tag.sessionId]) {

            //TODO, emit instead?
            tag.content = (sessions.value[tag.sessionId].partialMessage || sessions.value[tag.sessionId].completedMessage)
            tag.completed = sessions.value[tag.sessionId].completedMessage.length > 0 ? true : false;
            // console.log(tag)
            // tag.extracts = sessions.value[tag.sessionId].extracts;
            // tag.extracts = tag.completed? extractData(tag.content) : {json:[], code:[]};
        }
        else {
            emit('removeSessionContent', index)
            origArray.splice(index, 1)
        }
    })
});

//Functions
function addToSockets() {
    if (selectedPersona.value) emit('addToSockets', { persona: JSON.parse(JSON.stringify(selectedPersona.value)), stageIndex: props.stageIndex, stageUuid: props.stageUuid })
}

function removeFromSockets(index) {
    emit('removeFromSockets', { index, stageIndex: props.stageIndex })
}

function generateStage() {
    triggerGeneration.value = !triggerGeneration.value; //Toggle - change is detected down stream
}

function deleteStage() {
    emit('deleteStage', props.stageIndex);
}

function moveStageUp() {
    emit('moveStageUp', props.stageIndex);
}
function moveStageDown() {
    emit('moveStageDown', props.stageIndex);
}

function like(persona) {
    console.log("Liked Persona", persona);
}

function edit(persona) {
    activeTab.value = 1;
}

//Updat the userPrompt back to the parent
const updateUserPrompt = (newValue) => {
    emit('update:userPrompt', newValue);
};

function handleUpdateOptions(newOptions) {
    emit('update:options', { stageIndex: props.stageIndex, options: newOptions });
}

function handleUpdateModel(currentModel) {
    emit('update:model', { stageIndex: props.stageIndex, model: currentModel });
}

const handleSessionContentInput = (newValue) => {
    // console.log("SessionContent changed", newValue)
    emit('updateSessionContent', { newValue: newValue, stageIndex: props.stageIndex });
};

function knowledgeProfilesUpdate(val) {
    val.stageIndex = props.stageIndex;
    emit('knowledgeProfilesUpdate', val)
}

function addSocket(val) {
    console.log("SocketStage addSocket: still useful?", val)
    // emit('addSocket', val)
}


function removeSocket(val) {
    console.log("SocketStage removeSocket: still useful?", val)
    // emit('removeSocket', val)
}




</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

