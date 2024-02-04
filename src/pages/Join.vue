<template>
  <div
    class="flex flex-col min-h-screen overflow-hidden bg-gray-50 dark:bg-gray-900"
  >
    <!-- Site header -->
    <Header  class="min-h-[100px]"/>

    <!-- Page content -->
    <main class = "grow pt-[100px]">

      <!-- Page illustration -->
      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">
            <!-- Page header -->
            <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
              <h1
                class="text-5xl font-red-hat-display mb-4 font-bold leading-tight"
              >
                Create a mPersona Account
              </h1>
              <p class="text-xl text-gray-600 dark:text-gray-400 mb-4">
                Develop as many private personas as you like.
              </p>
              <p class="text-lg text-gray-600 dark:text-gray-400">
                Currently free to join and use during Alpha testing.
              </p>
            </div>

            <!-- Contact form -->
            <div class="max-w-lg mx-auto">
              <form
                @submit.prevent="createNewAccount"
                class="flex flex-wrap -mx-3"
              >
                <div class="w-full px-3 mb-4">
                  <label
                    class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="username"
                    >Username <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="newUser.username"
                    id="username"
                    type="text"
                    class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your username"
                    required autocomplete="username"
                  />
                </div>
                <div class="w-full px-3 mb-4">
                  <label
                    class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="password"
                    >Password <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="newUser.password"
                    id="password"
                    type="password"
                    class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your password"
                    required autocomplete="new-password"
                  />
                </div>
                <div class="w-full px-3 mb-4">
                  <label
                    class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="password2"
                    >Re-enter Password
                    <span class="text-red-600">*</span></label
                  >
                  <input
                    v-model="newUser.password2"
                    id="password2"
                    type="password"
                    class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Re-enter your password"
                    required autocomplete="new-password"
                  />
                </div>
                <div class="w-full px-3 mb-4">
                  <label
                    class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="email"
                    >Email
                    <span class="text-sm text-gray-500"
                      >Optional (but required for password resets)</span
                    ></label
                  >
                  <input
                    v-model="newUser.email"
                    id="email"
                    type="text"
                    class="form-input w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Enter your email"
                  />
                </div>
                <div class="w-full px-3 mb-4">
                  <label
                    class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1"
                    for="country"
                    >What role best describes you?</label
                  >
                  <select
                    v-model="newUser.useCase"
                    id="country"
                    class="form-select w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
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
                <div class="w-full px-3 mb-4">
                  <div class="flex justify-between items-center mb-1">
                    <label
                      class="block text-gray-800 dark:text-gray-300 text-sm font-medium"
                      for="notes"
                      >What kinds of personas will you build?</label
                    >
                    <span class="text-sm text-gray-500">Optional</span>
                  </div>
                  <textarea
                    v-model="newUser.notes"
                    id="notes"
                    rows="4"
                    class="form-textarea w-full text-gray-800 dark:text-gray-300 dark:bg-gray-700 dark:border-gray-600"
                    placeholder="Kind of personas do you want to build?"
                  ></textarea>
                </div>
                <div class="w-full px-3 mb-4">
                  <button
                    type="submit"
                    class="btn text-white bg-teal-500 hover:bg-teal-400 w-full"
                  >
                    <span>Create Account</span>
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
                <div class="w-full px-3">
                  <button
                    type="button"
                    @click="resetNewAccount"
                    class="btn text-white bg-yellow-500 hover:bg-yellow-400 w-full"
                  >
                    <span>Clear</span>
                  </button>
                </div>
              </form>
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
import Header from "@/partials/Header.vue";
import Footer from "@/partials/Footer.vue";
import { useAccounts } from "@/composables/useAccounts.js";
import { notify } from "notiwind";

const { newAccount, resetNewUser, newUser } = useAccounts();

function createNewAccount() {
  newAccount()
    .then((response) => {
      resetNewUser();
      if (response === "success") {
        notify(
          {
            group: "success",
            title: "Success",
            text: "Your account was created!",
          },
          4000
        );
        // router.push({ name: 'dashboard' }); // Uncomment and update with actual route name if needed
      } else if (response === "usernameExists") {
        notify(
          {
            group: "failure",
            title: "Conflicting Username",
            text: "That username already exists!",
          },
          4000
        );
      }
    })
    .catch((error) => {
      console.error("Error identified", error);
      notify(
        {
          group: "failure",
          title: "Error",
          text: "An error occurred. Please try again.",
        },
        4000
      );
    });
}

function resetNewAccount() {
  resetNewUser();
}
</script>

<style>
/* Add your custom styles here */
.form-input,
.form-select,
.form-textarea {
  border: 1px solid #e2e8f0;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #93c5fd;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  transition: background-color 0.3s ease;
}

.btn:hover {
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}
</style>
