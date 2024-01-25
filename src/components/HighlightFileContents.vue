<template>
    <div class="relative p-4" v-if="props.originalText">
        <div class="flex space-x-4 mb-4">
            <button @click="addHighlight('context')" class="px-4 py-2 bg-red-500 text-white rounded">Context</button>
            <button @click="addHighlight('structure')" class="px-4 py-2 bg-blue-500 text-white rounded">Structure</button>
            <button @click="addHighlight('content')" class="px-4 py-2 bg-yellow-500 text-black rounded">Content</button>
        </div>

        <div class="flex space-x-4 mb-4">
            <button @click="generateFacts" class="px-4 py-2 bg-blue-500 text-black rounded">Stage Facts for Processing</button>
            <button @click="startProcessingAndSaveFacts" class="px-4 py-2 bg-green-500 text-black rounded">Process and Save Facts</button>
            <button @click="pauseProcessing" class="px-4 py-2 bg-yellow-500 text-black rounded">Pause Processing</button>
        </div>

        <div class = "w-full">
            <p>
                <slot>
                </slot>
            </p>
        </div>

        <!-- {{ fileUuid }} -->
        <div class="flex min-h-48 overflow-y-auto">
            <!-- Left Column -->
            <div class="w-2/3  p-4 overflow-y-auto h-screen md:h-[66.6667vh] ">

                <div class="relative  ">
                    <!-- Wrapper div -->

                    <!-- {{ props.lastSelection }}
                    {{ props.highlights }} -->
                    <!-- Original text -->
                    <div ref="parentNodeRef" class="z-10 font-sans text-base leading-normal p-0 preserve-newlines"
                        @mouseup="captureSelection" v-html="props.originalText"></div>

                    <!-- Highlighted text overlay -->
                    <div ref="highlightedContent"
                        class="absolute inset-0 z-20 font-sans text-base leading-normal pointer-events-none  preserve-newlines"
                        v-html="getHighlightedText"></div>

                </div>


            </div>

            <!-- Right Column -->
            <div class="w-1/3 p-4 overflow-y-auto h-screen md:h-[66.6667vh] ">
                <div>
                    <div v-for="(segment, index) in getHighlightedSegmentsArray" class="relative" :key="'segments' + index">
                        <div class="m-2 rounded p-2" :class="`highlight-${segment.type}`">
                            {{ segment.content.substring(0, 50) }}... ({{ segment.content.length }})
                        </div>

                        <!-- Delete button -->
                        <button
                            class="absolute top-0 right-0 bg-red-500 text-white w-7 h-7 rounded-full flex items-center justify-center shadow-lg transform hover:scale-105 transition-transform duration-150"
                            @click="deleteHighlight(index)">
                            ×
                        </button>
                    </div>

                </div>
            </div>
        </div>





    </div>
</template>
  


<script setup>
import { ref, computed, onMounted } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import { useFiles } from '@/composables/useFiles.js'
const { highlightedText, highlightedSegments } = useFiles()

let props = defineProps({
    fileUuid: { type: String, default: "" },
    originalText: { type: String, default: "Some basic longform text to be categorized" },
    lastSelection: { type: Object, default: {} },
    highlights: { type: Array, default: [] }
})

let emit = defineEmits(['setLastSelection', "addHighlight", "deleteHighlight", "generateFacts", "startProcessingAndSaveFacts", "pauseProcessing"])



const parentNodeRef = ref(null);

onMounted(() => {
    parentNodeRef.value.id = uuidv4(); // Assigning unique id to the parent node
});


// function setSelection() {
//     emit("setLastSelection", props.fileUuid);
// }

const addHighlight = (type) => {
    emit("addHighlight", { type, fileUuid: props.fileUuid });
};

function deleteHighlight(index) {
    emit("deleteHighlight", { index, fileUuid: props.fileUuid });
}

function generateFacts() {
    emit('generateFacts', props.fileUuid)
}


function startProcessingAndSaveFacts() {
    emit('startProcessingAndSaveFacts', props.fileUuid)
}

function pauseProcessing() {
    emit('pauseProcessing', props.fileUuid)
}


//Get the array and render the list.
const getHighlightedSegmentsArray = computed(() => {
    return highlightedSegments(props.originalText, props.highlights)
});

//Add the HTML to actually highlight the text
const getHighlightedText = computed(() => {
    return highlightedText(props.originalText, props.highlights)
});


const captureSelection = () => {
    const selection = window.getSelection();
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    let startNode = range.startContainer;
    let endNode = range.endContainer;

    if (startNode.nodeType !== Node.TEXT_NODE && startNode.firstChild) {
        startNode = startNode.firstChild;
    }

    if (endNode.nodeType !== Node.TEXT_NODE && endNode.lastChild) {
        endNode = endNode.lastChild;
    }

    var start = calculateOffset(parentNodeRef.value, startNode) + range.startOffset;
    var end = calculateOffset(parentNodeRef.value, endNode) + range.endOffset;

    if (start > end) [start, end] = [end, start];

    //   console.log({ start, end });

    emit("setLastSelection", { fileUuid: props.fileUuid, start, end });

};

const calculateOffset = (parentNode, targetNode) => {
    let offset = 0;

    const traverseNodes = (node) => {
        for (let child of node.childNodes) {
            if (child === targetNode || (child.contains && child.contains(targetNode))) return true;
            if (child.nodeType === Node.TEXT_NODE) offset += child.textContent.length;
            if (child.childNodes.length > 0 && traverseNodes(child)) return true;
        }
        return false;
    };

    traverseNodes(parentNode);
    return offset;
};

