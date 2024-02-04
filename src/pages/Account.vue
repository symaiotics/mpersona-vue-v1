<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <!-- Site header -->
    <Header  />

    <!-- Page content -->
    <main class = "grow ">

      <div
        class="relative max-w-9xl mx-auto h-0 pointer-events-none -z-1"
        aria-hidden="true"
      >
      </div>

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">
            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-6 md:pb-6">
              <h1 class="h1 font-red-hat-display mb-4">Account Details</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">
                Set your Account information.
              </p>
            </div>
          </div>


          <h3>Tokens</h3>
Free tokens used<br/>
free tokens remaining<br/>
BYOK tokens used<br/>


          <h3>Account Infomation</h3>
          <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="email">
                   Email
                    <span class="text-red-600">*</span>
                </label>
                <input v-model="account.email" id="email" type="text" class="form-input w-full"
                    placeholder="Enter your email" required />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="notes">
                   Notes
                </label>
                <input v-model="account.notes" id="notes" type="text" class="form-input w-full"
                    placeholder="Your account notes" required />
            </div>

 
    <hr class = "p-3"/>

        <h3>API Keys</h3>
            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="openAiApiKey">
                   OpenAI API Key
                </label>
                <input v-model="account.openAiApiKey" id="openAiApiKey" type="text" class="form-input w-full"
                    placeholder="Enter your OpenAI API Key"  />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="anthropicApiKey">
                   Anthropic API Key
                </label>
                <input v-model="account.anthropicApiKey" id="anthropicApiKey" type="text" class="form-input w-full"
                    placeholder="Enter your Anthropic API Key"  />
            </div>


            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="azureOpenAiApiKey">
                   Azure OpenAI API
                </label>
                <input v-model="account.azureOpenAiApiKey" id="azureOpenAiApiKey" type="text" class="form-input w-full"
                    placeholder="Enter your Azure OpenAI API Key"  />
            </div>

            <div class="w-full m-2">
                <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="azureOpenAiEndpoint">
                   Azure OpenAI Endpoint
                </label>
                <input v-model="account.azureOpenAiApiEndpoint" id="azureOpenAiazureOpenAiEndpointApiKey" type="text" class="form-input w-full"
                    placeholder="Enter your Azure OpenAI API Endpoint"  />
            </div>




        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import env from "@/env.js"
import { ref, onMounted } from 'vue';

import Header from "@/partials/Header.vue";
import Footer from "@/partials/Footer.vue";

let account = ref({
    email:"emailAccount",
    notes:"notes",
 
    openAiApiKey:"openAiApiKey",
    anthropicApiKey:"anthropicApiKey",
    azureOpenAiApiKey:"azureOpenAiApiKey",
    azureOpenAiApiEndpoint:"azureOpenAiApiEndpoint",
 
})

</script>
