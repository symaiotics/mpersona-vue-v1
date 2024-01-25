<template>
    <div class="w-full">

        <!-- Main Container -->
        <div
            class="p-1 bg-white border border-gray-200 rounded-lg shadow md:flex-row hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 relative">
            <!-- Persona Template -->
            <template v-if="props?.persona">
                <div class="flex row">
                    <div class="flex-col">
                        <img v-if="props.persona.url" class="object-cover w-full rounded-t-lg md:h-24 md:w-24 rounded"
                            :src="props.persona.url" alt="">
                        <img v-else class="object-cover w-full rounded-t-lg md:h-24 md:w-24 rounded" :src="defaultImage"
                            alt="">
                    </div>
                    <div class="flex-col leading-normal pl-3 pr-2 pt-3">
                        <h5
                            class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white whitespace-wordwrap">
                            {{ props.persona.name }}</h5>
                        <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">{{ props.persona.description.en }}.</p>
                    </div>
                </div>
            </template>

            <!-- {{ userPrompt }} -->
            <!--Slot ofr Knowledge Profile Selector-->
            <slot>


            </slot>

            <!-- Interim and final message section -->
            <div v-if="partialMessage && !messageHistory.length" v-html="partialMessageMarkdown"
                class="border w-full transition duration-300 preserve-whitespace-pre-line p-4 pt-10 rounded-md"></div>

            <div v-if="completedMessage && !messageHistory.length" class="relative">
                <div class="absolute top-0 right-0 flex space-x-4 p-4">
                    <StarIcon @click="like"
                        class="h-6 w-6 dark:text-yellow-400 text-yellow-600 transform hover:scale-105 transition-transform duration-150" />
                    <TrashIcon @click="clear"
                        class="h-6 w-6 dark:text-gray-200 text-gray-600 transform hover:scale-105 transition-transform duration-150" />
                </div>
                <EditContent class="w-full p-4 pt-10" v-model:content="sessions[sessionId].completedMessage" />
            </div>

            <div v-if="editPersona">
                <EditContent v-if="props.persona && editPersona" class="w-full"
                    v-model:content="props.persona.basePrompt" />
            </div>

            <!-- Close and Edit Buttons -->
            <!-- <ButtonWait /> -->
            <ButtonWait v-if="partialMessage" />
            <ButtonGenerate v-if="!partialMessage" @generate="sendMessage" />
            <ButtonEdit @edit="onEditClick" />
            <ButtonClose @close="onCloseClick" />

            <div class="flex flex-wrap space-x-1" v-if = "thisSessionsContent?.[0]?.content?.length">
                <ClipboardPlus @click="copyToClipboard(stripHtmlTags(completedMessageMarkdown))"
                    class="text-black dark:text-white hover:text-gray-600 dark:hover:text-gray-300" :size="48" />

                <template v-if="thisSessionsContent?.[0]?.extracts?.json">
                    <div v-for="(json, index) in thisSessionsContent[0].extracts.json"
                        :key="'socket' + sessionId + index">

                        <CodeJson @click="copyToClipboard(json)" class="text-black dark:text-white" :size="48" />

                    </div>
                </template>

                <template v-if="thisSessionsContent?.[0]?.extracts?.code">
                    <div v-for="(code, index) in thisSessionsContent[0].extracts.code"
                        :key="'socket' + sessionId + index">
                    
                        <LanguageJavascript v-if = "code.key == 'javascript'" @click="copyToClipboard(code.code)" class="text-black dark:text-white" :size="48" />
                        <LanguageHtml v-else-if = "code.key == 'html'" @click="copyToClipboard(code.code)" class="text-black dark:text-white" :size="48" />
                        <LanguageMarkdown v-else @click="copyToClipboard(code.code)" class="text-black dark:text-white" :size="48" />

                    </div>
                </template>
            </div>
       </div>
 
        <div v-if="sessions?.[sessionId]?.completedMessage?.length && (sessions[sessionId].completedMessage.includes('# Slide') || sessions[sessionId].completedMessage.includes('# Diapositive'))"
            class="w-full h-96 pointer-events-none" aria-hidden="true">
            <MarkdownReveal :markdownContent="sessions[sessionId].completedMessage" />
        </div>
    </div>
