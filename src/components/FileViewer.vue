<template>
    <div class="flex h-auto dark:bg-gray-800 text-white dark:text-gray-100">
        <!-- Left Column for File List -->
        <div class="w-1/3 p-4 overflow-y-auto border-r border-gray-600">
            <div v-for="(file, key) in files" :key="key" class="py-2 px-4 my-2 hover:bg-gray-700 cursor-pointer"
                @click="selectFile(file)" @mouseover="hoverFile(file)">
                {{ file.name }} ({{ file.status }})
            </div>
        </div>

        <!-- Right Column for File Details Form -->
        <!-- {{ files }} -->
        <!-- TODO -->
        <template v-for="(file, index) in files" :key="file.uuid">
            <!-- <pre>{{ file }}</pre> -->
            <div class="w-2/3 p-4" v-if="selectedFile?.uuid && file.uuid == selectedFile.uuid">
                <form @submit.prevent>

                    <div class="space-x-2">
                        <button @click="viewFile(file.storageUrl)"
                            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                            View File
                        </button>

                        <button @click="viewFileInGoogle(file.storageUrl)"
                            class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                            Open in Google Docs
                        </button>
                    </div>

                    <div class="mb-4">
                        <label for="name" class="block mb-2 dark:text-gray-300">Name</label>
                        <input id="name" v-model="file.name"
                            class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" type="text"
                            placeholder="Enter name" />
                    </div>

                    <div class="mb-4">
                        <label for="description-en" class="block mb-2 dark:text-gray-300">Description (EN)</label>
                        <input id="description-en" v-model="file.description.en"
                            class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" type="text"
                            placeholder="Enter description in English" />
                    </div>

                    <div class="mb-4">
                        <label for="description-fr" class="block mb-2 dark:text-gray-300">Description (FR)</label>
                        <input id="description-fr" v-model="file.description.fr"
                            class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300" type="text"
                            placeholder="Enter description in French" />
                    </div>

                    <div class="mb-4">
                        <label for="context" class="block mb-2 dark:text-gray-300">Context</label>
                        <textarea id="context" v-model="file.context"
                            class="w-full p-2 border dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
                            placeholder="Enter context"></textarea>
                    </div>


                    <!-- Knowledge Profile -->
                    <!-- <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                    track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                    :show-labels="false" />

                <button @click="addPersona"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Select Persona 
                </button> -->

                    <VueMultiselect v-if="knowledgeProfiles" v-model="selectedKnowledgeProfile"
                        placeholder="Select a Knowledge Profile" label="name" track-by="name" :options="knowledgeProfiles"
                        :option-height="104" :custom-label="customLabel" :show-labels="false" />

                    <button @click="addKnowledgeProfile(file.uuid)"
                        class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                        Select Knowledge Profile
                    </button>
                    <br />
                    <div v-if="file?.knowledgeProfile?.name">
                        {{ file.knowledgeProfile.name }}<br />
                        {{ file.knowledgeProfile.description.en }}<br />
                        {{ file.knowledgeProfile.description.fr }}<br />
                    </div>

                    <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                        track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                        :show-labels="false" />

                    <button @click="addPersona(file.uuid)"
                        class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                        Select Persona
                    </button>

                    <DisplayPersona :persona="file.persona" alignment="center" />


                    <HighlightFileContents :fileUuid="file.uuid" :originalText="file.extractedFileText"
                        :highlights="file.highlights" :lastSelection="file.lastSelection"
                        @setLastSelection="setLastSelection" @addHighlight="addHighlight" @deleteHighlight="deleteHighlight"
                        @generateFacts="generateFacts" @startProcessingAndSaveFacts="startProcessingAndSaveFacts"
                        @pauseProcessing="pauseProcessing">

                        Concurrent Processes: {{ concurrentSockets }}
                    </HighlightFileContents>

                    <div v-if="file.persona">
                        <div v-for="(socket, index) in file.sockets" :key="socket.sessionId">
                            <Socket :trigger="socket.trigger" :stageIndex="file.index" :stageUuid="file.uuid"
                                :sessionId="socket.sessionId" :socketIndex="index" :userPrompt="socket.userPrompt"
                                :persona="file.persona" @messageComplete="payload => messageComplete(payload, file.uuid)" />
                        </div>
                    </div>

                    <div class="space-x-2">
                        <!-- <button @click="saveFacts(file.uuid)" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
                            Save Facts
                        </button> -->

                        <button @click="saveFile(file.uuid)" class="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded">
                            Update File
                        </button>
                    </div>

                </form>
            </div>
        </template>
    </div>
