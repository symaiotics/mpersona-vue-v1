<template>
    <div v-if="props.setMarker" class="flex space-x-2 m-2">
        <button @click="setMarker"
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <BookmarkIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <button @click="firstMarker"
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <ChevronDoubleLeftIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <button @click="previousMarker"
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <ChevronLeftIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <button @click="nextMarker"
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <ChevronRightIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <button @click="lastMarker"
            class="bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <ChevronDoubleRightIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <button @click="clearMarkers"
            class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
            <TrashIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
        </button>
        <slot></slot>
    </div>

    <div ref="editableDiv" contenteditable="true" @input="handleInput" @keydown="handleKeyDown" @keyup.enter="handleEnter"
        @paste="handlePaste" @mouseup="handleMouseUp" :class="['editable', 'form-input', 'w-full', 'pl-4', 'overflow-auto']"
        :placeholder="props.placeholder" aria-label="Search anything" :style="{ minHeight: '20px', maxHeight: '600px' }">
    </div>
</template>
  
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, nextTick, toRefs } from 'vue';
import { v4 as uuidv4 } from 'uuid';

import { useLexicon } from '@/composables/useLexicon.js';

import { BookmarkIcon } from '@heroicons/vue/24/solid'
// import { ArrowLeft } from '@heroicons/vue/24/solid'
// import { ArrowRight } from '@heroicons/vue/24/solid'
import { ChevronLeftIcon } from '@heroicons/vue/24/solid'
import { ChevronRightIcon } from '@heroicons/vue/24/solid'
import { ChevronDoubleLeftIcon } from '@heroicons/vue/24/solid'
import { ChevronDoubleRightIcon } from '@heroicons/vue/24/solid'
import { TrashIcon } from '@heroicons/vue/24/solid'

const { L_ } = useLexicon()

const emit = defineEmits(['update:modelValue', 'selectionChange', 'setMarkers']);
//   const modelValue = ref('');
const editableDiv = ref(null);

const props = defineProps({
    setMarker: { type: Boolean, default: false },
    modelValue: String,
    asPlainText: { type: Boolean, default: true },
    placeholder: { type: String, default: "" },

});

watch(() => props.modelValue, (newValue, oldValue) => {
    if (editableDiv.value && editableDiv.value.innerHTML !== newValue) {
        editableDiv.value.innerHTML = newValue;
    }
});

onMounted(() => {
    if (editableDiv.value) {
        // editableDiv.value.textContent = props.modelValue;
        editableDiv.value.innerHTML = props.modelValue;
        ensureCursorTarget(); // Call this to ensure initial content is correctly formatted
    }

});


function handleInput(event) {
    // Calculate cursor position before updating the model
    //   const cursorPosition = calculateCursorPosition(event.target);

    // Update model value
    emit('update:modelValue', event.target.innerHTML);

    // After Vue has updated the DOM, restore the cursor position
    nextTick(() => {
        // restoreCursorPosition(event.target, cursorPosition);
    });
}


function handleKeyDown(event) {
    // if (event.key === 'Enter' && !event.shiftKey) {
    //   event.preventDefault();
    //   trigger();
    // }
}

function handleEnter(event) {
    if (!event.shiftKey) {
        event.preventDefault();
        trigger();
    }
}




function handlePaste(event) {
    event.preventDefault();
    const clipboardData = event.clipboardData || window.clipboardData;
    const selection = window.getSelection();

    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);
    range.deleteContents();

    let insertedNode;

    if (props.asPlainText) {
        let pastedData = clipboardData.getData('text/plain');
        // Remove excessive line breaks
        pastedData = pastedData.replace(/(\r\n|\r|\n){3,}/g, '\n\n');
        const textNode = document.createTextNode(pastedData);
        range.insertNode(textNode);
        insertedNode = textNode;
    } else {
        let pastedData = clipboardData.getData('text/html');
        // Remove excessive <br> tags
        pastedData = pastedData.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');
        const div = document.createElement('div');
        div.innerHTML = pastedData;
        range.insertNode(div);
        insertedNode = div;
    }

    // Move the selection to the end of the inserted content
    range.setStartAfter(insertedNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    // Update the model value to reflect the changes
    // emit('update:modelValue', editableDiv.value.textContent);
    emit('update:modelValue', editableDiv.value.innerHTML);
}


function trigger() {
    // Implement your trigger logic here
}

