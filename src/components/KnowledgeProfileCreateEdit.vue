<template>
    <div class="flex flex-wrap -mx-3 mb-1">

        <div class="w-full px-3">
            <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                <span>Reset</span>
            </button>
        </div>
        <!-- {{ localKnowledgeProfile.description.en }} -->
        <template v-if="localKnowledgeProfile">
            <div class="w-full  m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                    Profile Name
                    <span class="text-red-600">*</span>
                </label>
                <input v-model="localKnowledgeProfile.name" id="first-name" type="text" class="form-input w-full"
                    placeholder="Enter the name of the knowledge Profile" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-description">
                    Description
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localKnowledgeProfile.description.en" id="persona-description" type="text"
                    class="form-input w-full" placeholder="Enter a brief description" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                    Knowledge Sources
                </label>
                <!-- <span class="text-sm text-grey-500">Optional</span> -->
                <textarea v-model="localKnowledgeProfile.sources" id="message" rows="8" class="form-textarea w-full"
                    placeholder="Define the knowledge sources. Future personas will be able to fetch this autonomously and monitor for changes."></textarea>

            </div>
            
            <div class="w-full  m-2">
                <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                        Knowledge Context
                    </label>
                    <span class="text-sm text-red-500">* Required</span>
                </div>
                <textarea v-model="localKnowledgeProfile.context" id="message" rows="8" class="form-textarea w-full"
                    placeholder="Define the knowledge context" required></textarea>
                <p> What is the context of this knowledge?  </p>
            </div>


            <div class="m-4 spacing-x-2">
                <div  v-if="localKnowledgeProfile.isOwner || localKnowledgeProfile.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Viewer Link</label>
                    <p v-if="localKnowledgeProfile.viewerLink">{{ localKnowledgeProfile.viewerLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createLink('viewerLink')"
                            class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Viewer Link</button>
                        <button v-if="localKnowledgeProfile.viewerLink"
                            @click="copyToClipboard(localKnowledgeProfile.viewerLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>

                </div>

                <div  v-if="localKnowledgeProfile.isOwner || localKnowledgeProfile.isEditor">
                    <label for="url" class="block mb-2 dark:text-gray-300">Editor Link</label>
                    <p v-if="localKnowledgeProfile.editorLink">{{ localKnowledgeProfile.editorLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                    <div class="flex space-x-4">
                        <button @click="createLink('editorLink')"
                            class="px-4 py-2 bg-blue-500 text-white dark:bg-blue-700">Create
                            Editor Link</button>
                        <button v-if="localKnowledgeProfile.editorLink"
                            @click="copyToClipboard(localKnowledgeProfile.editorLink)"
                            class="px-4 py-2 bg-gray-500 text-white dark:bg-gray-700">Copy Link</button>
                    </div>
                </div>
            </div>

            <div v-if="!localKnowledgeProfile?._id" class="w-full px-3">
                <button @click="createNewKnowledgeProfile"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Create Knowledge Profile</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>
            </div>

            <div v-if="localKnowledgeProfile?._id" class="w-full px-3">
                <button @click="updateExistingKnowledgeProfile"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Update Knowledge Profile</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>
            </div>


            <div  class="w-full px-3">
                <button @click="downloadJsonl"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Download JSONL Facts for Fine-Tuning</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>
            </div>


            <div v-if="!token" class="w-full  text-center">
                <p>
                    Note: You are <b>not</b> logged in, so any knowledge profiles you create will be visible and usable
                    by
                    the public.
                </p>
                <p>If you would like to keep your knowledge profile private, please <router-link to="/join"> make a
                        free
                        account.</router-link></p>
            </div>

            <div v-if="token" class="w-full text-center">
                <p>Since you are logged in, your knowledge profile will only be visible to you and anyone you share it
                    with.</p>
            </div>
        </template>
    </div>
</template>

<script setup>
import env from "@/env.js"

import { ref, onMounted, onBeforeMount } from 'vue';
import { generate, count } from "random-words";
import { notify } from "notiwind"
import { v4 as uuidv4 } from 'uuid';

//Composables
import { useTokens } from '@/composables/useTokens.js'
import { useFacts } from '@/composables/useFacts.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'

const { token, tokenDecoded } = useTokens()
const { getJsonl } = useFacts()
const { newKnowledgeProfile, selectedKnowledgeProfile, defaultKnowledgeProfile, addNewKnowledgeProfile, createKnowledgeProfiles, updateKnowledgeProfiles, addLink } = useKnowledgeProfiles()

let props = defineProps({ knowledgeProfile: { type: Object } })
let localKnowledgeProfile = ref({})

onBeforeMount(() => {
    localKnowledgeProfile.value = defaultKnowledgeProfile;
})


onMounted(() => {
    if (props.knowledgeProfile) localKnowledgeProfile.value = props.knowledgeProfile
})

function add() {
    addNewKnowledgeProfile();;
    localKnowledgeProfile.value = newKnowledgeProfile.value;

}


function createNewKnowledgeProfile() {
    createKnowledgeProfiles(localKnowledgeProfile.value);
}

function updateExistingKnowledgeProfile() {
    updateKnowledgeProfiles(localKnowledgeProfile.value);
}


function createLink(linkType) {
    if (selectedKnowledgeProfile.value.isEditor) {
        var words = generate({ exactly: 2, minLength: 5, maxLength: 20 }).join('-') + "_" + uuidv4();
        addLink(selectedKnowledgeProfile.value.uuid, words, linkType).then((response) => {
            notify({ group: "success", title: "Success", text: "Link added successfully" }, 4000) // 4s
            if (linkType == 'viewerLink') selectedKnowledgeProfile.value.viewerLink = words;
            if (linkType == 'editorLink') selectedKnowledgeProfile.value.editorLink = words;
        }).catch((error) => {
            notify({ group: "failure", title: "Error", text: "Link creation unsuccessful. Please try again." }, 4000) // 4s
        });
    }
}

async function copyToClipboard(text) {

    text = env.SELF + "/linkKnowledgeProfile/" + text;
    try {
        await navigator.clipboard.writeText(text);
        notify({ group: "success", title: "Success", text: "Link copied" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

async function downloadJsonl()
{
    try {
        await getJsonl([localKnowledgeProfile.value.uuid])
        notify({ group: "success", title: "Success", text: "JSONL generated" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

</script>