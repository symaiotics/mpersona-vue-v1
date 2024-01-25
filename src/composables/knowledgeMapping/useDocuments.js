import env from "@/env.js"
import { ref, onMounted, onUnmounted, computed } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTags } from '@/composables/knowledgeMapping/useTags.js';
const { filterTags } = useTags()

let documents = ref(null); //From the database
let selectedDocument = ref(null) //the actively selected persona


let applyFilter = ref(false);

// Computed property to filter documents based on filterTags
const documentsFiltered = computed(() => {
    if (filterTags.value.length > 0 && applyFilter.value) {
        // Extracting the UUIDs from filterTags
        const filterTagUuids = filterTags.value.map(tag => tag.uuid);

        // Filtering documents that have at least one tag UUID from filterTags
        return documents.value.filter(doc =>
            doc.tagUuids.some(tagUuid => filterTagUuids.includes(tagUuid)));
    }
    // If no filterTags, return all documents


    return documents.value;
});



// Computed property to filter segments based on filterTags
const documentsChecked = computed(() => {

    // const sortWithChecked = (a, b) => {
    //     // Convert undefined to false and ensure a boolean value
    //     const aChecked = !!a._checked;
    //     const bChecked = !!b._checked;
    //     // Sort by _checked status, true values first
    //     return bChecked - aChecked;
    // };

    // If no filterTags, return all segments
    if(documents.value) return documents.value.filter(document => document._checked)
    return [];
});


let documentsPending = ref([]); //Not yet saved
let selectedDocumentPending = ref(null) //the actively selected persona

//This is a single document
//We save an array of these
const defaultDocument = {
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    original: {
        name: '',
        type: '',
        size: null,
        lastModified: null,
    },
};

const newDocument = ref({ ...defaultDocument });

// by convention, composable function names start with "use"
export function useDocuments() {

    const resetDocument = () => {
        Object.assign(newDocument.value, defaultDocument);
    };

    const addNewDocument = () => {
        resetDocument();
        selectedDocument.value = newDocument.value;
    };

    async function getDocuments(knowledgeSetUuid) {
        try {
            let params = { params: { knowledgeSetUuid } }
            var response = await configuredAxios.get(env.API_URL + '/documents', params);
            documents.value = response.data.payload;
            console.log("Loaded Document", documents.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createDocuments(knowledgeSetUuid, documents) {
        try {
            if (!Array.isArray(documents)) documents = [documents]
            var params = { knowledgeSetUuid, documents }
            var response = await configuredAxios.post(env.API_URL + '/documents', params);
            console.log("Created Document(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Document(s) created successfully" }, 4000) // 4s
            getDocuments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Document. Try again" }, 4000) // 4s

        }
    }


    async function updateDocuments(knowledgeSetUuid, documents) {
        try {
            if (!Array.isArray(documents)) documents = [documents]
            var params = { knowledgeSetUuid, documents }
            var response = await configuredAxios.patch(env.API_URL + '/documents', params);
            console.log("Created Document(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Document(s) created successfully" }, 4000) // 4s
            getDocuments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Document. Try again" }, 4000) // 4s

        }
    }


    async function addRemoveTags(knowledgeSetUuid, operation = 'add', documents, tags) {
        try {
            if (!Array.isArray(documents)) documents = [documents]
            if (!Array.isArray(tags)) tags = [tags]
            var params = { knowledgeSetUuid, operation, documents, tags }
            var response = await configuredAxios.patch(env.API_URL + '/documents/tags', params);
            console.log("Added tags to documents(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Added tags to Documents" }, 4000) // 4s
            getDocuments(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error tagging Document. Try again" }, 4000) // 4s

        }
    }

    async function deleteDocuments(knowledgeSetUuid, documentUuids) {
        try {
            var params = { knowledgeSetUuid, documentUuids }
            var response = await configuredAxios.post(env.API_URL + '/documents/delete', params);
            console.log("Deleted Document(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Document(s) deleted successfully" }, 4000) // 4s
            getDocuments(knowledgeSetUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Document(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultDocument,
        newDocument,
        documents,
        documentsFiltered,
        documentsChecked,
        applyFilter,

        documentsPending,
        selectedDocument,
        selectedDocumentPending,
        addNewDocument,
        resetDocument,


        getDocuments,
        createDocuments,
        updateDocuments,
        addRemoveTags,
        deleteDocuments

    }
}