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
              <h1 class="h1 font-red-hat-display mb-4">Create a mPersona Account</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Develop as many private personas as you like.</p>
              <p class="text-l text-gray-600 dark:text-gray-400">Currently free to join and use during Alpha testing.</p>
            </div>

            <!-- Contact form -->

            <div class="flex flex-wrap -mx-3 ">
              <div class="w-full  px-3 mb-4  ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="username">Username
                  <span class="text-red-600">*</span></label>
                <input v-model="newUser.username" id="username" type="text" class="form-input w-full"
                  placeholder="Enter your username" required />
              </div>
              <div class="w-full   px-3 mb-4  ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="password">Password
                  <span class="text-red-600">*</span></label>
                <input v-model="newUser.password" id="password" type="password" class="form-input w-full"
                  placeholder="Enter your password" required />
              </div>
              <div class="w-full  px-3 mb-4  ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="password2">Re-enter
                  Password <span class="text-red-600">*</span></label>
                <input v-model="newUser.password2" id="password2" type="password" class="form-input w-full"
                  placeholder="Re-enter your password" required />
              </div>
              <div class="w-full px-3 mb-4   ">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="email">Email <span
                    class="text-sm text-gray-500">Optional (but required for password resets)</span></label>
                <input v-model="newUser.email" id="email" type="text" class="form-input w-full"
                  placeholder="Enter your email" required />
              </div>

            </div>

            <div class="flex flex-wrap -mx-3 mb-5">
              <div class="w-full px-3">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="country">What role
                  best describes you? </label>
                <select v-model="newUser.useCase" id="country" class="form-select w-full">
                  <option value="researcher">AI Researcher</option>
                  <option value="digitalWorker">Digital Worker</option>
                  <option value="Student">Student</option>
                  <option value="entrepreneur">Entrepreneur</option>
                  <option value="publicServant">Public Servant</option>
                  <option value="curious">Curious Person</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
            <div class="flex flex-wrap -mx-3 mb-5">
              <div class="w-full px-3">
                <div class="flex justify-between items-center mb-1">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium" for="notes">What kinds of
                    personas will you build?</label>
                  <span class="text-sm text-gray-500">Optional</span>
                </div>
                <textarea v-model="newUser.notes" id="notes" rows="4" class="form-textarea w-full"
                  placeholder="Kind of personas do you want to build?"></textarea>
              </div>
            </div>

            <div class="flex flex-wrap -mx-3 mt-6 ">
              <div class="w-full px-3">
                <button @click="createNewAccount"
                  class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center mb-3">
                  <span>Create Account</span>
                  <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-current"
                      d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                  </svg>
                </button>

                <button @click="resetNewAccount"
                  class="btn text-black bg-yellow-500 hover:bg-teal-400 w-full flex items-center">
                  <span>Clear</span>

                </button>
              </div>
            </div>


          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>
import Header from './../partials/Header.vue'
import PageIllustration from './../partials/PageIllustration.vue'
import Footer from './../partials/Footer.vue'

//Plugins
import { useRouter, useRoute } from 'vue-router'


//Components

//Composables
import { notify } from "notiwind"

import { useAccounts } from '@/composables/useAccounts.js'
const { newAccount, resetNewUser, newUser } = useAccounts()
const router = useRouter()

function createNewAccount() {
  newAccount().then((response) => {
    resetNewUser();
    console.log('response', response)

    // notify({group: "success",title: "Success",text: "Your account was created!"}, 4000) // 4s
    if (response == 'success') {

    }

    // router.push({ name: 'create' })

    //Display a prompt
    if (response == 'usernameExists') {
      // notify({group: "failure",title: "Conflicting Username",text: "That username already exists!"}, 4000) // 4s
      console.log("That username already exists, sorry.")
    }

  }).catch((error) => {
    // notify({group: "failure",title: "Conflicting Username",text: "That username already exists!"}, 4000) // 4s
    console.log("Error identified", error)
  });

}
</script>