</template>
  
<script setup>
import { ref, toRefs, reactive, onMounted, nextTick } from 'vue'
import VueMultiselect from 'vue-multiselect'
import { v4 as uuidv4 } from 'uuid';
import { extractData } from '@/utils/extractJsonAndCode.js';
import { notify } from "notiwind"


import HighlightFileContents from '@/components/HighlightFileContents.vue';
import DisplayPersona from '@/components/DisplayPersona.vue';
import Socket from '@/components/Socket.vue';

import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
import { useFiles } from '@/composables/useFiles.js'
import { useFacts } from '@/composables/useFacts.js'
import { useWebsockets } from '@/composables/useWebsockets.js'
import { usePersonas } from '@/composables/usePersonas.js'
const { knowledgeProfiles, selectedKnowledgeProfile, getKnowledgeProfiles } = useKnowledgeProfiles()
const { files, selectedFile, highlight, highlightedSegments, updateFiles } = useFiles()
const { getFacts, createFacts } = useFacts()
const { sessions, sessionContent } = useWebsockets()
const { personas, selectedPersona, getPersonas } = usePersonas()

let triggerGeneration = ref(false);

let concurrentSockets = ref(10);
let processingPaused = ref(false);
onMounted(() => {
    if (!personas?.value) getPersonas();
    if (!knowledgeProfiles?.value) getKnowledgeProfiles();
})

const customLabel = (option) => option ? option.name : '';

const hoverFile = (file) => {
    // Implement logic for mouseover if needed
}



// let emit = defineEmits(['setPersona'])

const selectFile = (file) => {
    selectedFile.value = file
}


function addPersona(fileUuid) {
    files.value[fileUuid].persona = selectedPersona.value
    // emit('setPersona', selectedPersona.value)
}

function addKnowledgeProfile(fileUuid) {
    files.value[fileUuid].knowledgeProfileUuid = selectedKnowledgeProfile.value.uuid
    files.value[fileUuid].knowledgeProfile = selectedKnowledgeProfile.value;
    // emit('setPersona', selectedPersona.value)
}

function setLastSelection(val) {
    // console.log("EMIT REceived Set Selection")
    files.value[val.fileUuid].lastSelection = { start: val.start, end: val.end }
}

function addHighlight({ type, fileUuid }) {
    // console.log({ highlights: selectedFile.value.highlights, lastSelection: selectedFile.value.lastSelection, type })
    files.value[fileUuid].highlights = highlight(files.value[fileUuid].highlights, files.value[fileUuid].lastSelection, type)
}
function deleteHighlight({ index, fileUuid }) {
    if (files.value[fileUuid].highlights) files.value[fileUuid].highlights.splice(index, 1)
}

