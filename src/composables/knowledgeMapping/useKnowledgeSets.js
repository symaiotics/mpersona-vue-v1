import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();

let knowledgeSets = ref(null)
let selectedKnowledgeSet = ref(null) //the actively selected persona

const defaultKnowledgeSet = {
    name: { en: null, fr: null },
    description: { en: null, fr: null },
};

const newKnowledgeSet = ref({ ...defaultKnowledgeSet });

// by convention, composable function names start with "use"
export function useKnowledgeSets() {

    const resetKnowledgeSet = () => {
        Object.assign(newKnowledgeSet.value, defaultKnowledgeSet);
    };

    const addNewKnowledgeSet = () => {
        resetKnowledgeSet();
        selectedKnowledgeSet.value = newKnowledgeSet.value;
    };

    async function getKnowledgeSets(rosterUuid, viewAll = false) {
        try {

            let params = { params: { rosterUuid, viewAll } }
            var response = await configuredAxios.get(env.API_URL + '/knowledgeSets', params);
            knowledgeSets.value = response.data.payload;
            console.log("Loaded Knowledge Sets", knowledgeSets.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createKnowledgeSets(knowledgeSets, rosterUuid) {
        try {
            if (!Array.isArray(knowledgeSets)) knowledgeSets = [knowledgeSets]
            var params = { knowledgeSets, rosterUuid }
            var response = await configuredAxios.post(env.API_URL + '/knowledgeSets', params);
            console.log("Created Knowledge Set(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Knowledge Set(s) created successfully" }, 4000) // 4s
            getKnowledgeSets(rosterUuid, false);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Knowledge Set. Try again" }, 4000) // 4s

        }
    }

    async function updateKnowledgeSets(knowledgeSets, rosterUuid) {
        try {
            if (!Array.isArray(knowledgeSets)) knowledgeSets = [knowledgeSets]
            var params = { knowledgeSets, rosterUuid }
            var response = await configuredAxios.patch(env.API_URL + '/knowledgeSets', params);
            console.log("Updated Knowledge Sets", response.data.payload)
            notify({ group: "success", title: "Success", text: "Knowledge Set(s) updated successfully" }, 4000) // 4s
            getKnowledgeSets(rosterUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating Knowledge Sets(s). Try again" }, 4000) // 4s
        }
    }

    async function deleteKnowledgeSets(knowledgeSetUuids, rosterUuid) {
        try {
            if (!Array.isArray(knowledgeSetUuids)) knowledgeSetUuids = [knowledgeSetUuids]
            var params = { knowledgeSetUuids, rosterUuid }
            console.log("Delete params", params)
            var response = await configuredAxios.post(env.API_URL + '/knowledgeSets/delete', params);
            console.log("Deleted Knowledge Set(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Knowledge Set(s) deleted successfully" }, 4000) // 4s
            getKnowledgeSets(rosterUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Knowledge Set(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultKnowledgeSet,
        newKnowledgeSet,

        knowledgeSets,
        selectedKnowledgeSet,

        addNewKnowledgeSet,
        resetKnowledgeSet,
        getKnowledgeSets,
        createKnowledgeSets,
        updateKnowledgeSets,
        deleteKnowledgeSets

    }
}