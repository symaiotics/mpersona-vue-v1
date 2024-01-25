import { props, emit, editableDiv } from './DivInput.vue';

export function handlePaste(event) {
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
// pastedData = pastedData.replace(/(<br\s*\/?>){3,}/gi, '<br><br>');
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
emit('update:modelValue', editableDiv.value.textContent);
}