// const scrollId = ref('id-' + uuidv4())
// const highlights = ref([]);
// const textContent = ref(null);
// const highlightedContent = ref(null);
// let lastSelection = ref(null);

//Get the cursor text selection
// const captureSelection = () => {
//     const selection = window.getSelection();
//     if (!selection.rangeCount) return;

//     const range = selection.getRangeAt(0);
//     const start = range.startOffset;
//     const end = range.endOffset;

//     lastSelection.value = { start, end };
// };

// if (!lastSelection.value) return;

// const newHighlight = { ...lastSelection.value, type };

// for (let i = 0; i < highlights.value.length; i++) {
//     const highlight = highlights.value[i];

//     // Completely contained
//     if (newHighlight.start <= highlight.start && newHighlight.end >= highlight.end) {
//         highlights.value.splice(i, 1);
//         i--;
//         continue;
//     }

//     // Partial overlap
//     if (newHighlight.start < highlight.end && newHighlight.end > highlight.start) {
//         if (highlight.type !== newHighlight.type) {
//             if (newHighlight.start > highlight.start) {
//                 highlight.end = newHighlight.start;
//             } else if (newHighlight.end < highlight.end) {
//                 highlight.start = newHighlight.end;
//             }
//         } else {
//             highlight.start = Math.min(newHighlight.start, highlight.start);
//             highlight.end = Math.max(newHighlight.end, highlight.end);
//             return;
//         }
//     }
// }

// // Add the new highlight
// highlights.value.push(newHighlight);

// // Reset the last selection
// lastSelection.value = null;




//Generate the sockets for each highlight
//Use the persona as the prompt for each socket
//Add the completed results of the prompts
//Compile the results of the highlight sockets to a resultset
//Merge the arrays together and validate the JSON is accurate
//Save to the Facts collection when complete
//Make a searchable fact window


/*
Collect the context from the Knowledge Profile
Collect the context from this file specifically
Extract out all the separate elements in the content

Have GPT create a JSON array of all the facts contained in the file
fact String? Object? Any?
questionsForFact Array of questions to ask this fact

Insert these facts into the DB
{
knowledgeProfile
fileDetails {size: filename.length, mime, filename, azureFilename }
fileContext Array of the various context elements snupped

fact
questionsForFact

identifiedStructure String

momentCreated, etc.
}

*/
// }


// //Get the highlighted segments
// const highlightedJSON = computed(() => {
//     let contextText = '';
//     let structureText = '';
//     let contentText = '';

//     for (const highlight of highlights.value) {
//         const segment = props.originalText.substring(highlight.start, highlight.end);
//         switch (highlight.type) {
//             case 'context':
//                 contextText += segment.replaceAll(/\n/g, "");
//                 break;
//             case 'structure':
//                 structureText += segment.replaceAll(/\n/g, "");
//                 break;
//             case 'content':
//                 contentText += segment.replaceAll(/\n/g, "");
//                 break;
//         }
//     }

//     return {
//         context: contextText,
//         structure: structureText,
//         content: contentText
//     };
// });

// const highlightedSegmentsJSON = computed(() => {
//     let contextSegments = [];
//     let structureSegments = [];
//     let contentSegments = [];
//     let index = 0;
//     for (const highlight of highlights.value) {
//         const segment = props.originalText.substring(highlight.start, highlight.end);
//         switch (highlight.type) {
//             case 'context':
//                 contextSegments.push(segment);
//                 break;
//             case 'structure':
//                 structureSegments.push(segment);
//                 break;
//             case 'content':
//                 contentSegments.push(segment);
//                 break;

//         }
//         index++;
//     }

//     return {
//         context: contextSegments,
//         structure: structureSegments,
//         content: contentSegments
//     };
// });



</script>
  
<style>
::selection {
    background-color: lightblue;
    color: black;
    /* This will set the color of the text when selected. Adjust as needed. */
}

/* For browser compatibility, also include the following */
::-moz-selection {
    background-color: lightblue;
    color: black;
}


.dark ::selection {
    background-color: darkblue;
    color: white;
    /* This will set the color of the text when selected. Adjust as needed. */
}

/* For browser compatibility, also include the following */
.dark ::-moz-selection {
    background-color: darkblue;
    color: white;
}


.preserve-newlines {
    white-space: pre-line;
}

.highlight-context {
    background-color: #ff54547c;
    color: black;
}

.highlight-structure {
    background-color: #add8e6aa;
    color: black;
}

.highlight-content {
    background-color: #ffd392be;
    color: black;
}

.dark .highlight-context {
    background-color: #ff54547c;
    color: white;
}

.dark .highlight-structure {
    background-color: #add8e6aa;
    color: white;
}

.dark .highlight-content {
    background-color: #ffd392be;
    color: white;
}



.custom-scrollbar::-webkit-scrollbar {
    width: 5px;
    /* width of the entire scrollbar */
    height: 5px;
    /* height for horizontal scrollbars */
}

.custom-scrollbar::-webkit-scrollbar-track {
    background: #f2f4f8;
    /* color of the tracking area */
}

.custom-scrollbar::-webkit-scrollbar-thumb {
    background-color: #888;
    /* color of the scroll thumb */
    border-radius: 20px;
    /* roundness of the scroll thumb */
    border: 3px solid #f2f4f8;
    /* creates padding around scroll thumb */
}
</style>
  