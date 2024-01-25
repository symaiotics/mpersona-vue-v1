<template>
  <section class="relative border-t border-transparent dark:border-gray-800">
    <!-- Background gradient -->
    <div
      class="absolute inset-0 h-128 dark:opacity-25 bg-gradient-to-b from-gray-100 to-white dark:from-gray-800 dark:to-gray-900 pointer-events-none"
      aria-hidden="true"></div>
    <!-- End background gradient -->
    <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
      <div class="py-12 md:py-20">

        <!-- Section header -->
        <div class="max-w-3xl mx-auto text-center pb-12 md:pb-16">
          <h2 class="h2 font-red-hat-display mb-4">Interact with Personas</h2>
          <p class="text-xl text-gray-600 dark:text-gray-400">Select from our ever-growing library of digital personas to
            guide your AI interactions.</p>
        </div>

        <!-- Section content -->
        <div>
          <div class="grid lg:grid-cols-3 gap-12 lg:gap-6">

          

            <!-- Videos -->
            <div class="lg:col-span-3 max-w-sm mx-auto md:max-w-3xl lg:max-w-none">
              <div class="grid md:grid-cols-3 gap-6">


                <!-- {{ filteredPersonas }} -->
                <div v-for="(persona, index) in filteredPersonas" :key="'persona' + index" class="relative">
                  <div @click="selectAndInteract(persona)">
                    <img class="w-full" :src="persona.url || defaultImage" width="352" height="264"
                      alt="Persona thumbnail" />
                  </div>
                  <div @click.stop="selectAndInteract(persona)" class="px-6 py-3 bg-white dark:bg-gray-900 flex flex-col items-start">
                    <div class="mb-2">
                      <div class="font-bold">{{ persona.name }}</div>
                      <div>{{ persona.description.en }}</div>
                    </div>
                    <button 
                      class="px-3 py-1 text-xs font-medium text-white bg-gray-900 dark:bg-teal-600 rounded-full hover:opacity-75 transition duration-150 ease-in-out">
                      Select
                    </button>
                  </div>
                </div>

                <!-- 
                <div v-show="['1'].includes(category)">
                  <div class="relative">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Using index pages</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">2 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['1', '2'].includes(category)">
                  <div class="relative flex justify-center items-center">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Working with content</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">4 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['1', '3'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Using cover pages</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">7 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['1', '4'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Intro to the style model</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">9 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['2', '5'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Exploring collections</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">12 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['2', '3'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Understand hierarchy</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">3 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['2', '4'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Customisations</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">11 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['3', '5'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Image galleries</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">6 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['5'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Sorting images</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">4 Min</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div v-show="['5'].includes(category)">
                  <div class="relative flex justify-center items-center shadow">
                    <img class="w-full" src="../images/video-thumb.jpg" width="352" height="264" alt="Video thumbnail 01" />
                    <div class="absolute inset-0 flex flex-col">
                      <div class="grow flex justify-center items-center">
                        <a class="hover:opacity-75 transition duration-150 ease-in-out" href="#0">
                          <img src="../images/play-button.svg" width="72" height="72" alt="Play icon" />
                        </a>
                      </div>
                      <div class="w-full bottom-0 px-6 py-3 bg-white opacity-90 dark:bg-gray-900 flex justify-between items-center">
                        <a class="text-gray-900 dark:text-gray-400 font-medium" href="#0">Filters</a>
                        <div class="inline-flex px-3 py-1 text-xs font-medium text-white bg-gray-900 bg-opacity-50 dark:text-teal-400 dark:bg-teal-600 dark:bg-opacity-25 rounded-full">9 Min</div>
                      </div>
                    </div>
                  </div>
                </div> -->




              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import defaultImage from "../images/persona1.png"
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories } = usePersonas()
const { categories, selectedCategory, getCategories } = useCategories()


let filteredPersonas = computed(() => {

  let filteredPersonas = personas.value;
  if (selectedCategory.value) {
    filteredPersonas = personas.value.filter(persona => {
      return persona.categories.some(category => {
        return category.code === selectedCategory.value.code;
      });
    });
  }

  return filteredPersonas;


})

const router = useRouter()
const route = useRoute()


function selectCategory(category) {
  selectedCategory.value = category;
}

function selectAndInteract(persona) {
  selectedPersona.value = persona;
  console.log("Selected Persona", persona)
  router.push({ name: 'chat', params: { personaId: persona.uuid } })

}


</script>