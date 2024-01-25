<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <!-- Page illustration -->
      <div class="relative max-w-6xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1 class="h1 font-red-hat-display mb-4">Login to mPersona</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Manage your private personas.</p>
            </div>

            <!-- Contact form -->

            <div class="flex flex-wrap -mx-3 ">
              <div class="w-full  px-3 mb-4  ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="username">Username
                  <span class="text-red-600">*</span></label>
                <input v-model="username" id="username" type="text" class="form-input w-full"
                  placeholder="Enter your username" required />
              </div>
              <div class="w-full   px-3 mb-4  ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="password">Password
                  <span class="text-red-600">*</span></label>
                <input v-model="password" id="password" type="password" class="form-input w-full"
                  placeholder="Enter your password" required  @keyup.enter="doLogin" />
              </div>
            </div>


            <div class="flex flex-wrap -mx-3 mt-6 ">
              <div class="w-full px-3">
                <button @click="doLogin"
                  class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                  <span>Login</span>
                  <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-current"
                      d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </button>
              </div>
            </div>


          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <!-- <Footer /> -->

  </div>
</template>

<script setup>

import { ref, computed, onMounted } from 'vue';


import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'

//Plugins
import { useRouter, useRoute } from 'vue-router'

onMounted(()=>{
  unsetTokens();
})

//Components

//Composables
import { notify } from "notiwind"

import { useAccounts } from '@/composables/useAccounts.js'
import { useTokens } from '@/composables/useTokens.js'
const { login } = useAccounts();
const { unsetTokens } = useTokens();
const router = useRouter()

let username = ref(null)
let password = ref(null)

function doLogin() {
  login(username.value, password.value).then((response) => {
    notify({ group: "success", title: "Success", text: "Login successful"}, 4000) // 4s
    router.push({ name: 'home' })
  }).catch((error) => {
    console.log("Error identified", error)
    notify({ group: "failure", title: "Error", text: "Login unsuccessful. Please try again." }, 4000) // 4s


  });

}
</script>
