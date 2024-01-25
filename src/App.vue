<template>
  <NotificationGroup group="success">
    <div class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none" style="z-index:1000">
      <div class="w-full max-w-sm">
        <Notification v-slot="{ notifications }" enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0" leave="transition ease-in duration-500"
          leave-from="opacity-100" leave-to="opacity-0" move="transition duration-500" move-delay="delay-300">
          <div class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
            v-for="notification in notifications" :key="notification.id">
            <div class="flex items-center justify-center w-12 bg-green-500">
              <svg class="w-6 h-6 text-white fill-current" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 3.33331C10.8 3.33331 3.33337 10.8 3.33337 20C3.33337 29.2 10.8 36.6666 20 36.6666C29.2 36.6666 36.6667 29.2 36.6667 20C36.6667 10.8 29.2 3.33331 20 3.33331ZM16.6667 28.3333L8.33337 20L10.6834 17.65L16.6667 23.6166L29.3167 10.9666L31.6667 13.3333L16.6667 28.3333Z" />
              </svg>
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-green-500">{{ notification.title }}</span>
                <p class="text-sm text-gray-600">{{ notification.text }}</p>
              </div>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>


  <NotificationGroup group="failure">
    <div class="fixed inset-0 flex items-start justify-end p-6 px-4 py-6 pointer-events-none" style="z-index:1000">
      <div class="w-full max-w-sm">
        <Notification v-slot="{ notifications }" enter="transform ease-out duration-300 transition"
          enter-from="translate-y-2 opacity-0 sm:translate-y-0 sm:translate-x-4"
          enter-to="translate-y-0 opacity-100 sm:translate-x-0" leave="transition ease-in duration-500"
          leave-from="opacity-100" leave-to="opacity-0" move="transition duration-500" move-delay="delay-300">
          <div class="flex w-full max-w-sm mx-auto mt-4 overflow-hidden bg-white rounded-lg shadow-md"
            v-for="notification in notifications" :key="notification.id">
            <div class="flex items-center justify-center w-12 bg-red-500">
              X
            </div>

            <div class="px-4 py-2 -mx-3">
              <div class="mx-3">
                <span class="font-semibold text-red-500">{{ notification.title }}</span>
                <p class="text-sm text-gray-600">{{ notification.text }}</p>
              </div>
            </div>
          </div>
        </Notification>
      </div>
    </div>
  </NotificationGroup>


  <router-view />
</template>

<script setup>
import env from "@/env.js"

import { onMounted } from 'vue'
import AOS from 'aos'

import { useModels } from '@/composables/useModels.js'
import { useLexicon } from '@/composables/useLexicon.js'
import { useTokens } from '@/composables/useTokens.js'
import { useWebsockets } from '@/composables/useWebsockets.js'
const { bootstrapModels } = useModels();
const { getLexicon } = useLexicon();
const { recallTokens } = useTokens();
const { websocketConnection, wsUuid } = useWebsockets()

onMounted(() => {
  bootstrapModels();
  getLexicon();
  recallTokens();
  AOS.init({
    once: true,
    disable: 'phone',
    duration: 600,
    easing: 'ease-out-sine',
  })

  websocketConnection()
  setDark(true)
})



function setDark(newValue) {
  localStorage.setItem('dark-mode', newValue);
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}


</script>

<style>
.multiselect__tags {
  @apply bg-gray-100 dark:bg-gray-800 rounded-t;
}

.multiselect__tag {
  @apply text-black dark:text-white bg-green-100 dark:bg-green-800 rounded-t;

}

.multiselect__single {
  @apply text-black dark:text-white bg-green-100 dark:bg-green-800;
}

.multiselect__element {
  @apply text-black dark:text-white bg-gray-100 dark:bg-gray-800;
}


.multiselect__placeholder {
  @apply bg-gray-100 dark:bg-gray-800 rounded-t;

}

.multiselect__select {
  @apply bg-gray-100 dark:bg-gray-800 rounded-t;
}
</style>
