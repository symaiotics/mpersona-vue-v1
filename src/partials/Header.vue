<template>
  <header class="absolute w-full z-30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-20">

        <!-- Site branding -->
        <div class="shrink-0 mr-5">
          <!-- Logo -->
          <router-link to="/" class="block" aria-label="Cruip">

            <img class="relative max-w-full mx-auto h-auto pointer-events-none" style="width:60px"
              src="/images/splash1.png" alt="iPhone mockup" aria-hidden="true" />

          </router-link>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex md:grow">

          <!-- Desktop menu links -->
          <ul class="flex grow flex-wrap items-center font-medium">
            <li v-if="!tokenDecoded">
              <router-link to="/join"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Join</router-link>
            </li>
            <!-- <li>
              <router-link to="/create"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Create</router-link>
            </li> -->
            <li v-if="token">
              <router-link to="/personas"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Personas</router-link>
            </li>
            <li  v-if="token">
              <router-link to="/interact"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Work Streams</router-link>
            </li>

            <!-- 
            <li v-if="token">
              <router-link to="/knowledgeProfiles"
                class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Knowledge
                Profiles</router-link>
            </li> -->

            <!-- <li>
              <router-link to="/testimonials" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">Testimonials</router-link>
            </li>  -->
            <!-- 1st level: hover -->
            <!-- <Dropdown title="Resources">
              <li>
                <router-link to="/help" class="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-500 flex py-2 px-4 leading-tight">Help center</router-link>
              </li>
              <li>
                <router-link to="/404" class="text-sm text-gray-600 dark:text-gray-400 hover:text-teal-500 dark:hover:text-teal-500 flex py-2 px-4 leading-tight">404</router-link>
              </li>
            </Dropdown>-->
          </ul>

          <!-- Desktop lights switch -->

          <div class=" flex flex-col justify-left ml-3 pt-2">
            <p v-if="wsUuid">(Connected)</p>
          </div>

          <div class="form-switch flex flex-col justify-left ml-3 pt-2">
            <router-link v-if="token" to="/login">Logout</router-link>
            <router-link v-if="!token" to="/login">Login</router-link>
          </div>

          <div class="form-switch flex flex-col justify-center ml-3">
            <input type="checkbox" name="light-switch" id="light-switch-desktop" v-model="darkMode" @input="toggleLights"
              class="light-switch sr-only" />
            <label class="relative" for="light-switch-desktop">
              <span
                class="relative bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm z-10"
                aria-hidden="true"></span>
              <svg class="absolute inset-0" width="44" height="24" viewBox="0 0 44 24" xmlns="http://www.w3.org/2000/svg">
                <g class="fill-current text-white" fill-rule="nonzero" opacity=".88">
                  <path
                    d="M32 8a.5.5 0 00.5-.5v-1a.5.5 0 10-1 0v1a.5.5 0 00.5.5zM35.182 9.318a.5.5 0 00.354-.147l.707-.707a.5.5 0 00-.707-.707l-.707.707a.5.5 0 00.353.854zM37.5 11.5h-1a.5.5 0 100 1h1a.5.5 0 100-1zM35.536 14.829a.5.5 0 00-.707.707l.707.707a.5.5 0 00.707-.707l-.707-.707zM32 16a.5.5 0 00-.5.5v1a.5.5 0 101 0v-1a.5.5 0 00-.5-.5zM28.464 14.829l-.707.707a.5.5 0 00.707.707l.707-.707a.5.5 0 00-.707-.707zM28 12a.5.5 0 00-.5-.5h-1a.5.5 0 100 1h1a.5.5 0 00.5-.5zM28.464 9.171a.5.5 0 00.707-.707l-.707-.707a.5.5 0 00-.707.707l.707.707z" />
                  <circle cx="32" cy="12" r="3" />
                  <circle fill-opacity=".4" cx="12" cy="12" r="6" />
                  <circle fill-opacity=".88" cx="12" cy="12" r="3" />
                </g>
              </svg>
              <span class="sr-only">Switch to light / dark version</span>
            </label>
          </div>

          <div v-if="tokenDecoded" class="form-switch flex flex-col justify-right ml-3 pt-2 italic">
            {{ tokenDecoded.username }}
          </div>

        </nav>

        <!-- Mobile menu -->
        <div class="inline-flex md:hidden">

          <!-- Mobile lights switch -->
          <div class="form-switch flex flex-col justify-center mr-6">
            <input type="checkbox" name="light-switch" id="light-switch-mobile" v-model="darkMode" @input="toggleLights"
              class="light-switch sr-only" />
            <label class="relative" for="light-switch-mobile">
              <span
                class="relative bg-gradient-to-t from-gray-100 to-white dark:from-gray-800 dark:to-gray-700 shadow-sm z-10"
                aria-hidden="true"></span>
              <svg class="absolute inset-0" width="44" height="24" viewBox="0 0 44 24" xmlns="http://www.w3.org/2000/svg">
                <g class="fill-current text-white" fill-rule="nonzero" opacity=".88">
                  <path
                    d="M32 8a.5.5 0 00.5-.5v-1a.5.5 0 10-1 0v1a.5.5 0 00.5.5zM35.182 9.318a.5.5 0 00.354-.147l.707-.707a.5.5 0 00-.707-.707l-.707.707a.5.5 0 00.353.854zM37.5 11.5h-1a.5.5 0 100 1h1a.5.5 0 100-1zM35.536 14.829a.5.5 0 00-.707.707l.707.707a.5.5 0 00.707-.707l-.707-.707zM32 16a.5.5 0 00-.5.5v1a.5.5 0 101 0v-1a.5.5 0 00-.5-.5zM28.464 14.829l-.707.707a.5.5 0 00.707.707l.707-.707a.5.5 0 00-.707-.707zM28 12a.5.5 0 00-.5-.5h-1a.5.5 0 100 1h1a.5.5 0 00.5-.5zM28.464 9.171a.5.5 0 00.707-.707l-.707-.707a.5.5 0 00-.707.707l.707.707z" />
                  <circle cx="32" cy="12" r="3" />
                  <circle fill-opacity=".4" cx="12" cy="12" r="6" />
                  <circle fill-opacity=".88" cx="12" cy="12" r="3" />
                </g>
              </svg>
              <span class="sr-only">Switch to light / dark version</span>
            </label>
          </div>

          <!-- Hamburger button -->
          <button class="hamburger" ref="hamburger" :class="{ active: mobileNavOpen }" aria-controls="mobile-nav"
            :aria-expanded="mobileNavOpen" @click="mobileNavOpen = !mobileNavOpen">
            <span class="sr-only">Menu</span>
            <svg
              class="w-6 h-6 fill-current text-gray-900 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 transition duration-150 ease-in-out"
              viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect y="4" width="24" height="2" rx="1" />
              <rect y="11" width="24" height="2" rx="1" />
              <rect y="18" width="24" height="2" rx="1" />
            </svg>
          </button>

          <!-- Mobile navigation -->
          <transition enter-active-class="transition ease-out duration-200 transform"
            enter-from-class="opacity-0 -translate-x-full" enter-to-class="opacity-100 translate-x-0"
            leave-active-class="transition ease-out duration-200" leave-from-class="opacity-100"
            leave-to-class="opacity-0">
            <nav v-show="mobileNavOpen" id="mobile-nav" ref="mobileNav"
              class="fixed top-0 h-screen z-20 left-0 w-full max-w-sm -ml-16 overflow-scroll bg-white dark:bg-gray-900 shadow-lg no-scrollbar">
              <div class="py-6 pr-4 pl-20">
                <!-- Logo -->
                <router-link to="/" class="inline-block mb-4" aria-label="Cruip">
                  <svg class="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient x1="26%" y1="100%" x2="100%" y2="100%" id="menulogo_a">
                        <stop stop-color="#3ABAB4" offset="0%" />
                        <stop stop-color="#7F9CF5" offset="100%" />
                      </linearGradient>
                      <linearGradient x1="26%" y1="100%" x2="100%" y2="100%" id="menulogo_b">
                        <stop stop-color="#3ABAB4" offset="0%" />
                        <stop stop-color="#3ABAB4" stop-opacity="0" offset="100%" />
                      </linearGradient>
                    </defs>
                    <path d="M32 16h-8a8 8 0 10-16 0H0C0 7.163 7.163 0 16 0s16 7.163 16 16z" fill="url(#menulogo_a)" />
                    <path d="M32 16c0 8.837-7.163 16-16 16S0 24.837 0 16h8a8 8 0 1016 0h8z" fill="url(#menulogo_b)" />
                  </svg>
                </router-link>
                <!-- Links -->
                <ul>
                  <li v-if="!tokenDecoded">
                    <router-link to="/join"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Join</router-link>
                  </li>
                  <!-- <li>
                    <router-link to="/create"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Create</router-link>
                  </li> -->
                  <li v-if="token">
                    <router-link to="/personas"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Personas</router-link>
                  </li>
                  <li>
                    <router-link to="/interact"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Work
                      Streams</router-link>
                  </li>
                  <!-- <li v-if="token">
                    <router-link to="/knowledgeProfiles"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Knowledge
                      Profiles</router-link>
                  </li> -->
                  <li v-if="!token">
                    <router-link to="/login"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Login</router-link>
                  </li>
                  <li v-if="token">
                    <router-link to="/login"
                      class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Logout</router-link>
                  </li>
                  <!-- <li>
                    <router-link to="/testimonials" class="flex text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 py-2">Testimonials</router-link>
                  </li>
                  <li class="py-2 my-2 border-t border-b border-gray-200 dark:border-gray-800">
                    <span class="flex text-gray-600 dark:text-gray-400 py-2">Resources</span>
                    <ul class="pl-4">
                      <li>
                        <router-link to="/help" class="text-sm flex font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 py-2">Help center</router-link>
                      </li>
                      <li>
                        <router-link to="/404" class="text-sm flex font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 py-2">404</router-link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <router-link to="/contact" class="font-medium w-full inline-flex items-center justify-center border border-transparent px-4 py-2 my-2 rounded text-white bg-teal-500 hover:bg-teal-400 transition duration-150 ease-in-out">Request code</router-link>
                  </li> -->
                </ul>
              </div>
            </nav>
          </transition>

        </div>

      </div>
    </div>
  </header>