function ensureCursorTarget() {
    const div = editableDiv.value;
    if (div) {
        // Replace completely empty divs (or those with only whitespace) with divs containing a non-breaking space
        div.innerHTML = div.innerHTML.replace(/<div>\s*<\/div>/g, '<div>&nbsp;</div>');
    }
}




function handleMouseUp() {

    captureCursorInfo();

    const selection = window.getSelection();
    if (!selection.isCollapsed) {
        const range = selection.getRangeAt(0);
        const selectedHtml = range.cloneContents();
        const div = document.createElement('div');
        div.appendChild(selectedHtml);
        const htmlString = div.innerHTML;

        const start = calculateCursorPosition(range.startContainer, range.startOffset);
        const end = calculateCursorPosition(range.endContainer, range.endOffset);

        emit('selectionChange', {
            original: props.modelValue,
            start,
            end,
            startContainer: range.startContainer,
            endContainer: range.endContainer,
            html: htmlString
        });
    }
}

//Working, not accounting for Markers
// function calculateCursorPosition(container, offset) {
//     const range = document.createRange();
//     range.setStart(editableDiv.value, 0);
//     range.setEnd(container, offset);
//     return range.toString().length;
// }


function calculateCursorPosition(container, offset) {
    const range = document.createRange();
    range.setStart(editableDiv.value, 0);
    range.setEnd(container, offset);

    // Create a walker to traverse the nodes, skipping marker nodes
    const walker = document.createTreeWalker(
        editableDiv.value,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode(node) {
                // Skip marker elements
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mPersonaMarker')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    let length = 0;
    while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        if (currentNode === container) {
            length += offset;
            break;
        } else if (currentNode.nodeType === Node.TEXT_NODE) {
            length += currentNode.nodeValue.length;
        }
    }

    return length;
}




// function calculateCursorPosition(editableDiv) {
//     const selection = window.getSelection();
//     if (selection.rangeCount === 0) return null; // No selection, return null

//     const range = selection.getRangeAt(0);
//     const preCaretRange = range.cloneRange(); // Clone the current range
//     preCaretRange.selectNodeContents(editableDiv); // Select all text
//     preCaretRange.setEnd(range.endContainer, range.endOffset); // Set the end of the range to the cursor position
//     const cursorPosition = preCaretRange.toString().length; // The cursor position is the length of the range
//     return cursorPosition;
// }

// function restoreCursorPosition(editableDiv, cursorPosition) {
//     const selection = window.getSelection();
//     const range = document.createRange();
//     range.setStart(editableDiv, 0);
//     range.collapse(true);

//     const childNodes = Array.from(editableDiv.childNodes);
//     let currentPos = 0;

//     for (const node of childNodes) {
//         if (node.nodeType === 3) { // Node is a text node
//             const nextPos = currentPos + node.length;
//             if (cursorPosition <= nextPos) {
//                 // Found the node where the cursor should be
//                 range.setStart(node, cursorPosition - currentPos);
//                 range.collapse(true);
//                 break;
//             }
//             currentPos = nextPos;
//         } else {
//             // Handle other node types if necessary
//         }
//     }

//     selection.removeAllRanges();
//     selection.addRange(range);
// }

let markers = ref([])
let markerCursorIndexes = ref([])
let lastCursorLocation = ref(null)

function captureCursorInfo() {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const cursorIndex = calculateCursorPosition(range.endContainer, range.endOffset);
        const textContentWithoutMarkers = getTextContentExcludingMarkers(editableDiv.value);

        // Extract the next 100 characters after the cursor index
        const extract = textContentWithoutMarkers.substring(cursorIndex, cursorIndex + 100);

        lastCursorLocation.value = {
            range: range.cloneRange(),
            cursorIndex,
            extract // Add the extracted text to lastCursorLocation
        };
    }
}

function getTextContentExcludingMarkers(element) {
    let textContent = '';
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
        {
            acceptNode(node) {
                // Skip marker elements
                if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mPersonaMarker')) {
                    return NodeFilter.FILTER_REJECT;
                }
                return NodeFilter.FILTER_ACCEPT;
            }
        }
    );

    while (walker.nextNode()) {
        const currentNode = walker.currentNode;
        if (currentNode.nodeType === Node.TEXT_NODE) {
            textContent += currentNode.nodeValue;
        }
    }

    return textContent;
}

// Update the setMarker function to add the marker element to the markers array