</template>

<script setup>
import { extractData } from '@/utils/extractJsonAndCode.js';
import { notify } from "notiwind"

import { ref, onMounted, onBeforeUnmount, computed, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import defaultImage from "../images/persona1.png"

import CodeJson from 'vue-material-design-icons/CodeJson.vue';
import LanguageJavascript from 'vue-material-design-icons/LanguageJavascript.vue';
import LanguageHtml from 'vue-material-design-icons/LanguageHtml5.vue';
import LanguageMarkdown from 'vue-material-design-icons/LanguageMarkdown.vue';
import FileWord from 'vue-material-design-icons/FileWord.vue';
import ClipboardPlus from 'vue-material-design-icons/ClipboardPlus.vue';

// import { StarIcon } from '@heroicons/vue/outline';
import { StarIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'
import { CloudIcon } from '@heroicons/vue/24/solid'

import MarkdownIt from 'markdown-it';

//Components
import ButtonClose from '@/components/ButtonClose.vue';
import ButtonEdit from '@/components/ButtonEdit.vue';
import ButtonGenerate from '@/components/ButtonGenerate.vue';
import ButtonWait from '@/components/ButtonWait.vue';
import EditContent from '@/components/EditContent.vue';
import MarkdownReveal from '@/components/MarkdownReveal.vue';

//Composables
import { useWebsockets } from '@/composables/useWebsockets.js';
// import { useExecutor } from '@/composables/useExecutor.js';
const { wsUuid, sessions, sessionsContent, registerSession, unregisterSession, updateSession, sendToServer } = useWebsockets();
// const { actionJson } = useExecutor();

//Props
const props = defineProps({
    trigger: { type: Boolean, default: false },

    stageIndex: { type: Number },
    stageUuid: { type: String },

    sessionId: { type: String, default: () => uuidv4() },
    socketIndex: { type: Number },

    messageHistory: { type: Array, default: [] },
    userPrompt: { type: String, default: "" },
    model: { type: Object, default: null },
    temperature: { type: Number, default: 0.5 },
    persona: { type: Object },

    appendedContent: { type: Array, default: [] },
    facts: { type: Array, default: [] },
    knowledgeProfileUuids: { type: Array, default: [] },
    knowledgeProfiles: { type: Array, default: [] },
    stageOptions: { type: Object, default: null },

});

let processing = ref(false);
const trigger = computed(() => props.trigger);
let isFocused = ref(false)

const facts = computed(() => props.facts);
const model = computed(() => props.model); // includes provider and model name for various LLM APIs
const appendedContent = computed(() => props.appendedContent);
const stageIndex = computed(() => props.stageIndex);
const stageUuid = computed(() => props.stageUuid);
const socketIndex = computed(() => props.socketIndex);
const stageOptions = computed(() => props.stageOptions);
const knowledgeProfileUuids = computed(() => props.knowledgeProfileUuids);
const messageHistory = computed(() => props.messageHistory);

const thisSessionsContent = computed(() => sessionsContent.value.filter((session) => { return session.sessionId == props.sessionId }));
const userPrompt = computed(() => props.userPrompt);
const sessionId = computed(() => props.sessionId);

const emit = defineEmits(['edit', 'close', 'like', 'addSocket', 'removeSocket', 'messageComplete', 'messagePartial', 'messageError']
);

let editPersona = ref(false)

const partialMessage = computed(() => {
    if (sessions?.value) {
        const session = sessions.value[sessionId.value];  // Use the sessionId prop to access the correct session
        return session ? session?.partialMessage : '';
    }
    else return "";
});

const completedMessage = computed(() => {
    if (sessions?.value) {
        const session = sessions.value[sessionId.value];  // Use the sessionId prop to access the correct session
        return session ? session?.completedMessage : '';
    }
    else return "";
});

const errorMessage = computed(() => {
    if (sessions?.value) {
        const session = sessions.value[sessionId.value];  // Use the sessionId prop to access the correct session
        return session ? session?.errorMessage : '';
    }
    else return "";
});



watch(stageIndex, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(stageUuid, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(socketIndex, (newValue, oldValue) => {
    updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});

watch(trigger, (newValue, oldValue) => {
    //Execute this socket
    sendMessage();
});

watch(appendedContent, (newValue, oldValue) => {
    var contentCompleted = true;
    appendedContent.value.forEach((tag) => {
        if (!tag.completed) contentCompleted = false;
    })
    //Execute this socket
    // console.log("contentCompleted", contentCompleted)
    if (appendedContent.value.length && contentCompleted) sendMessage();
}, { deep: true });

watch(completedMessage, (newValue, oldValue) => {
    console.log("Completed Change")
    console.log(completedMessage)
    console.log("New Value", newValue)
    console.log("Old Value", oldValue)
    if (!oldValue.length && newValue.length) {
        processing.value = false;

        emit('messageComplete', {message: newValue, sessionId:sessionId.value});

        if (thisSessionsContent.value.length) {
            // console.log(thisSessionsContent.value[0])
            // console.log(thisSessionsContent.value[0].extracts)
            // console.log(thisSessionsContent.value[0].extracts.value.json)
            // actionJson(thisSessionsContent.value[0].extracts.value.json)
        }
    }
    // updateSession(sessionId.value, stageIndex, stageUuid, socketIndex)
});


watch(partialMessage, (newValue, oldValue) => {
        emit('messagePartial', {message: newValue, sessionId:sessionId.value});
 });

watch(errorMessage, (newValue, oldValue) => {
    // console.log("Error message", newValue);
    if (!oldValue?.length && newValue?.length) {
        notify({ group: "failure", title: "Error", text: newValue }, 8000) // 4s

        emit('messageError');


        sessions.value[sessionId.value].errorMessage = "";
        processing.value = false;
    }
});

onMounted(() => {
    registerSession(sessionId.value, props.stageIndex, props.stageUuid, props.socketIndex, props.persona)
    emit('addSocket', { persona: props.persona, sessionId: sessionId.value, stageIndex: props.stageIndex, stageUuid: props.stageUuid, socketIndex: props.socketIndex })
})

onBeforeUnmount(() => {
    unregisterSession(sessionId.value, props.stageIndex, props.stageUuid, props.socketIndex)
    emit('removeSocket', { persona: props.persona, sessionId: sessionId.value, stageIndex: props.stageIndex, stageUuid: props.stageUuid, socketIndex: props.socketIndex })
})

function sendMessage() {


    if (wsUuid?.value) {

        if (!processing.value) {


            if(sessions?.value?.[sessionId?.value])sessions.value[sessionId.value].completedMessage = "";
            var combinedPrompt = userPrompt.value;


            // All content - original text output
            if (stageOptions?.value?.allContent) {
                appendedContent.value.forEach((prompt) => {
                    combinedPrompt += "\n" + prompt.content;
                })
            }

            // All artifacts or code
            if (!stageOptions?.value?.allContent && (stageOptions?.value?.allArtifacts || stageOptions?.value?.code)) {

                appendedContent.value.forEach((prompt, index, origArray) => {
                    var filteredContent = sessionsContent.value.filter((session) => { return session.sessionId == prompt.sessionId })
                    console.log("Filtered Content", filteredContent)
                    if (filteredContent.length) {
                        var extracts = filteredContent[0].extracts.value; //get the extracts when they are needed
                        // console.log("sessions.value[prompt.sessionId]", sessions.value[prompt.sessionId])
                        // console.log(index, prompt)
                        if (extracts.code) {
                            extracts.code.forEach((code) => {
                                combinedPrompt += "\n" + code.code;
                            })
                        }
                    }
                })
            }

            // All artifacts or json
            if (!stageOptions?.value?.allContent && (stageOptions?.value?.allArtifacts || stageOptions?.value?.json)) {
                appendedContent.value.forEach((prompt) => {
                    var filteredContent = sessionsContent.value.filter((session) => { return session.sessionId == prompt.sessionId })
                    console.log("Filtered Content", filteredContent)
                    if (filteredContent.length) {
                        var extracts = filteredContent[0].extracts.value; //get the extracts when they are needed
                        if (extracts.json) {
                            extracts.json.forEach((json) => {
                                combinedPrompt += "\n" + JSON.stringify(json);
                            })
                        }
                    }
                })
            }

            // var useModel = "gpt-4";
            // if (props?.model?.model) useModel = props.model.model;
            // if (model?.value?.model) useModel = model.value.model;
            // console.log("PROMPT: ", { combinedPrompt, useModel })


            var basePrompt = props?.persona?.basePrompt || "";


            //Include any are provided as props 
            var factPrompt = ""
            var topScore = 0;
            if (facts?.value?.length) {
                factPrompt += "Your instructions are found below this reference information.\n\nReference Information:\n\nOnly if applicable to the prompt, use these facts and questions in your answer where applicable:\n\n"
                facts.value.forEach((fact, index, origArray) => {
                    if (index == 0) topScore = fact.score;

                    //ONly take the top X results and only if they are in the top 50%
                    if (index < 20 && fact.score >= (topScore / 2)) {
                        factPrompt += fact.fact + "\n";
                    }
                })
                basePrompt = factPrompt + "\n\nYour instructions are as follows: \n\n" + basePrompt;
            }

            console.log("User Prompt", combinedPrompt)
            console.log("Combined System Prompt", basePrompt)

            //Format is always : uuid, session, model, temperature, systemPrompt, userPrompt, knowledgeProfileUuids, type
            let useKps = [];
            if(props?.persona?.knowledgeProfiles?.length) useKps =  props.persona.knowledgeProfiles.map((kp)=>{return kp.uuid}) 
            if(knowledgeProfileUuids?.value?.length) useKps = knowledgeProfileUuids.value;
            sendToServer(wsUuid.value, sessionId.value, model.value.provider || 'openAi', model.value.model || 'gpt-4', props.temperature, basePrompt, combinedPrompt, messageHistory.value, useKps, 'prompt')
            processing.value = true;

        }
    }
}

function like() {
    emit('like');
}

function clear() {

    // sessions.value[sessionId.value].completedMessage = "";
    if(sessions?.value?.[sessionId?.value])sessions.value[sessionId.value].completedMessage = "";

    // emit('clearCompletedMessage', sessionId);
}

const onCloseClick = () => {
    emit('close', props.socketIndex);
};

const onEditClick = () => {
    editPersona.value = !editPersona.value;
    // emit('edit');
};

const partialMessageMarkdown = computed(() => {
    const md = new MarkdownIt();
    return md.render(partialMessage.value);
});

const md = new MarkdownIt();


const completedMessageMarkdown = computed(() => {
    return md.render(completedMessage.value);
});

async function copyToClipboard(text) {

    if (typeof text == 'object') text = JSON.stringify(text);
    try {
        await navigator.clipboard.writeText(text);
        notify({ group: "success", title: "Success", text: "Content copied" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

function stripHtmlTags(htmlString) {
    const temporaryDiv = document.createElement('div');
    temporaryDiv.innerHTML = htmlString;
    return temporaryDiv.textContent || temporaryDiv.innerText || '';
}


</script>



<style>
.card {
    display: flex;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 5px;
}

.left-section,
.center-section,
.right-section {
    display: flex;
    align-items: center;
}

.left-section {
    flex: 1;
    margin-right: 10px;
}

.center-section {
    flex: 3;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-right: 10px;
    /* Adjust margin as necessary */
}

.right-section {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}



.rounded-image {
    border-radius: 50%;
    width: 50px;
    height: 50px;
}

.title {
    margin: 0;
}

.subtitle {
    margin: 0;
}

.icon-circle {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #eee;
    margin: 0 5px;
}

.status-icon {
    background-color: green;
    /* Adjust based on the status */
}
</style>
<!-- 
<style src="reveal.js/dist/reveal.css"></style>
<style src="reveal.js/dist/theme/black.css"></style> -->

