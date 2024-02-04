<template>
  <header class="absolute w-full z-30">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="flex items-center justify-between h-20">
        <!-- Site branding -->
        <div class="shrink-0 mr-5">
          <!-- Logo -->
          <router-link to="/" class="block" aria-label="Home">
            <img class="w-16 h-auto" src="/images/splash1.png" alt="Logo" />
          </router-link>
        </div>

        <!-- Desktop navigation -->
        <nav class="hidden md:flex md:grow">
          <!-- Desktop menu links -->
          <ul class="flex grow justify-end items-center font-medium">
            <li v-if="!token">
              <router-link to="/join" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">
                Join
              </router-link>
            </li>
            <li v-if="token">
              <router-link to="/personas" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">
                Personas
              </router-link>
            </li>
            <li v-if="token">
              <router-link to="/interact" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">
                Work Streams
              </router-link>
            </li>
            <li v-if="token">
              <router-link to="/account" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">
                Account
              </router-link>
            </li>
            <li>
              <router-link :to="token ? '/login' : '/login'" class="text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 px-5 py-2 flex items-center transition duration-150 ease-in-out">
                {{ token ? 'Logout' : 'Login' }}
              </router-link>
            </li>
          </ul>

             <!-- Connection status and username -->
             <div class="flex items-center space-x-4">
            <span v-if="wsUuid" class="text-sm text-green-500">(Connected)</span>
            <span v-if="tokenDecoded" class="text-sm italic dark:text-gray-300">{{ tokenDecoded.username }}</span>
          </div>

        </nav>

        
        <!-- Mobile menu button -->
        <div class="inline-flex md:hidden">
          <!-- Hamburger button -->
          <button class="hamburger" :class="{ active: mobileNavOpen }" aria-controls="mobile-nav" :aria-expanded="mobileNavOpen" @click="toggleMobileNav">
            <span class="sr-only">Menu</span>
            <svg class="w-6 h-6 fill-current text-gray-900 dark:text-gray-300" viewBox="0 0 24 24">
              <rect y="4" width="24" height="2" rx="1" />
              <rect y="11" width="24" height="2" rx="1" />
              <rect y="18" width="24" height="2" rx="1" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile navigation -->
    <transition name="slide">
      <nav v-show="mobileNavOpen" id="mobile-nav" class="fixed top-0 h-screen z-20 left-0 w-full max-w-sm overflow-scroll bg-white dark:bg-gray-900 shadow-lg no-scrollbar">
        <ul class="py-6 pr-4 pl-20">
          <li v-if="!token">
            <router-link to="/join" class="text-gray-600 dark:text-gray-300 py-2">Join</router-link>
          </li>
          <li v-if="token">
            <router-link to="/personas" class="text-gray-600 dark:text-gray-300 py-2">Personas</router-link>
          </li>
          <li v-if="token">
            <router-link to="/interact" class="text-gray-600 dark:text-gray-300 py-2">Work Streams</router-link>
          </li>
          <li v-if="token">
            <router-link to="/account" class="text-gray-600 dark:text-gray-300 py-2">Account</router-link>
          </li>
          <li>
            <router-link :to="token ? '/login' : '/login'" class="text-gray-600 dark:text-gray-300 py-2">
              {{ token ? 'Logout' : 'Login' }}
            </router-link>
          </li>
        </ul>
      </nav>
    </transition>
  </header>
</template>

<script setup>
import { ref } from 'vue';

import { useTokens } from '@/composables/useTokens.js';
import { useWebsockets } from '@/composables/useWebsockets.js';

const { token, tokenDecoded } = useTokens();
const { wsUuid } = useWebsockets();


const mobileNavOpen = ref(false);

function toggleMobileNav() {
  mobileNavOpen.value = !mobileNavOpen.value;
}
</script>

<style>
/* Ensure you have these styles for the hamburger menu animation and the slide transition */
.hamburger.active {
  /* Your active hamburger menu styles */
}

.slide-enter-active, .slide-leave-active {
  transition: transform 0.3s ease;
}

.slide-enter-from, .slide-leave-to {
  transform: translateX(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}

.no-scrollbar {
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
}
</style>