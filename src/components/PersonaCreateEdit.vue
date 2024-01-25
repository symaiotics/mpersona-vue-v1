<template>
    <div class="flex flex-wrap -mx-3 mb-1">

        <div class="w-full px-3">
            <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                <span>Reset</span>
            </button>
        </div>


        <!-- {{ localPersona.description.en }} -->
        <template v-if="localPersona">
            <div class="w-full m-2">

                <div v-if="!statusCreatingAvatar && localPersona.url">
                    <img :src="localPersona.url" alt="Avatar Image" class="object-cover mb-4 rounded-md w-48 h-48">
                </div>
                <div v-else>

                    <img :src="defaultImage" alt="Default avatar Image" class="object-cover  mb-4 rounded-md w-48 h-48">

                </div>


                <button v-if="localPersona.isAdmin || localPersona.isEditor || !localPersona._id"
                    @click="createNewAvatar(avatarPrompt)" :disabled="statusCreatingAvatar"
                    class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded">Generate
                    New Avatar</button>

                <p v-if="statusCreatingAvatar">Loading a new avatar... please wait</p>

            </div>
            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="avatarPrompt">
                    Avatar Prompt
                    <span class="text-red-600">*</span>
                </label>

                <input v-model="avatarPrompt" id="avatarPrompt" type="text" class="form-input w-full"
                    placeholder="Enter how you would like your avatar to look" required />
            </div>

            <div class="w-full  m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                    Persona Name
                    <span class="text-red-600">*</span>
                </label>
                <input v-model="localPersona.name" id="first-name" type="text" class="form-input w-full"
                    placeholder="Enter the name of the knowledge Profile" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-description">
                    Description
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localPersona.description.en" id="persona-description" type="text" class="form-input w-full"
                    placeholder="Enter a brief description" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="persona-url">
                    Image URL
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localPersona.url" id="persona-url" type="text" class="form-input w-full"
                    placeholder="The link to your persona avatar" required />

            </div>


            <div class="w-full px-3">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="category">Category
                    <span class="text-sm text-gray-500">Optional</span></label>
                <select v-model="localPersona.categories" id="category" class="form-select w-full" required>
                    <option v-for="(category, index) in categories" :key="'category' + index" :value="[category]">{{
                        category.label.en }}
                    </option>
                </select>
            </div>

            <div class="w-full px-3">
                <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                        Persona Instructions
                    </label>
                    <span class="text-red-600">*</span>
                </div>
                <textarea v-model="localPersona.basePrompt" id="message" rows="8" class="form-textarea w-full"
                    placeholder="Define the persona instructions" required></textarea>
                <p> The Persona Instructions determine how the Large Language Model will conduct its interactions. Here,
                    you can define the rules by which it should operate, how it identifies itself, and the functions it
                    provides.</p>
            </div>


            <div class="w-full px-3 pt-3">

                <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                        Default Knowledge Profiles
                    </label>
                    <span class="text-gray-600">Optional</span>
                </div>

                <KnowledgeProfileSelector :selected="localPersona.knowledgeProfiles"
                    @knowledgeProfilesUpdate="knowledgeProfilesUpdate" />

                <p> Knowledge Profiles provide Personas deep insight into key topics, significantly enhancing responses.</p>

            </div>

            <div class="w-full px-3 pt-3" v-if="localPersona._id">
                <p> Contributors</p>
                <table class="w-full">
                    <thead>
                        <tr>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Owners</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Editors</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Viewers</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Created By</th>
                            <th class="border dark:border-gray-700 dark:text-gray-300">Published</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localPersona?.owners?.length ? localPersona.owners.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localPersona?.editors?.length ? localPersona.editors.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localPersona?.viewers?.length ? localPersona.viewers.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localPersona.createdBy ? localPersona.createdBy : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">{{ localPersona.publishStatus }}
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div class="w-full m-3 spacing-x-2">
                <label for="url" class="block mb-2 dark:text-gray-300">Sharable Links</label>
                <div v-if="localPersona.isAdmin || localPersona.isOwner || localPersona.isEditor">
                    <!-- <label for="url" class="block mb-2 dark:text-gray-300">Viewer Link</label> -->
                    <div class="flex space-x-4">
                        <button @click="createLink('viewerLink')" class="btn bg-blue-500 text-white dark:bg-blue-700">Create
                            Viewer Link</button>
                        <button v-if="localPersona.viewerLink" @click="copyToClipboard(localPersona.viewerLink)"
                            class="btn text-white bg-green-500 hover:bg-green-400">Copy Link</button>
                        <button v-if="localPersona.viewerLink && localPersona.isViewer"
                            @click="unlink('viewer', localPersona)"
                            class="btn text-white bg-gray-500 hover:bg-gray-400">Unlink</button>


                    </div>
                    <p v-if="localPersona.viewerLink">Viewer Link: {{ localPersona.viewerLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                </div>

                <div v-if="localPersona.isAdmin || localPersona.isOwner || localPersona.isEditor">
                    <div class="flex space-x-4">
                        <button @click="createLink('editorLink')" class="btn bg-blue-500 text-white dark:bg-blue-700">Create
                            Editor Link</button>
                        <button v-if="localPersona.editorLink" @click="copyToClipboard(localPersona.editorLink)"
                            class="btn text-white bg-green-500 hover:bg-green-400">Copy Link</button>
                        <button v-if="localPersona.editorLink && localPersona.isEditor"
                            @click="unlink('editor', localPersona)"
                            class="btn text-white bg-gray-500 hover:bg-gray-400">Unlink</button>

                    </div>
                    <p v-if="localPersona.editorLink">Editor Link: {{ localPersona.editorLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                </div>
            </div>

            <div class="w-full m-3 spacing-x-2">
                <label class="block mb-2 dark:text-gray-300">Persona Publication (Public) Status </label>
                <div v-if="localPersona.isAdmin">
                    <div class="flex space-x-4">
                        <button v-if="localPersona.publishStatus !== 'published'" @click="publish('published')"
                            class="btn bg-blue-500 text-white dark:bg-blue-700"> Publish </button>
                        <button v-if="localPersona.publishStatus == 'published'" @click="publish('suspended')"
                            class="btn text-white bg-yellow-500 hover:bg-yellow-400"> Suspend </button>
                    </div>
                </div>

                <div v-else-if="localPersona.isOwner || localPersona.isEditor">
                    <div class="flex space-x-4">
                        <button v-if="localPersona.publishStatus == 'unpublished'" @click="publish('proposeForPublish')"
                            class="btn bg-blue-500 text-white dark:bg-blue-700">
                            Propose for Publishing
                        </button>
                        <button v-if="localPersona.publishStatus == 'proposeForPublish'" @click="publish('unpublished')"
                            class="btn text-white bg-yellow-500 hover:bg-yellow-400">
                            Remove Proposal
                        </button>
                    </div>
                </div>
            </div>

            <div v-if="!localPersona?._id" class="w-full px-3">
                <button @click="create" class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Create Persona</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>

                <div v-if="!token" class="w-full  text-center">
                    <p>
                        Note: You are <b>not</b> logged in, so any personas you create will be visible and usable by the
                        public.
                    </p>
                    <p>If you would like to keep your personas private, please <router-link to="/join"> make a free
                            account.</router-link></p>
                </div>

                <div v-if="token" class="w-full text-center">
                    <p>Since you are logged in, your personas will only be visible to you and anyone you share it with.</p>
                </div>

            </div>


            <div v-if="localPersona?.knowledgeProfiles?.length && (localPersona.isAdmin)"
                class="w-full m-3 space-x-4">
                <button @click="createFinetune" class="btn text-white bg-blue-500 hover:bg-blue-400   mb-3">
                    <span>Create Finetune Model</span>
                </button>

                <button @click="checkFinetuneStatus" class="btn text-white bg-blue-500 hover:bg-blue-400   mb-3">
                    <span>Check statuses</span>
                </button>
            </div>

            <div v-if="localPersona?._id && (localPersona.isAdmin || localPersona.isOwner || localPersona.isEditor)"
                class="w-full m-3 space-x-4">
                <button @click="triggerUpdate" class="btn text-white bg-teal-500 hover:bg-teal-400   mb-3">
                    <span>Update Persona</span>
                </button>

                <button v-if="localPersona.isAdmin || localPersona.isOwner" @click="triggerDelete"
                    class="btn text-white bg-yellow-500 hover:bg-yellow-400 mb-3">
                    <span>Delete Persona</span>
                </button>
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
import defaultImage from "../images/persona1.png"

import KnowledgeProfileSelector from '@/components/KnowledgeProfileSelector.vue'


//Composables
import { useTokens } from '@/composables/useTokens.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'

const { token } = useTokens()
const { newPersona, selectedPersona, defaultPersona, addNewPersona, createPersonas, updatePersonas, addLink, createNewPersonaAvatar, deletePersonas, publishPersonas, finetunePersonas, loadFinetuneStatuses } = usePersonas()
const { categories, getCategories } = useCategories()
const { getKnowledgeProfiles } = useKnowledgeProfiles()

let avatarPrompt = ref('An attractive digital avatar, Pixar style 3D render of a friendly person smiling, inside, 4k, high resolution')
let statusCreatingAvatar = ref(false)

let props = defineProps({ persona: { type: Object } })
let emit = defineEmits(['changeTab'])
let localPersona = ref({})

onBeforeMount(() => {
    localPersona.value = defaultPersona;
})

onMounted(() => {
    getCategories();
    getKnowledgeProfiles();
    if (props.persona) localPersona.value = props.persona;
})

function add() {
    addNewPersona();;
    localPersona.value = newPersona.value;
}

function createNewAvatar(name) {
    statusCreatingAvatar.value = true;
    createNewPersonaAvatar(name).then((response) => {
        localPersona.value.url = response;
        statusCreatingAvatar.value = false;
    }).catch((error) => {
        statusCreatingAvatar.value = false;
        console.log("Error Creating Avatar", error)
    })
}

function create() {
    createPersonas([localPersona.value]);
}

function triggerUpdate() {
    updatePersonas([localPersona.value]);
}

function triggerDelete() {
    deletePersonas([localPersona.value]);
    emit('changeTab', 0)

}

function createLink(linkType) {
    if (selectedPersona.value.isEditor) {
        var words = generate({ exactly: 2, minLength: 5, maxLength: 20 }).join('-') + "_" + uuidv4();
        addLink(selectedPersona.value.uuid, words, linkType).then((response) => {
            notify({ group: "success", title: "Success", text: "Link added successfully" }, 4000) // 4s
            if (linkType == 'viewerLink') selectedPersona.value.viewerLink = words;
            if (linkType == 'editorLink') selectedPersona.value.editorLink = words;
        }).catch((error) => {
            notify({ group: "failure", title: "Error", text: "Link creation unsuccessful. Please try again." }, 4000) // 4s
        });
    }
}


function unlink(linkType, persona) {
    //TODO Remove Link

}

function knowledgeProfilesUpdate(val) {
    localPersona.value.knowledgeProfiles = val.knowledgeProfiles;
}

function publish(status) {
    publishPersonas([localPersona.value], status).then((results) => {
        localPersona.value.publishStatus = status;
        notify({ group: "success", title: "Success", text: "Persona publish status changed." }, 4000) // 4s

    }).catch((error) => {
        notify({ group: "failure", title: "Error", text: "Failed to publish." }, 4000) // 4s

    })
}


function createFinetune() {
    finetunePersonas([localPersona.value]).then((results) => {
        console.log(results)
        notify({ group: "success", title: "Success", text: "Persona finetune created." }, 4000) // 4s

    }).catch((error) => {
        console.log(error)
        notify({ group: "failure", title: "Error", text: "Failed to publish." }, 4000) // 4s

    })
}


function checkFinetuneStatus() {
    loadFinetuneStatuses().then((results) => {
        console.log(results)
        notify({ group: "success", title: "Success", text: "Statuses loaded." }, 4000) // 4s

    }).catch((error) => {
        console.log(error)
        notify({ group: "failure", title: "Error", text: "Failed to load finetune statuses." }, 4000) // 4s

    })
}

async function copyToClipboard(text) {

    text = env.SELF + "/linkPersona/" + text;
    try {
        await navigator.clipboard.writeText(text);
        notify({ group: "success", title: "Success", text: "Link copied" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

</script>