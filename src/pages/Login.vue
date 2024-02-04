<template>
  <div class="flex flex-col min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">

    <!-- Site header -->
    <Header  class="min-h-[100px]"/>

    <!-- Page content -->
    <main class = "grow pt-[100px]">

      <section class="relative">
        <div class="w-auto mx-auto px-4 sm:px-6">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <!-- Page header -->
            <div class="w-auto mx-auto text-center pb-12 md:pb-16">
              <h1 class="text-5xl font-red-hat-display mb-4 font-bold leading-tight">Login to mPersona</h1>
              <p class="text-xl text-gray-600 dark:text-gray-400">Manage your private personas.</p>
            </div>

            <!-- Contact form -->
            <div class="max-w-sm mx-auto">
              <div class="flex flex-wrap -mx-3 mb-4">
                <div class="w-full px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="username">Username <span class="text-red-600">*</span></label>
                  <input v-model="username" id="username" type="text" class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600" placeholder="Enter your username" required />
                </div>
              </div>
              <div class="flex flex-wrap -mx-3 mb-4">
                <div class="w-full px-3">
                  <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="password">Password <span class="text-red-600">*</span></label>
                  <input v-model="password" id="password" type="password" class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600" placeholder="Enter your password" required @keyup.enter="doLogin" />
                </div>
              </div>
              <div class="flex flex-wrap -mx-3 mt-6">
                <div class="w-full px-3">
                  <button @click="doLogin" class="btn text-white bg-teal-500 hover:bg-teal-400 w-full">
                    <span>Login</span>
                    <svg class="w-3 h-3 fill-current ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                    </svg>
                  </button>
                </div>
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
import { ref, onMounted } from 'vue';
import Header from '@/partials/Header.vue';
import { useRouter } from 'vue-router';
import { useAccounts } from '@/composables/useAccounts.js';
import { useTokens } from '@/composables/useTokens.js';
import { notify } from "notiwind";

const { login } = useAccounts();
const { unsetTokens } = useTokens();
const router = useRouter();
const username = ref('');
const password = ref('');

onMounted(() => {
  unsetTokens();
});

function doLogin() {
  login(username.value, password.value).then(() => {
    notify({ group: "success", title: "Success", text: "Login successful" }, 4000);
    router.push({ name: 'home' });
  }).catch((error) => {
    console.error("Error identified", error);
    notify({ group: "failure", title: "Error", text: "Login unsuccessful. Please try again." }, 4000);
  });
}
</script>

<style>
/* Add your custom styles here */
.form-input {
  border: 1px solid #E2E8F0;
  transition: border-color .3s ease;
}

.form-input:focus {
  outline: none;
  border-color: #93C5FD;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color .3s ease;
}

.btn:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, .1);
}
</style>