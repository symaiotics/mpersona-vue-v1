import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();

let knowledgeProfiles = ref(null)
let selectedKnowledgeProfile = ref(null) //the actively selected persona

const defaultKnowledgeProfile = {
    name: null,
    description: { en: null, fr: null },
    sources: null,
    context: null,

    sourceStructure: null,
    sourceAnalysisStatus: 'notStarted',
    targetStructure: null,
    targetAnalysisStatus: 'notStarted',

    files: [],
    processedFiles: [],
    createdBy: 'public',
};

const newKnowledgeProfile = ref({ ...defaultKnowledgeProfile });

// by convention, composable function names start with "use"
export function useKnowledgeProfiles() {

    const resetKnowledgeProfile = () => {
        Object.assign(newKnowledgeProfile.value, defaultKnowledgeProfile);
    };

    const addNewKnowledgeProfile = () => {
        resetKnowledgeProfile();
        selectedKnowledgeProfile.value = null;        
    };


    async function getKnowledgeProfiles() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/knowledgeProfiles');
            knowledgeProfiles.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Knowledge Profiles", knowledgeProfiles.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createKnowledgeProfiles(newKnowledgeProfiles) {
        try {
            if (!Array.isArray(newKnowledgeProfiles)) newKnowledgeProfiles = [newKnowledgeProfiles]
            var params = { knowledgeProfiles: newKnowledgeProfiles }
            var response = await configuredAxios.post(env.API_URL + '/knowledgeProfiles', params);
            console.log("Saved Knowledge Profiles", response)
            notify({ group: "success", title: "Success", text: "Knowledge Profile created successfully" }, 4000) // 4s
            getKnowledgeProfiles();

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Knowledge Profile. Try again" }, 4000) // 4s

        }
    }

    async function updateKnowledgeProfiles(updateArr) {
        try {
            if (!Array.isArray(updateArr)) updateArr = [updateArr]
            var params = { knowledgeProfiles: updateArr }
            var response = await configuredAxios.post(env.API_URL + '/knowledgeProfiles/update', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Knowledge profile(s) updated successfully" }, 4000) // 4s
            getKnowledgeProfiles();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating knowledge profiles(s). Try again" }, 4000) // 4s

        }
    }

    
    function addLink(knowledgeProfileUuid, knowledgeProfileLink, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { knowledgeProfileUuid, knowledgeProfileLink, linkType }
                var response = await configuredAxios.post(env.API_URL + '/knowledgeProfiles/addLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function getLinkDetails(link) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Getting Knowledge Profile details", link)
                var params = { link: link }
                var response = await configuredAxios.post(env.API_URL + '/knowledgeProfiles/linkDetails', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function acceptLink(link) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { link: link }
                var response = await configuredAxios.post(env.API_URL + '/knowledgeProfiles/acceptLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }


    // async function getSkills() {
    //     try {
    //         var response = await configuredAxios.get(env.API_URL + '/personas/skills');
    //         skills.value = response.data.payload;

    //         //TODO enhance to receive the code as well
    //         console.log("Loaded Skills", skills.value)
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //     }
    // }


    // async function getUsedCategories() {
    //     try {
    //         var response = await configuredAxios.get(env.API_URL + '/personas/categories');
    //         usedCategories.value = response.data.payload;

    //         //TODO enhance to receive the code as well
    //         console.log("Loaded Used Categories", usedCategories.value)
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //     }
    // }

    // async function createPersonas(newPersonas) {
    //     try {
    //         if (!Array.isArray(newPersonas)) newPersonas = [newPersonas]
    //         var params = { personas: newPersonas }
    //         var response = await configuredAxios.post(env.API_URL + '/personas', params);
    //         console.log(response.data.payload)
    //         // currentPersona.value = response;    
    //         notify({ group: "success", title: "Success", text: "Persona(s) created successfully" }, 4000) // 4s
    //         getPersonas();
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //         notify({ group: "failure", title: "Error", text: "Error creating persona(s). Try again" }, 4000) // 4s
    //     }
    // }

    // async function createNewPersonaAvatar(description) {
    //     return new Promise(async (resolve, reject) => {
    //         try {
    //             var params = { avatarPrompt: "An attractive digital avatar, Pixar style 3D render of a friendly person smiling, inside, 4k, high resolution, trending in artstation, for a " + description + " " }
    //             var response = await configuredAxios.post(env.API_URL + '/personas/avatar', params);
    //             resolve(env.STORAGE_URL + "/images/" + response.data.payload)
    //             getPersonas();
    //         }

    //         catch (error) {
    //             console.log("Error", error)
    //             reject(error)
    //         }
    //     })
    // }

    // async function updatePersonas(updatePersonas) {
    //     try {
    //         if (!Array.isArray(updatePersonas)) updatePersonas = [updatePersonas]
    //         var params = { personas: updatePersonas }
    //         var response = await configuredAxios.post(env.API_URL + '/personas/update', params);
    //         console.log(response.data.payload)
    //         // currentPersona.value = response;    
    //         notify({ group: "success", title: "Success", text: "Persona(s) updated successfully" }, 4000) // 4s
    //         getPersonas();
    //     }
    //     catch (error) {
    //         console.log("Error", error)
    //         notify({ group: "failure", title: "Error", text: "Error updating persona(s). Try again" }, 4000) // 4s

    //     }
    // }



    // expose managed state as return value
    return {
        defaultKnowledgeProfile,
        knowledgeProfiles,
        selectedKnowledgeProfile,
        newKnowledgeProfile,

        addNewKnowledgeProfile,
        resetKnowledgeProfile,
        getKnowledgeProfiles,
        createKnowledgeProfiles,
        updateKnowledgeProfiles,
        addLink,
        getLinkDetails,
        acceptLink,
        // processKnowledgeProfileFiles


        // personas,
        // selectedPersona,
        // usedCategories,
        // skills,

        // getPersonas,
        // getSkills,
        // getUsedCategories,
        // createPersonas,
        // updatePersonas,

        // createNewPersonaAvatar,

    }
}