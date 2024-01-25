<template>
    <!-- {{ isFocused }} -->
    
    <div v-if="!isFocused"
         v-html="markdown(renderedContent)"
         v-bind="$attrs"
         class="border transition duration-300 preserve-whitespace-pre-line p-3 rounded-md"
         :class="{ 'border-blue-500 border-4': isFocused }" 
         @click="handleClick">
    </div> 
    <div v-if="isFocused"
     ref="editableDiv"
     v-bind="$attrs"
     contenteditable="true" 
     class="border transition duration-300 preserve-whitespace-pre-line p-3 rounded-md"
     :class="{ 'border-blue-500 border-4': isFocused }" 
     @focusout="handleBlur"
     @input="handleInput">
</div>

  </template>
  
  <script setup>
  import { ref,  onMounted, watch, toRef, nextTick, onUnmounted } from 'vue';
  import MarkdownIt from 'markdown-it';
  
  const props = defineProps(['content']);
  const content = toRef(props, 'content');
  const emit = defineEmits();
  
  const isFocused = ref(false);
  let isInputEvent = ref(false);
  const renderedContent = ref(null);
  const editableDiv = ref(null);
  
  watch(content, (newContent) => {
    if (renderedContent.value !== newContent && !isInputEvent.value) {
      renderedContent.value = newContent ?? '';
    }
    isInputEvent.value = false;
  });
  
  watch(isFocused, async (newValue) => {
    if (newValue) {
      await nextTick();
      editableDiv.value.innerText = renderedContent.value;
    }
  });
  
  onMounted(() => {
    renderedContent.value = content.value ?? '';
  });
  
  function handleInput(event) {
    isInputEvent.value = true;
    const newTextContent = event.target.innerText;
    renderedContent.value = newTextContent;
    emit('update:content', newTextContent);
  }
  
  function markdown(html) {
    const md = new MarkdownIt();
    return md.render(html ?? '');
  }
  
  
  function handleClick() {
  isFocused.value = true;
  document.addEventListener('mousedown', handleDocumentClick);
}

function handleBlur() {
  isFocused.value = false;
  document.removeEventListener('mousedown', handleDocumentClick);
}

function handleDocumentClick(event) {
  if (editableDiv.value && !editableDiv.value.contains(event.target)) {
    handleBlur();
  }
}

onUnmounted(() => {
  document.removeEventListener('mousedown', handleDocumentClick);
});
  
  </script>
  <style>


.preserve-whitespace-pre-wrap {
    white-space: pre-wrap;
    word-wrap: break-all;
}

.preserve-whitespace-pre-line {
    white-space: pre-line;
    word-wrap: break-all;
}



code {
    word-break: break-word;
    
    white-space : pre-wrap !important;
}


</style>