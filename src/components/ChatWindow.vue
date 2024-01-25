<template>
    <div class="flex flex-col h-full overflow-y-auto p-4 space-y-4 dark:bg-gray-800" ref="chatContainer">
      <div v-for="(message, index) in userMessages" :key="index" class="flex"
           :class="{ 'justify-end': message.role == 'user' }">
        <div :class="[message.role == 'user' ? '' : 'w-full']">
          <div class="py-2 px-4 rounded-lg markdown-content"
               :class="[message.role == 'user'
                 ? 'bg-blue-500 text-white dark:bg-blue-700'
                 : 'bg-gray-200 text-gray-700 dark:bg-gray-600 dark:text-white']"
               v-html="renderMarkdown(message.content)">
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, nextTick, watch, computed } from 'vue';
  import MarkdownIt from 'markdown-it';
  
  const md = new MarkdownIt();
  const props = defineProps({ messages: { type: Array, default: [] } });
  const chatContainer = ref(null);
  
  function renderMarkdown(text) {
    const paragraphs = text.split(/\n\n/);
    const doubleSpacedText = paragraphs.join('\n\n');
    return md.render(doubleSpacedText);
  };
  
  // Computed property to filter out system messages before the first user message
  const userMessages = computed(() => {
    const firstUserIndex = props.messages.findIndex(message => message.role === 'user');
    return firstUserIndex !== -1 ? props.messages.slice(firstUserIndex) : [];
  });
  
  // Function to always keep the chat scrolled to the bottom
  const scrollToBottom = () => {
    if (chatContainer.value) {
      chatContainer.value.scrollTop = chatContainer.value.scrollHeight;
    }
  };
  
  onMounted(() => {
    scrollToBottom();
    watch(() => userMessages.value, () => {
      nextTick(scrollToBottom);
    }, { deep: true });
  });
  </script>
  
  <style>
  .markdown-content p {
    margin-bottom: 1em;
  }
  </style>