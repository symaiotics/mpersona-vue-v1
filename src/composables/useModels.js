import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let adminModels = ref([]); //From the database
let selectedModel = ref(null) //the actively selected persona

//This is a single model
//We save an array of these
const defaultModel = {
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    context: { en: '', fr: '' }
};

const newModel = ref({ ...defaultModel });

// by convention, composable function names start with "use"
export function useModels() {

    const resetModel = () => {
        Object.assign(newModel.value, defaultModel);
    };

    const addNewModel = () => {
        resetModel();
        selectedModel.value = newModel.value;

    };


    async function bootstrapModels() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/models/bootstrap', );
            console.log('Bootstrap complete')
            getModels();
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function getModels() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/models', );
            adminModels.value = response.data.payload;
            //Select the first one (most recent, as default)
            if(adminModels.value.length) selectedModel.value = adminModels.value[0]
            console.log("Loaded Models", adminModels.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createModels(models) {
        try {
            if (!Array.isArray(models)) models = [models]
            var params = { models }
            var response = await configuredAxios.post(env.API_URL + '/models', params);
            console.log("Created Model(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Model(s) created successfully" }, 4000) // 4s
            getModels();

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Model. Try again" }, 4000) // 4s

        }
    }


    async function updateModels( models) {
        try {
            if (!Array.isArray(models)) models = [models]
            var params = {  models }
            var response = await configuredAxios.patch(env.API_URL + '/models', params);
            console.log("Updated Model(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Model(s) updated successfully" }, 4000) // 4s
            getModels();

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating Model. Try again" }, 4000) // 4s

        }
    }

    async function deleteModels( modelUuids) {
        try {
            var params = {  modelUuids }
            var response = await configuredAxios.post(env.API_URL + '/models/delete', params);
            console.log("Deleted Model(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Model(s) deleted successfully" }, 4000) // 4s
            getModels();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Model(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultModel,
        newModel,
        adminModels,
        selectedModel,

        addNewModel,
        resetModel,

        bootstrapModels,
        getModels,
        createModels,
        updateModels,
        deleteModels

    }
}