<template>
    <div class="flex flex-col h-full overflow-y-auto p-2  space-y-2 dark:bg-gray-800" ref="chatContainer">
      <div v-for="(message, index) in userMessages" :key="index" class="flex relative "
           :class="{ 'justify-end': message.role == 'user' }">
           <ButtonClose  @close="removeMessage(index)" />
        <div :class="[message.role == 'user' ? '' : 'w-full']">
          <div class="py-2 px-4 rounded-lg markdown-content pr-12"
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
  import ButtonClose from '@/components/ButtonClose.vue';

  const md = new MarkdownIt();
  const props = defineProps({ messages: { type: Array, default: [] } });
  const emit = defineEmits(['removeMessage']);
  const chatContainer = ref(null);
  
  function renderMarkdown(text) {
    const paragraphs = text.split(/\n\n/);
    const doubleSpacedText = paragraphs.join('\n\n');
    return md.render(doubleSpacedText);
  };
  
  const userMessages = computed(() => {
  let systemMessageSkipped = false;
  return props.messages.filter((message, index) => {
    if (message.role === 'system' && !systemMessageSkipped) {
      systemMessageSkipped = true; // Skip the first 'system' message
      return false;
    }
    return true;
  });
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

  function removeMessage(index)
  {
    emit('removeMessage', index)
  }
  </script>
  
  <style>
  .markdown-content p {
    margin-bottom: 1em;
  }
  </style>