</template>

<script setup>
import Dropdown from '@/utils/Dropdown.vue'
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';

import { useTokens } from '@/composables/useTokens.js'
import { useWebsockets } from '@/composables/useWebsockets.js'
const { token, tokenDecoded } = useTokens();
const { wsUuid } = useWebsockets();

const mobileNavOpen = ref(false);
const darkMode = ref(false);
const mobileNav = ref(null);
const hamburger = ref(null);

//Retreive the last setting from before F5
onMounted(() => {
  var dark = localStorage.getItem('dark-mode');
  if (dark === 'true' || dark === true) {
    darkMode.value = true;
    setDark(darkMode.value)
  }

  if (dark === 'false' || dark === false) {
    darkMode.value = false;
    setDark(darkMode.value)
  }
})

//Manually toggle
function toggleLights() {
  darkMode.value = !darkMode.value;
  setDark(darkMode.value)
}

//Set the localStorage and classes
function setDark(newValue) {
  localStorage.setItem('dark-mode', newValue);
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function clickOutside(e) {
  if (!mobileNavOpen.value || mobileNav.value.contains(e.target) || hamburger.value.contains(e.target)) return;
  mobileNavOpen.value = false;
}

function keyPress(event) {
  if (!mobileNavOpen.value || event.keyCode !== 27) return;
  mobileNavOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', clickOutside);
  document.addEventListener('keydown', keyPress);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', clickOutside);
  document.removeEventListener('keydown', keyPress);
});

</script>