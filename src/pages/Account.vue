<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">
      <div
        class="relative max-w-9xl mx-auto h-0 pointer-events-none -z-1"
        aria-hidden="true"
      ></div>

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-10 md:pt-32 md:pb-10">
            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-6 md:pb-6">
              <h1 class="h1 font-red-hat-display mb-4">Account Details</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">
                Set your Account information.
              </p>
            </div>
          </div>

          <div class="grid grid-cols-2 text-center gap-4 mb-6">
            <div
              class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg"
              data-aos="fade-down"
            >
              <div
                class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"
              >
                {{ account.characterReserve - account.charactersUsed }}
              </div>
              <div class="text-gray-600 dark:text-gray-400">
                Characters Available for Use
              </div>
            </div>

            <div
              class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg"
              data-aos="fade-down"
            >
              <div
                class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"
              >
                {{ displaySubscription(account.subscriptionType) }}
              </div>
              <div class="text-gray-600 dark:text-gray-400">
                Subscription Type
              </div>
            </div>
          </div>

          <form @submit.prevent="createNewAccount" class="flex flex-wrap -mx-3">
            <h3>Account Essentials</h3>
            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="username"
              >
                Username
              </label>
              <input
                v-model="account.username"
                id="username"
                type="text"
                class="form-input w-full"
                placeholder="Enter your username"
                disabled
              />
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="email"
              >
                Email
              </label>
              <input
                v-model="account.email"
                id="email"
                type="text"
                class="form-input w-full"
                placeholder="Enter your email"
              />
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="useCase"
              >
                Use Case
              </label>
              <select
                v-model="account.useCase"
                id="useCase"
                class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
              >
                <option value="researcher">AI Researcher</option>
                <option value="digitalWorker">Digital Worker</option>
                <option value="Student">Student</option>
                <option value="entrepreneur">Entrepreneur</option>
                <option value="publicServant">Public Servant</option>
                <option value="curious">Curious Person</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="notes"
              >
                Notes
              </label>
              <textarea
                v-model="account.notes"
                id="notes"
                rows="4"
                class="form-textarea w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                placeholder="Account notes. Type whatever you like."
              ></textarea>
            </div>

            <p>
              If provided, your API keys will be used to connect to your own
              paid subscriptions, granting you unlimted characters.
            </p>
            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="openAiApiKey"
              >
                OpenAI API Key
              </label>
              <input
                v-model="account.openAiApiKey"
                id="openAiApiKey"
                type="text"
                class="form-input w-full"
                placeholder="Enter your OpenAI API Key"
              />
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="anthropicApiKey"
              >
                Anthropic API Key
              </label>
              <input
                v-model="account.anthropicApiKey"
                id="anthropicApiKey"
                type="text"
                class="form-input w-full"
                placeholder="Enter your Anthropic API Key"
              />
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="azureOpenAiApiKey"
              >
                Azure OpenAI API
              </label>
              <input
                v-model="account.azureOpenAiApiKey"
                id="azureOpenAiApiKey"
                type="text"
                class="form-input w-full"
                placeholder="Enter your Azure OpenAI API Key"
              />
            </div>

            <div class="w-full m-2">
              <label
                class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                for="azureOpenAiEndpoint"
              >
                Azure OpenAI Endpoint
              </label>
              <input
                v-model="account.azureOpenAiApiEndpoint"
                id="azureOpenAiazureOpenAiEndpointApiKey"
                type="text"
                class="form-input w-full"
                placeholder="Enter your Azure OpenAI API Endpoint"
              />
            </div>

            <div class="w-full px-3 mb-4">
              <button
                type="submit"
                class="btn text-white bg-teal-500 hover:bg-teal-400 w-full"
              >
                <span>Update Account</span>
                <svg
                  class="w-3 h-3 fill-current ml-2"
                  viewBox="0 0 12 12"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z"
                  />
                </svg>
              </button>
            </div>
          </form>

          <!-- <p class = "text-red-400">Danger Zone</p> -->
          <div class="w-full mx-auto px-4 pt-4 sm:px-6 relative">
            <p class="text-lg text-red-500">Danger Zone</p>
            <div class="grid grid-cols-2 text-center gap-4 mb-6">
              <div
                class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg"
                data-aos="fade-down"
              >
                <div
                  class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"
                >
                  Delete All Account Data
                </div>
                <div class="text-gray-600 dark:text-gray-400">
                  Remove all the data where you are Owner. <br />Data which
                  others have shared with you will remain.
                </div>

                <button
                  class="btn mt-2 text-white bg-red-500 hover:bg-red-400 w-full"
                >
                  Delete Data
                </button>
              </div>

              <div
                class="bg-white dark:bg-gray-800 py-8 px-4 shadow-lg rounded-lg"
                data-aos="fade-down"
              >
                <div
                  class="font-red-hat-display text-2xl sm:text-3xl font-extrabold tracking-tighter mb-1"
                >
                  Delete Account
                </div>
                <div class="text-gray-600 dark:text-gray-400">
                  Remove your account and all your editor and viewer rights.<br />Data
                  you've created will remain accessible to collaborators.
                </div>

                <button
                  class="btn mt-2 text-white bg-red-500 hover:bg-red-400 w-full"
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import env from "@/env.js";
import { ref, onMounted } from "vue";

import Header from "@/partials/Header.vue";
import Footer from "@/partials/Footer.vue";

import { useAccounts } from "@/composables/useAccounts.js";
const { accountInfo, getOwnAccountInfo } = useAccounts();

onMounted(() => {
  getOwnAccountInfo().then((results) => {
    account.value = accountInfo.value;
  });
});

let account = ref({
  email: "emailAccount",
  notes: "notes",
  openAiApiKey: "openAiApiKey",
  anthropicApiKey: "anthropicApiKey",
  azureOpenAiApiKey: "azureOpenAiApiKey",
  azureOpenAiApiEndpoint: "azureOpenAiApiEndpoint",
});

function displaySubscription(sub) {
  if (sub == null) return "Free";
  if (sub == "free") return "Free";
  return "Subscription";
}
</script>