function setMarker() {
  if (!lastCursorLocation.value) {
    return;
  }

  // Check if a marker already exists at the same cursorIndex
  const existingMarkerIndex = markerCursorIndexes.value.findIndex(
    markerIndex => markerIndex.cursorIndex === lastCursorLocation.value.cursorIndex
  );

  // If a marker already exists, do not add a new one
  if (existingMarkerIndex !== -1) {
    console.warn(`A marker already exists at cursor index ${lastCursorLocation.value.cursorIndex}.`);
    return;
  }

  // If no marker exists, proceed with adding a new marker
  const markerId = uuidv4(); // Generate a unique UUID for the marker
  const markerEl = document.createElement('span');
  markerEl.classList.add('mPersonaMarker');
  markerEl.textContent = '[Marker | Marqueur]';
  markerEl.dataset.markerId = markerId; // Store the UUID in a data attribute

  // Insert the marker element at the cursor location
  const range = lastCursorLocation.value.range;
  range.insertNode(markerEl);

  // Move the cursor after the marker
  range.setStartAfter(markerEl);
  range.collapse(true);

  // Apply the new range to the selection
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);

  // Add the new marker's cursor index into the sorted markerCursorIndexes array
  const newMarker = {
    cursorIndex: lastCursorLocation.value.cursorIndex,
    markerId: markerId,
    extract: lastCursorLocation.value.extract // Include the .extract property
  };
  const insertIndex = markerCursorIndexes.value.findIndex(
    marker => newMarker.cursorIndex < marker.cursorIndex
  );
  if (insertIndex === -1) {
    markerCursorIndexes.value.push(newMarker); // Append at the end if it's the last
  } else {
    markerCursorIndexes.value.splice(insertIndex, 0, newMarker); // Insert at the correct position
  }

  // Add the marker to the markers array
  markers.value.push(markerEl);

  // Recalculate marker data for all markers
  recalculateMarkerData();

  // Emit the updated markers array
  emit('setMarkers', markerCursorIndexes.value);

  // Update the current marker index
  currentMarkerIndex.value = markers.value.length - 1;
}

function recalculateMarkerData() {
  // We need to handle the last segment separately because it does not end with a marker.
  // Add a virtual marker at the end of the content to simplify the loop.
  const virtualEndMarker = {
    cursorIndex: getTextContentExcludingMarkers(editableDiv.value).length
  };
  const markersWithEnd = [...markerCursorIndexes.value, virtualEndMarker];

  markerCursorIndexes.value.forEach((markerIndex, index) => {
    // Calculate the start and end indices for this segment.
    const startIndex = markerIndex.cursorIndex;
    const endIndex = markersWithEnd[index + 1].cursorIndex;

    // Extract the text and HTML content for this segment.
    const textContent = getTextContentExcludingMarkers(editableDiv.value).substring(startIndex, endIndex);
    const htmlContent = extractHtmlContentFromRange(startIndex, endIndex - startIndex);

    // Update the marker index with the new data.
    markerIndex.textContent = textContent;
    markerIndex.textLength = textContent.length;
    markerIndex.htmlContent = htmlContent;
    markerIndex.htmlLength = htmlContent.length;
  });
}

function calculateSegmentSize(cursorIndex, insertIndex) {
    if (insertIndex !== -1 && insertIndex < markerCursorIndexes.value.length - 1) {
        // There is a subsequent marker, calculate size up to the next marker's cursorIndex
        let nextCursor = markerCursorIndexes.value[insertIndex].cursorIndex;
        return nextCursor - cursorIndex;
    } else {
        // This is the last segment or no subsequent marker found, calculate size up to the end of content
        let textContentWithoutMarkers = getTextContentExcludingMarkers(editableDiv.value);
        return textContentWithoutMarkers.length - cursorIndex;
    }
}

function extractHtmlContentFromRange(startIndex, length) {
  const range = document.createRange();
  const walker = document.createTreeWalker(
    editableDiv.value,
    NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT,
    {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mPersonaMarker')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }
  );

  let currentNode = walker.nextNode();
  let currentLength = 0;

  // Find the start node for the range.
  while (currentNode && currentLength < startIndex) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      currentLength += currentNode.nodeValue.length;
    }
    if (currentLength < startIndex) {
      currentNode = walker.nextNode();
    }
  }

  if (currentNode && currentNode.nodeType === Node.TEXT_NODE) {
    range.setStart(currentNode, currentNode.nodeValue.length - (currentLength - startIndex));
  } else if (currentNode) {
    // If the current node is not a text node, set the start at the beginning of the node.
    range.setStartBefore(currentNode);
  }

  // Find the end node for the range.
  while (currentNode && currentLength < startIndex + length) {
    if (currentNode.nodeType === Node.TEXT_NODE) {
      currentLength += currentNode.nodeValue.length;
    }
    if (currentLength >= startIndex + length) {
      if (currentNode.nodeType === Node.TEXT_NODE) {
        range.setEnd(currentNode, currentNode.nodeValue.length - (currentLength - (startIndex + length)));
      } else {
        // If the current node is not a text node, set the end at the end of the node.
        range.setEndAfter(currentNode);
      }
      break;
    }
    currentNode = walker.nextNode();
  }

  // If we didn't find a suitable end node, set the range to the end of the content.
  if (!currentNode) {
    range.setEndAfter(editableDiv.value.lastChild);
  }

  // Extract the HTML content from the range.
  const fragment = range.cloneContents();
  const div = document.createElement('div');
  div.appendChild(fragment);
  return div.innerHTML;
}

