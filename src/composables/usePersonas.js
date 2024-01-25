import env from "@/env.js"
import { ref } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

//Global Variables
let personas = ref(null)
let usedCategories = ref(null)
let skills = ref(null)

let selectedPersona = ref(null) //the actively selected persona

let defaultPersona = {
    name: "",
    url: "",
    description: { en: "", fr: "" },
    basePrompt: "",

    //Arrays
    skills: [],
    categories: [],
    knowledgeProfiles: [],
    createdBy: 'public',
};

const newPersona = ref({ ...defaultPersona });


// by convention, composable function names start with "use"
export function usePersonas() {

    const resetPersona = () => {
        // Object.assign(newPersona.value, defaultPersona);
        newPersona.value = JSON.parse(JSON.stringify(defaultPersona))
    };

    const addNewPersona = () => {
        resetPersona();
        selectedPersona.value = null;
    };

    async function getPersonas(viewAll) {
        try {
            let params = { params: { viewAll: viewAll } };
            var response = await configuredAxios.get(env.API_URL + '/personas', params);
            personas.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Personas", personas.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function getSkills() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/personas/skills');
            skills.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log("Loaded Skills", skills.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function getUsedCategories() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/personas/categories');
            usedCategories.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log("Loaded Used Categories", usedCategories.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createPersonas(newPersonas) {
        try {
            if (!Array.isArray(newPersonas)) newPersonas = [newPersonas]
            var params = { personas: newPersonas }
            var response = await configuredAxios.post(env.API_URL + '/personas', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Persona(s) created successfully" }, 4000) // 4s
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating persona(s). Try again" }, 4000) // 4s
        }
    }

    async function createNewPersonaAvatar(description) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { avatarPrompt: description }
                var response = await configuredAxios.post(env.API_URL + '/personas/avatar', params);
                resolve(env.STORAGE_URL + "/images/" + response.data.payload)
                getPersonas();
            }

            catch (error) {
                console.log("Error", error)
                reject(error)
            }
        })
    }

    async function updatePersonas(updatePersonas) {
        try {
            if (!Array.isArray(updatePersonas)) updatePersonas = [updatePersonas]
            var params = { personas: updatePersonas }
            var response = await configuredAxios.post(env.API_URL + '/personas/update', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Persona(s) updated successfully" }, 4000) // 4s
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating persona(s). Try again" }, 4000) // 4s

        }
    }


    async function deletePersonas(deletePersonas) {
        try {
            if (!Array.isArray(deletePersonas)) deletePersonas = [deletePersonas]
            var params = { personas: deletePersonas }
            var response = await configuredAxios.post(env.API_URL + '/personas/delete', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Persona(s) deleted successfully" }, 4000) // 4s
            getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting persona(s). Try again" }, 4000) // 4s

        }
    }


    function addLink(personaUuid, personaLink, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Adding persona link", personaLink)
                var params = { personaUuid, personaLink, linkType }
                var response = await configuredAxios.post(env.API_URL + '/personas/addLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }


    function getLinkDetails(personaLink) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Getting Persona details", personaLink)
                var params = { personaLink: personaLink }
                var response = await configuredAxios.post(env.API_URL + '/personas/linkDetails', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function acceptLink(personaLink) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { personaLink: personaLink }
                var response = await configuredAxios.post(env.API_URL + '/personas/acceptLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function publishPersonas(personas, status) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(personas)) personas = [personas];
                var params = { personaUuids: personas.map((persona) => { return persona.uuid }), publishStatus: status }
                var response = await configuredAxios.post(env.API_URL + '/personas/publish', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function finetunePersonas(personas) {
        return new Promise(async (resolve, reject) => {
            try {
                if (!Array.isArray(personas)) personas = [personas];
                var params = { personaUuids: personas.map((persona) => { return persona.uuid }) }
                var response = await configuredAxios.post(env.API_URL + '/personas/finetune', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function loadFinetuneStatuses() {
        return new Promise(async (resolve, reject) => {
            try {
                var params = {}
                var response = await configuredAxios.post(env.API_URL + '/personas/finetuneStatuses', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    // expose managed state as return value
    return {

        personas,
        selectedPersona,
        usedCategories,
        skills,
        newPersona,

        resetPersona,
        addNewPersona,

        getPersonas,
        getSkills,
        getUsedCategories,
        createPersonas,
        updatePersonas,
        deletePersonas,
        publishPersonas,

        createNewPersonaAvatar,

        addLink,
        getLinkDetails,
        acceptLink,

        finetunePersonas,
        loadFinetuneStatuses

    }
}