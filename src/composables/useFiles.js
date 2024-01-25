import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";
import configuredAxios from "@/utils/axios.js"

import { v4 as uuidv4 } from 'uuid';
import { notify } from "notiwind"


let files = ref(null)
let selectedFile = ref(null)

/*

file
{
    uuid
    uploadFile
    processedFileText text from the API
    highlights array
    highlightedText computed
    highlightedSegmentsArray computed
    persona
    status String
    facts Array

}

*/

const defaultFile = {
    uuid: null,
    name: null,
    description: { en: null, fr: null },
    context: null, //Additional file specific context string

    file: null,
    storageUrl: null,
    extractedFileText: null,// text from the API
    status: null,

    highlights: null,// array
    // highlightedText: null,// computed
    // highlightedSegmentsArray: null,// computed
    lastSelection: null, //Set by captureSelection

    knowledgeProfileUuid: null, //Associated knowledge profile for additional context
    persona: null, //Persona processing the file
    sockets: [], //Track the socketId of all of the sockets created to monitor when they are complete
    facts: [], //Returned by the persona
    triggerGeneration: false,
};



// by convention, composable function names start with "use"
export function useFiles() {

    const stageFiles = (filesArray) => {
        const screenedFiles = [...filesArray].filter(
            file => ['text/plain', 'text/html', 'application/json', 'application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(file.type)
        );

        if (!files.value) files.value = {};

        screenedFiles.forEach((newFile) => {
            var createFile = { ...defaultFile };
            createFile.uuid = uuidv4();
            createFile.file = newFile;
            createFile.status = "unprocessed"
            createFile.name = newFile.name;
            createFile.index = Object.keys(files.value).length;
            files.value[createFile.uuid] = createFile;
        })
    };

    async function processFiles() {
        try {
            // Check the files
            if (!files.value || files.value.length === 0) {
                console.log('No files selected!');
                return;
            }

            // Create a FormData
            const formData = new FormData();
            var uuidArray = [];
            Object.values(files.value).forEach((file) => {
                if (file.status == 'unprocessed') {
                    formData.append('files', file.file);
                    uuidArray.push(file.uuid)
                }
            });

            formData.append('uuids', JSON.stringify(uuidArray));

            // Get the results
            const response = await configuredAxios.post(env.API_URL + '/files', formData);

            // Check response structure
            if (response && response.data && Array.isArray(response.data.payload)) {
                response.data.payload.forEach((responseFile) => {
                    if (responseFile.uuid && files.value[responseFile.uuid]) {
                        files.value[responseFile.uuid].storageUrl = responseFile.storageUrl;
                        files.value[responseFile.uuid].extractedFileText = responseFile.extractedFileText;
                        files.value[responseFile.uuid].status = 'extracted';
                    }
                });

                createFiles(files.value)
            }
        } catch (error) {
            console.log("Error", error);
            // Optionally re-throw the error if you want the caller to handle it
            // throw error;
        }
    }


    async function getFiles(knowledgeProfileUuid) {
        try {
            var params = { params: { knowledgeProfileUuid: knowledgeProfileUuid } }
            var response = await configuredAxios.get(env.API_URL + '/files', params);

            //Transpose the array of results to a string based object array (object)
            if (!files.value) files.value = {};
            response.data.payload.forEach((file) => {
                files.value[file.uuid] = file;
            })
            // files.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Files", files.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }


    async function createFiles(newFiles) {
        try {
            // if (!Array.isArray(newFiles)) newFiles = [newFiles]
            //Files is an object, not an array

            var files = Object.values(newFiles);
            files = files.filter((file) => { return !file._id })
            var params = { files: files }
            var response = await configuredAxios.post(env.API_URL + '/files/create', params);
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Files created successfully" }, 4000) // 4s
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating facts. Try again" }, 4000) // 4s
        }
    }


    async function updateFiles(files) {
        try {
            // if (!Array.isArray(files)) files = [files]
            var params = { files: Object.values(files) }
            var response = await configuredAxios.post(env.API_URL + '/files/update', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Files updated successfully" }, 4000) // 4s
            // getPersonas();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating persona(s). Try again" }, 4000) // 4s

        }
    }


    // //Process the files content
    // const captureSelection = () => {
    //     const selection = window.getSelection();
    //     if (!selection.rangeCount) return;
    //     const range = selection.getRangeAt(0);
    //     const start = range.startOffset;
    //     const end = range.endOffset;
    //     return { start, end };
    // };

    //Create a highlight
    const highlight = (highlights, lastSelection, type) => {
        if (!lastSelection) return;

        const newHighlight = { ...lastSelection, type };
        if (!highlights) highlights = [];
        // if (!Array.isArray(highlights)) highlights = [highlights]
        for (let i = 0; i < highlights.length; i++) {
            const highlight = highlights[i];

            // Completely contained
            if (newHighlight.start <= highlight.start && newHighlight.end >= highlight.end) {
                highlights.splice(i, 1);
                i--;
                continue;
            }

            // Partial overlap
            if (newHighlight.start < highlight.end && newHighlight.end > highlight.start) {
                if (highlight.type !== newHighlight.type) {
                    if (newHighlight.start > highlight.start) {
                        highlight.end = newHighlight.start;
                    } else if (newHighlight.end < highlight.end) {
                        highlight.start = newHighlight.end;
                    }
                } else {
                    highlight.start = Math.min(newHighlight.start, highlight.start);
                    highlight.end = Math.max(newHighlight.end, highlight.end);
                    return;
                }
            }
        }

        // Add the new highlight
        highlights.push(newHighlight);

        // Reset the last selection
        lastSelection = null;

        return highlights;
    };

    function highlightedText(originalText, highlights) {
        if (highlights?.length) {
            const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
            let result = '';
            let textPointer = 0;
            let highlightPointer = 0;

            while (textPointer < originalText.length) {
                if (highlightPointer < sortedHighlights.length && textPointer === sortedHighlights[highlightPointer].start) {
                    const highlight = sortedHighlights[highlightPointer];
                    const highlightClass = `highlight-${highlight.type}`;
                    result += `<span class="${highlightClass}">${originalText.substring(highlight.start, highlight.end)}</span>`;
                    textPointer = highlight.end;
                    highlightPointer++;
                } else {
                    result += originalText[textPointer];
                    textPointer++;
                }
            }
            return result;
        }
        else return [];

    }


    function highlightedSegments(originalText, highlights) {
        let allSegments = [];
        if (highlights?.length) {
            for (const highlight of highlights) {
                var segment = { "content": originalText.substring(highlight.start, highlight.end), "type": highlight.type };
                allSegments.push(segment)
            }
            return allSegments;
        }
        else return [];
    }


    // expose managed state as return value
    return {
        files,
        selectedFile, //May not be used
        stageFiles,
        // captureSelection,
        highlight,
        processFiles,

        highlightedText,
        highlightedSegments,

        getFiles,
        createFiles,
        updateFiles,

    }
}