function generateFacts(fileUuid) {

    files.value[fileUuid].sockets = [];
    var highlights = highlightedSegments(files.value[fileUuid].extractedFileText, files.value[fileUuid].highlights)

    //Extract the structure and the context
    var structures = [];
    var contexts = [];
    var contents = [];
    highlights.forEach((highlight) => {
        if (highlight.type == 'structure') structures.push(highlight.content + "\n");
        else if (highlight.type == 'context') contexts.push(highlight.content + "\n");
        else if (highlight.type == 'content') contents.push(highlight.content)
    })

    var integratedPrompt = ""

    if (contexts.length) {
        integratedPrompt += "Some additional context specifically includes: " + "\n";
        contexts.forEach((context) => {
            integratedPrompt += context + "\n"
        })
    }
    if (structures.length) {
        integratedPrompt += "The structure for this content is often represented in this format: "
        structures.forEach((structure) => {
            integratedPrompt += structure + "\n"
        })
    }

    //Create the user prompt to include context and structure
    var userPrompt = "";
    if (files.value[fileUuid]?.context?.length) userPrompt = "The overall context of the following information is: " + files.value[fileUuid].context + "\n";
    userPrompt += integratedPrompt;
    userPrompt += "The content to analyze is as follows: " + "\n";

    //Manage the contents blocks
    if (contents.length) {
        contents.forEach((content, index) => {
            console.log("Contents ", index)
            var socketPayload = { sessionId: uuidv4(), userPrompt: userPrompt + content, trigger: false };
            files.value[fileUuid].sockets.push(socketPayload)
        })
    }
    //If nothing is selected, attempt to take on the whole thing, which may often be too much context and return an error
    else {
        var socketPayload = { sessionId: uuidv4(), userPrompt: userPrompt + files.value[fileUuid].extractedFileText };
        console.log("Socket Payload (Full File)", socketPayload)
        files.value[fileUuid].sockets.push(socketPayload)
    }


    //Don't auto generate anymore
    // nextTick(() => {
    //     files.value[fileUuid].triggerGeneration = !files.value[fileUuid].triggerGeneration;
    // })

    // return selectedFile.value.sockets;

}

function startProcessingAndSaveFacts(fileUuid) {

    processingPaused.value = false;
    let file = files.value[fileUuid];
    //Status array for processing?
    file.sockets.forEach((socket, index) => {
        socket.order = index;
        socket.processingStatus = 'pending';
    })

    continueProcessing(fileUuid)

}

function continueProcessing(fileUuid) {

    if (!processingPaused.value) {

        let file = files.value[fileUuid];

        let numberOfActive = file.sockets.filter((socket) => {
            return socket.processingStatus === 'processing';
        }).length;

        file.sockets.forEach((socket, index) => {
            if (numberOfActive < concurrentSockets.value) {
                if (socket.processingStatus === 'pending') {
                    socket.processingStatus = 'processing';
                    socket.trigger = !socket.trigger;
                    numberOfActive++;
                }
            }

            if(socket.processingStatus == 'completed') saveFact(fileUuid, socket)
        })
    }

}

function pauseProcessing(fileUuid) {
    processingPaused.value = true;
    notify({ group: "success", title: "Success", text: "Processing paused" }, 4000) // 4s

}


// function saveFacts(fileUuid) {
//     let file = files.value[fileUuid];
//     let rawFacts = [];
//     let parsedObjects = [];

//     file.sockets.forEach((socket) => {
//         var extracts = extractData(sessions.value[socket.sessionId].partialMessage || sessions.value[socket.sessionId].completedMessage)
//         if (extracts.json) {
//             rawFacts.push(extracts.json);
//         }
//     });

//     function parseArray(arr) {
//         arr.forEach(item => {
//             if (Array.isArray(item)) {
//                 parseArray(item);
//             } else if (typeof item === 'object' && item !== null) {
//                 parsedObjects.push(item);
//             }
//         });
//     }

//     parseArray(rawFacts);


//     var highlights = highlightedSegments(files.value[fileUuid].extractedFileText, files.value[fileUuid].highlights)

//     //Extract the structure and the context
//     var structures = [];
//     var contexts = [];
//     highlights.forEach((highlight) => {
//         if (highlight.type == 'structure') structures.push(highlight.content + "\n");
//         else if (highlight.type == 'context') contexts.push(highlight.content + "\n");
//     })