function restoreCursorPositionAfterMarkerInsertion(cursorPosition) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.setStart(editableDiv.value, 0);
    range.collapse(true);

    const childNodes = Array.from(editableDiv.value.childNodes);
    let currentPos = 0;

    for (const node of childNodes) {
        if (node.nodeType === 3) { // Node is a text node
            const nextPos = currentPos + node.length;
            if (cursorPosition <= nextPos) {
                range.setStart(node, cursorPosition - currentPos);
                range.collapse(true);
                break;
            }
            currentPos = nextPos;
        } else if (node.nodeType === 1 && node.classList.contains('marker')) {
            // Skip the marker node
            currentPos += node.outerHTML.length;
        }
    }

    selection.removeAllRanges();
    selection.addRange(range);
}



function clearMarkers() {
    markers.value.forEach(markerEl => {
        markerEl.remove(); // Remove the marker element from the DOM
    });
    markers.value = []; // Clear the markers array
    markerCursorIndexes.value = [];
    emit('setMarkers', markerCursorIndexes.value)
}

function firstMarker() {
    if (markers.value.length > 0) {
        currentMarkerIndex.value = 0;
        const firstMarkerEl = markers.value[currentMarkerIndex.value];
        highlightMarker(firstMarkerEl);
    }
}

// Function to navigate to the previous marker
// Function to navigate to the previous marker and ensure it's scrolled into view
function previousMarker() {
    if (markers.value.length > 0) {
        if (currentMarkerIndex.value > 0) {
            currentMarkerIndex.value--;
        } else {
            currentMarkerIndex.value = markers.value.length - 1; // Wrap to last marker
        }
        const previousMarkerEl = markers.value[currentMarkerIndex.value];
        highlightMarker(previousMarkerEl);
    }
}

// Function to navigate to the next marker and ensure it's scrolled into view
function nextMarker() {
    if (markers.value.length > 0) {
        if (currentMarkerIndex.value < markers.value.length - 1) {
            currentMarkerIndex.value++;
        } else {
            currentMarkerIndex.value = 0; // Wrap to first marker
        }
        const nextMarkerEl = markers.value[currentMarkerIndex.value];
        highlightMarker(nextMarkerEl);
    }
}

// Function to navigate to the last marker
function lastMarker() {
    if (markers.value.length > 0) {
        currentMarkerIndex.value = markers.value.length - 1;
        const lastMarkerEl = markers.value[currentMarkerIndex.value];
        highlightMarker(lastMarkerEl);
    }
}

// Function to highlight a marker and scroll it into view
// Function to highlight a marker and scroll it into view
// Function to highlight a marker and scroll it into view
function highlightMarker(markerEl) {
    // Clear any previous selection
    const selection = window.getSelection();
    selection.removeAllRanges();

    // Create a new range and select the marker element
    const range = document.createRange();
    range.selectNodeContents(markerEl);
    selection.addRange(range);

    // Scroll the marker element into view, affecting all scrollable ancestors
    markerEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'nearest' });
}
// You need to initialize a currentMarkerIndex to keep track of the current marker
let currentMarkerIndex = ref(-1);


</script>
  
<style>
/* Add custom styles for the editable div */
.editable {
    overflow-y: auto;
    word-break: break-word;
    white-space: pre-wrap;
}

/* Placeholder effect for the contenteditable div */
[contenteditable]:empty:before {
    content: attr(placeholder);
    display: block;
    color: grey;
}

/* Tailwind classes can be applied directly in the template or here */
.form-input {
    /* Custom styles or overrides for the form-input class */
}

.mPersonaMarker {
    /* Styles for the marker */
    color: red;
    /* Example color */
}
</style>