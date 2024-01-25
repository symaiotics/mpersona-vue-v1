import env from "@/env.js"
import { ref, onMounted, onUnmounted, computed } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"
import { useTags } from '@/composables/knowledgeMapping/useTags.js';
const { filterTags } = useTags()

let artifacts = ref(null); //From the database
let selectedArtifact = ref(null) //the actively selected persona

let artifactsPending = ref([]); //Not yet saved
let selectedArtifactPending = ref(null) //the actively selected artifact

let applyFilter = ref(false);

// Computed property to filter artifacts based on filterTags
const artifactsFiltered = computed(() => {
    if (filterTags.value.length > 0 && applyFilter.value) {
        // Extracting the UUIDs from filterTags
        const filterTagUuids = filterTags.value.map(tag => tag.uuid);

        // Filtering artifacts that have at least one tag UUID from filterTags
        return artifacts.value.filter(doc =>
            doc.tagUuids.some(tagUuid => filterTagUuids.includes(tagUuid))
        );
    }
    // If no filterTags, return all artifacts
    return artifacts.value;
});


//This is a single artifact
//We save an array of these
const defaultArtifact = {
    name: { en: null, fr: null },
    description: { en: null, fr: null },
    keywords: null,
    categories: null,
    prompt: null,
    message: null,
    auditText: null,
    auditJson: null,
    messageHistory: null,
    completeness: null,
    accuracy: null,
    tone: null,
    overall: null,
    comments: null,
    finalText: { en: null, fr: null },
    personaUuids: null,
    documentUuids: null,
    segmentUuids: null,
    mappingUuids: null,
    tagUuids: null,
};

const newArtifact = ref({ ...defaultArtifact });

// by convention, composable function names start with "use"
export function useArtifacts() {

    const resetArtifact = () => {
        Object.assign(newArtifact.value, defaultArtifact);
    };

    const addNewArtifact = () => {
        resetArtifact();
        selectedArtifact.value = newArtifact.value;
    };

    async function getArtifacts(knowledgeSetUuid) {
        try {
            let params = { params: { knowledgeSetUuid } }
            var response = await configuredAxios.get(env.API_URL + '/artifacts', params);
            artifacts.value = response.data.payload;
            console.log("Loaded Artifact", artifacts.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createArtifacts(knowledgeSetUuid, artifacts) {
        try {
            if (!Array.isArray(artifacts)) artifacts = [artifacts]
            var params = { knowledgeSetUuid, artifacts }
            var response = await configuredAxios.post(env.API_URL + '/artifacts', params);
            console.log("Created Artifact(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Artifact(s) created successfully" }, 4000) // 4s
            getArtifacts(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Artifact. Try again" }, 4000) // 4s

        }
    }


    async function updateArtifacts(knowledgeSetUuid, artifacts) {
        try {
            if (!Array.isArray(artifacts)) artifacts = [artifacts]
            var params = { knowledgeSetUuid, artifacts }
            var response = await configuredAxios.patch(env.API_URL + '/artifacts', params);
            console.log("Created Artifact(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Artifact(s) created successfully" }, 4000) // 4s
            getArtifacts(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Artifact. Try again" }, 4000) // 4s

        }
    }


    async function addRemoveTags(knowledgeSetUuid, operation = 'add', artifacts, tags) {
        try {
            if (!Array.isArray(artifacts)) artifacts = [artifacts]
            if (!Array.isArray(tags)) tags = [tags]
            var params = { knowledgeSetUuid, operation, artifacts, tags }
            var response = await configuredAxios.patch(env.API_URL + '/artifacts/tags', params);
            console.log("Added tags to artifacts(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Added tags to Artifacts" }, 4000) // 4s
            getArtifacts(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error tagging Artifact. Try again" }, 4000) // 4s

        }
    }

    async function deleteArtifacts(knowledgeSetUuid, artifactUuids) {
        try {
            var params = { knowledgeSetUuid, artifactUuids }
            var response = await configuredAxios.post(env.API_URL + '/artifacts/delete', params);
            console.log("Deleted Artifact(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Artifact(s) deleted successfully" }, 4000) // 4s
            getArtifacts(knowledgeSetUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Artifact(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultArtifact,
        newArtifact,
        artifacts,
        artifactsFiltered,
        applyFilter,

        artifactsPending,
        selectedArtifact,
        selectedArtifactPending,
        addNewArtifact,
        resetArtifact,


        getArtifacts,
        createArtifacts,
        updateArtifacts,
        addRemoveTags,
        deleteArtifacts

    }
}