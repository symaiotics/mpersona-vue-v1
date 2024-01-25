<template>
  <section class="relative border-t border-transparent dark:border-gray-800">
    <!-- Background gradient (dark version only) -->
    <div
      class="absolute inset-0 opacity-25 bg-gradient-to-b from-gray-800 to-gray-900 pointer-events-none hidden dark:block"
      aria-hidden="true"></div>
    <!-- End background gradient (dark version only) -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-4">

        <div data-aos="fade-up" data-aos-delay="450">
          <!-- Category buttons -->
          <div class="mb-10">
            <div class="flex flex-wrap justify-center -m-1">

              <button
  class="font-medium px-4 py-2  bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow transition duration-150 ease-in-out rounded-full inline-flex items-center justify-center m-1"
  :class="{ 'bg-teal-500 hover:bg-teal-500 dark:bg-teal-600 dark:hover:bg-teal-600 dark:bg-opacity-25 dark:hover:bg-opacity-25': category === 'questions' }"
  @click="category = 'questions'">
  <svg class="w-4 h-4 shrink-0 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
    <path class="fill-current"
      :class="category === 'questions' ? 'text-gray-800 dark:text-teal-400' : 'text-teal-500'"
      d="M5 16H4a4 4 0 01-4-4v-1h2v1a2 2 0 002 2h1v2zM13 10h-1.686l-1.207-1.207L14.37 4.63a2.121 2.121 0 00-3-3L7.207 5.793 5.99 4.576 5.98 3.02 3.038.079 0 3.117 3 6h1.586l1.207 1.207L4 9l3 3 1.793-1.793L10 11.414V13l3.01 3.01 2.98-2.979L13 10z" />
  </svg>
  <span class="transition duration-150 ease-in-out text-black dark:text-white">Related
    Questions</span>
