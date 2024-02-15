<template>
    <div class="flex flex-wrap -mx-3 mb-1">

        <div class="w-full px-3">
            <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                <span>Reset</span>
            </button>
        </div>


        <!-- {{ localRoster.description.en }} -->
        <template v-if="localRoster">



            <div class="w-full  m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="first-name">
                    Roster Name
                    <span class="text-red-600">*</span>
                </label>
                <input v-model="localRoster.name" id="first-name" type="text" class="form-input w-full"
                    placeholder="Enter the name of the knowledge Profile" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="roster-description">
                    Description
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localRoster.description.en" id="roster-description" type="text" class="form-input w-full"
                    placeholder="Enter a brief description" />
            </div>
            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="roster-description">
                    Brand URL
                    <span class="text-sm text-gray-500">Optional</span>
                </label>
                <input v-model="localRoster.url" id="roster-url" type="text" class="form-input w-full"
                    placeholder="Enter a brand url" />
            </div>

            <div class="w-full px-3 pt-3">
                <div class="flex justify-between items-center mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="message">
                        Personas
                    </label>
                </div>

                <PersonaSelector :selected="localRoster.personas" :selectedUuids="localRoster.personaUuids"
                    @personasUpdate="personasUpdate" :key="localRoster.uuid" />
                <p> Add personas to a roster.</p>
            </div>

            <div class="w-full px-3 pt-3" v-if="localRoster._id">
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
                                {{ localRoster?.owners?.length ? localRoster.owners.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localRoster?.editors?.length ? localRoster.editors.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localRoster?.viewers?.length ? localRoster.viewers.join(', ') : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">
                                {{ localRoster.createdBy ? localRoster.createdBy : "" }}
                            </td>
                            <td class="border dark:border-gray-700 dark:text-gray-300 p-2">{{ localRoster.publishStatus }}
                            </td>
                        </tr>
                    </tbody>

                </table>
            </div>

            <div class="w-full m-3 spacing-x-2">
                <label for="url" class="block mb-2 dark:text-gray-300">Sharable Links</label>
                <div v-if="localRoster.isAdmin || localRoster.isOwner || localRoster.isEditor">
                    <!-- <label for="url" class="block mb-2 dark:text-gray-300">Viewer Link</label> -->
                    <div class="flex space-x-4">
                        <button @click="createLink('viewerLink')" class="btn bg-blue-500 text-white dark:bg-blue-700">Create
                            Viewer Link</button>
                        <button v-if="localRoster.viewerLink" @click="copyToClipboard(localRoster.viewerLink)"
                            class="btn text-white bg-green-500 hover:bg-green-400">Copy Link</button>
                        <button v-if="localRoster.viewerLink && localRoster.isViewer" @click="unlink('viewer', localRoster)"
                            class="btn text-white bg-gray-500 hover:bg-gray-400">Unlink</button>
                    </div>
                    <p v-if="localRoster.viewerLink">Viewer Link: {{ localRoster.viewerLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                </div>

                <div v-if="localRoster.isAdmin || localRoster.isOwner || localRoster.isEditor">
                    <div class="flex space-x-4">
                        <button @click="createLink('editorLink')" class="btn bg-blue-500 text-white dark:bg-blue-700">Create
                            Editor Link</button>
                        <button v-if="localRoster.editorLink" @click="copyToClipboard(localRoster.editorLink)"
                            class="btn text-white bg-green-500 hover:bg-green-400">Copy Link</button>
                        <button v-if="localRoster.editorLink && localRoster.isEditor" @click="unlink('editor', localRoster)"
                            class="btn text-white bg-gray-500 hover:bg-gray-400">Unlink</button>

                    </div>
                    <p v-if="localRoster.editorLink">Editor Link: {{ localRoster.editorLink }}</p>
                    <div v-else>
                        There is no viewer link.
                    </div>
                </div>
            </div>

            <div class="w-full m-3 spacing-x-2">
                <label class="block mb-2 dark:text-gray-300">Roster Publication (Public) Status </label>
                <div v-if="localRoster.isAdmin">
                    <div class="flex space-x-4">
                        <button v-if="localRoster.publishStatus !== 'published'" @click="publish('published')"
                            class="btn bg-blue-500 text-white dark:bg-blue-700"> Publish </button>
                        <button v-if="localRoster.publishStatus == 'published'" @click="publish('suspended')"
                            class="btn text-white bg-yellow-500 hover:bg-yellow-400"> Suspend </button>
                    </div>
                </div>

                <div v-else-if="localRoster.isOwner || localRoster.isEditor">
                    <div class="flex space-x-4">
                        <button v-if="localRoster.publishStatus == 'unpublished'" @click="publish('proposeForPublish')"
                            class="btn bg-blue-500 text-white dark:bg-blue-700">
                            Propose for Publishing
                        </button>
                        <button v-if="localRoster.publishStatus == 'proposeForPublish'" @click="publish('unpublished')"
                            class="btn text-white bg-yellow-500 hover:bg-yellow-400">
                            Remove Proposal
                        </button>
                    </div>
                </div>
            </div>


            <div v-if="!localRoster?._id" class="w-full px-3">


                <button @click="create" class="btn text-white bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                    <span>Create Roster</span>
                    <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                            d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                </button>

                <div v-if="!token" class="w-full  text-center">
                    <p>
                        Note: You are <b>not</b> logged in, so any rosters you create will be visible and usable by the
                        public.
                    </p>
                    <p>If you would like to keep your rosters private, please <router-link to="/join"> make a free
                            account.</router-link></p>
                </div>

                <div v-if="token" class="w-full text-center">
                    <p>Since you are logged in, your rosters will only be visible to you and anyone you share it with.</p>
                </div>

            </div>

            <div v-if="localRoster?._id && (localRoster.isAdmin || localRoster.isOwner || localRoster.isEditor)"
                class="w-full m-3 space-x-4">
                <button @click="triggerUpdate" class="btn text-white bg-teal-500 hover:bg-teal-400   mb-3">
                    <span>Update Roster</span>
                </button>

                <button v-if="localRoster.isAdmin || localRoster.isOwner" @click="triggerDelete"
                    class="btn text-white bg-yellow-500 hover:bg-yellow-400 mb-3">
                    <span>Delete Roster</span>
                </button>
            </div>


                <button v-if="localRoster.uuid" @click="demo(localRoster.uuid, 'gcChat')"
                class="btn text-white bg-green-500 hover:bg-green-400 m-4">Open GC Chat Wrapp</button>


            <button v-if="localRoster.uuid" @click="demo(localRoster.uuid, 'gcTranslate')"
                class="btn text-white bg-green-500 hover:bg-green-400 m-4">Open GC Translation Wrapp</button>

                <button v-if="localRoster.uuid" @click="demo(localRoster.uuid, 'policy')"
                class="btn text-white bg-green-500 hover:bg-green-400 m-4">Open Policy Wrapp</button>


        </template>
    </div>
</template>

<script setup>
import env from "@/env.js"

import { ref, onMounted, onBeforeMount } from 'vue';
import { generate, count } from "random-words";
import { notify } from "notiwind"
import { v4 as uuidv4 } from 'uuid';

import PersonaSelector from '@/components/PersonaSelector.vue'


//Composables
import { useTokens } from '@/composables/useTokens.js'
import { useRosters } from '@/composables/useRosters.js'
// import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'

const { token } = useTokens()
const { newRoster, selectedRoster, defaultRoster, addNewRoster, createRosters, updateRosters, addLink, deleteRosters, publishRosters, getRosters } = useRosters()
// const { personas, selectedPersona } = usePersonas()


let props = defineProps({ roster: { type: Object } })
let emit = defineEmits(['changeTab'])
let localRoster = ref({})

onBeforeMount(() => {
    localRoster.value = defaultRoster;
})

onMounted(() => {
    getRosters();
    if (props.roster) localRoster.value = props.roster;
})

function add() {
    addNewRoster();;
    localRoster.value = newRoster.value;
}

function create() {
    createRosters([localRoster.value]);
}

function triggerUpdate() {
    updateRosters([localRoster.value]);
}

function triggerDelete() {
    deleteRosters([localRoster.value]);
    emit('changeTab', 0)
}

function demo(uuid, wrapp) {
    window.open(`${env.SELF}/apps/${wrapp}/${uuid}`, '_blank');
}

function createLink(linkType) {
    if (selectedRoster.value.isEditor) {
        var words = generate({ exactly: 2, minLength: 5, maxLength: 20 }).join('-') + "_" + uuidv4();
        addLink(selectedRoster.value.uuid, words, linkType).then((response) => {
            notify({ group: "success", title: "Success", text: "Link added successfully" }, 4000) // 4s
            if (linkType == 'viewerLink') selectedRoster.value.viewerLink = words;
            if (linkType == 'editorLink') selectedRoster.value.editorLink = words;
        }).catch((error) => {
            notify({ group: "failure", title: "Error", text: "Link creation unsuccessful. Please try again." }, 4000) // 4s
        });
    }
}


function unlink(linkType, roster) {
    //TODO Remove Link

}

function personasUpdate(val) {
    localRoster.value.personas = val.personas;
    localRoster.value.personaUuids = val.personas.map((persona) => { return persona.uuid });

    console.log(localRoster.value)
}

function publish(status) {
    publishRosters([localRoster.value], status).then((results) => {
        localRoster.value.publishStatus = status;
        notify({ group: "success", title: "Success", text: "Roster publish status changed." }, 4000) // 4s

    }).catch((error) => {
        notify({ group: "failure", title: "Error", text: "Failed to publish." }, 4000) // 4s

    })
}


async function copyToClipboard(text) {

    text = env.SELF + "/linkRoster/" + text;
    try {
        await navigator.clipboard.writeText(text);
        notify({ group: "success", title: "Success", text: "Link copied" }, 4000) // 4s
    } catch (err) {
        notify({ group: "failure", title: "Error", text: "Error. Please try again." }, 4000) // 4s
    }
}

</script>