//     parsedObjects.forEach((fact) => {
//         fact.fileUuid = file.uuid;
//         fact.storageUrl = file.storageUrl;
//         fact.knowledgeProfileUuid = file.knowledgeProfileUuid;
//         fact.knowledgeProfile = file.knowledgeProfile;
//         fact.context = file.context;
//         fact.structures = structures;
//         fact.contexts = contexts;
//     })

//     createFacts(parsedObjects)
//     file.status = "complete";

//     // Now, `parsedObjects` contains all the extracted objects from `rawFacts`
//     // You can proceed to use or return the `parsedObjects` array as needed
// }


async function saveFact(fileUuid, socket) {
    let file = files.value[fileUuid];

    let rawFacts = [];
    var extracts = extractData(sessions.value[socket.sessionId].partialMessage || sessions.value[socket.sessionId].completedMessage)
    if (extracts.json) {
        rawFacts.push(extracts.json);
    }

    let parsedObjects = [];
    function parseArray(arr) {
        arr.forEach(item => {
            if (Array.isArray(item)) {
                parseArray(item);
            } else if (typeof item === 'object' && item !== null) {
                parsedObjects.push(item);
            }
        });
    }
    parseArray(rawFacts);

    var highlights = highlightedSegments(files.value[fileUuid].extractedFileText, files.value[fileUuid].highlights)

    //Extract the structure and the context
    var structures = [];
    var contexts = [];
    highlights.forEach((highlight) => {
        if (highlight.type == 'structure') structures.push(highlight.content + "\n");
        else if (highlight.type == 'context') contexts.push(highlight.content + "\n");
    })

    parsedObjects.forEach((fact) => {
        fact.fileUuid = file.uuid;
        fact.storageUrl = file.storageUrl;
        fact.knowledgeProfileUuid = file.knowledgeProfileUuid;
        fact.knowledgeProfile = file.knowledgeProfile;
        fact.context = file.context;
        fact.structures = structures;
        fact.contexts = contexts;
        if(typeof fact.fact === 'object' && fact.fact !== null) fact.fact = JSON.stringify(fact.fact)
        if(!Array.isArray(fact.keywords) && fact.keywords !== null) fact.keywords = [fact.keywords]
        if(!Array.isArray(fact.questions) && fact.questions !== null) fact.questions = [fact.questions]
    })

    try {
        await createFacts(parsedObjects)
        notify({ group: "success", title: "Success", text: "Facts created successfully" }, 4000) // 4s
        let socketIndex = file.sockets.findIndex(s => s.uuid === socket.uuid);
        if (socketIndex !== -1) files.value[fileUuid].sockets.splice(socketIndex, 1);
        continueProcessing(fileUuid);
    }
    catch (error) {
        notify({ group: "failure", title: "Error", text: "Error creating fact." }, 4000) // 4s
    }

}


function viewFile(url) {
    window.open(env.STORAGE_URL + "/" + url, '_blank');
}

function viewFileInGoogle(url) {
    window.open(`https://docs.google.com/viewer?url=${env.STORAGE_URL + "/" + url}&embedded=true`, '_blank');
}


function saveFile(fileUuid) {
    let file = files.value[fileUuid];
    updateFiles([file])

}

const submitForm = () => {
    // Implement form submission logic
    // console.log('Form Submitted:', selectedFileDetails)
}

function messageComplete(val, fileUuid) {
    console.log("Message Complete", { val, fileUuid })
    let socket = files.value[fileUuid].sockets.find((socket) => { return socket.sessionId == val.sessionId })
    socket.processingStatus = 'completed'
    if (socket) saveFact(fileUuid, socket)
    // files.value[fileUuid].sockets.forEach((socket) => {
    //     if (socket.status == 'waiting') console.log('socket waiting', socket)
    // })
}
</script>
  
<style>
/* You can add additional styles here if needed */
</style>