</button>


              <button
                class="font-medium px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow transition duration-150 ease-in-out rounded-full inline-flex items-center justify-center m-1"
                :class="{ 'bg-purple-500 hover:bg-purple-500 dark:bg-purple-600 dark:hover:bg-purple-600 dark:bg-opacity-25 dark:hover:bg-opacity-25': category === 'facts' }"
                @click="category = 'facts'">
                <svg class="w-4 h-4 shrink-0 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path class="fill-current"
                    :class="category === 'facts' ? 'text-purple-200 dark:text-purple-400' : 'text-purple-500'"
                    d="M12.071 0L15 2.929v4.142L12.071 10H12V7.101L7.9 3H5v-.071L7.929 0h4.142zm-5 5L10 7.929v4.142L7.071 15H2.929L0 12.071V7.929L2.929 5h4.142z" />
                </svg>
                <span class="transition duration-150 ease-in-out text-black dark:text-white">Facts</span>
              </button>


              <button
                class="font-medium px-4 py-2 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 shadow transition duration-150 ease-in-out rounded-full inline-flex items-center justify-center m-1"
                :class="{ 'bg-indigo-500 hover:bg-indigo-500 dark:bg-indigo-600 dark:hover:bg-indigo-600 dark:bg-opacity-25 dark:hover:bg-opacity-25': category === 'resources' }"
                @click="category = 'resources'">
                <svg class="w-4 h-4 shrink-0 mr-2" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path class="fill-current"
                    :class="category === 'resources' ? 'text-indigo-200 dark:text-indigo-400' : 'text-indigo-500'"
                    d="M1 0h8a1 1 0 011 1v10a1 1 0 01-1 1H1a1 1 0 01-1-1V1a1 1 0 011-1zm14.124 4.085v-.001a1 1 0 01.868 1.116l-1.243 9.932a1 1 0 01-1.117.868l-7.938-1 .248-1.988 6.946.871.995-7.938-2.007-.251.248-1.984 3 .375z" />
                </svg>
                <span class="transition duration-150 ease-in-out text-black dark:text-white">Resources</span>
              </button>

            </div>
          </div>

          <div class="-mb-2">

            <!-- Questions -->
            <article class="mb-2" v-show="category == 'questions' && listQuestions?.[0]?.question">
              <template v-for="(questionSet, index) in listQuestions" :key="'questionSet' + index">
                <div v-if="index == 0" v-for="(question, index2) in questionSet.question" :key="'question' + index2"
                  class="flex pr-6 py-5 bg-white dark:bg-gray-800 divide-x divide-gray-200 dark:divide-gray-700 shadow-2xl">

                  <!-- Category icon -->
                  <div class="flex items-center px-4 sm:px-8">
                    <svg class="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                      <circle class="fill-current text-teal-100 dark:hidden" cx="16" cy="16" r="16" />
                      <path class="fill-current text-teal-500"
                        d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" />
                    </svg>
                  </div>

                  <!-- Content -->
                  <div class="pl-6">
                    <header>
                      <h3 class="font-red-hat-display text-xl font-black tracking-tighter mb-1">
                        <a @click.prevent="promptQuestion(question)" href="">{{ question }}</a>
                      </h3>
                    </header>
                    <!-- <p class="text-gray-600 dark:text-gray-400">
                    {{ question }}
                  </p> -->
                    <a @click.prevent="promptQuestion(question)"
                      class="inline-flex items-center font-medium text-teal-500 hover:underline mt-2" href="">
                      <span>Ask</span>
                      <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                          d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                      </svg>
                    </a>
                  </div>
                </div>
              </template>
            </article>



            <!-- Facts -->
            <article class="mb-2" v-show="category == 'facts'">


              <div v-for="(fact, index) in listFacts" :key="'fact' + index"
                class="flex pr-6 py-5 bg-white dark:bg-gray-800 divide-x divide-gray-200 dark:divide-gray-700 shadow-2xl">



                <!-- Category icon -->
                <div class="flex items-center px-4 sm:px-8">
                  <svg class="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle class="fill-current text-teal-100 dark:hidden" cx="16" cy="16" r="16" />
                    <path class="fill-current text-teal-500"
                      d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="pl-6">
                  <p class="text-m font-black  mb-1">
                    {{ fact }}
                  </p>
                </div>
                <!-- <p class="text-gray-600 dark:text-gray-400">
                    {{ question }}
                  </p> -->

              </div>

              <!-- {{ listFacts }} -->
            </article>


            <!-- References -->
            <article class="mb-2" v-show="category == 'resources'">


              <div v-for="(resource, index) in listResources" :key="'fact' + index"
                class="flex pr-6 py-5 bg-white dark:bg-gray-800 divide-x divide-gray-200 dark:divide-gray-700 shadow-2xl">



                <!-- Category icon -->
                <div class="flex items-center px-4 sm:px-8">
                  <svg class="w-8 h-8" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
                    <circle class="fill-current text-teal-100 dark:hidden" cx="16" cy="16" r="16" />
                    <path class="fill-current text-teal-500"
                      d="M19 18.414l-4 4L9.586 17l.707-.707L12 14.586V8.414l-5-5L4.414 6l6.293 6.293-1.414 1.414L1.586 6 7 .586l7 7v5l8.463-8.463a3.828 3.828 0 115.414 5.414L21 16.414v6.172l5 5L28.586 25l-6.293-6.293 1.414-1.414L31.414 25 26 30.414l-7-7v-5zm-4 1.172L26.463 8.123a1.828 1.828 0 10-2.586-2.586L12.414 17 15 19.586zM11 30v2C4.925 32 0 27.075 0 21h2a9 9 0 009 9zm0-5v2a6 6 0 01-6-6h2a4 4 0 004 4z" />
                  </svg>
                </div>

                <!-- Content -->
                <div class="pl-6">
                  <p class="text-m font-black  mb-1">
                    <a :href="formatUrl(resource.storageUrl)" target="_blank">{{ resource.storageUrl }}
                    </a>
                  </p>
                </div>
                <!-- <p class="text-gray-600 dark:text-gray-400">
                    {{ question }}
                  </p> -->

              </div>

              <!-- {{ listResources }} -->
            </article>


          </div>


        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import env from "@/env.js"

import { ref, onMounted, computed } from 'vue';

let category = ref('questions')
let props = defineProps({ facts: { type: Array, default: [] } })
let emit = defineEmits(['promptQuestion'])

let facts = computed(() => { return props.facts })

let listQuestions = computed(() => {
  if (facts?.value) {
    return facts.value.flatMap((obj) => { return { question: obj.questions, score: obj.score } });
  }
})

let listFacts = computed(() => {
  if (facts?.value) return facts.value.map(obj => obj.fact).flat();
})

let listResources = computed(() => {

  let resources = [];
  if (facts?.value?.length) {
    facts.value.forEach((fact) => {
      let resIndex = resources.findIndex((resource) => { return resource.storageUrl == fact.storageUrl })
      if (resIndex > -1) resources[resIndex].score += fact.score;
      else resources.push({ storageUrl: fact.storageUrl, score: fact.score })
    })
  }
  return resources;

})

function formatUrl(url)
{
//return  env.STORAGE_URL + "/" + url;
return `https://docs.google.com/viewer?url=${env.STORAGE_URL + "/" + url}&embedded=true`
}

function promptQuestion(question) {
  emit("promptQuestion", question)
}

</script>