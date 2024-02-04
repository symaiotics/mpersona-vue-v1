<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">



      <!-- Page illustration -->
      

      <section class="relative">

        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">



            <template v-if="!selectedPersona">
              <Personas />

            </template>
            <template v-if="selectedPersona">
              <div class="flex mb-4 relative">

                <!-- Left -->
                <div class="w-1/2">
                  <!-- Page header -->



                  <div class="max-w-3xl mx-auto text-center  ">


                    <h2 class="h2 font-red-hat-display mb-4">Interact</h2>
                    <p class="text-xl text-gray-600 dark:text-gray-400">Begin chatting with {{
                      selectedPersona?.name }} </p>
                  </div>

                  <div class="flex flex-wrap -mx-3">
                    <div class="w-full px-3 m-6">
                      <div class="flex justify-between items-center mb-1">
                      </div>

                      <textarea v-model="userPrompt" id="response" rows="8" class="form-textarea w-full mb-2"
                        placeholder="Enter your prompts here"></textarea>

                      <p> Below are your Persona instructions. Refine them to meet your needs.</p>
                      <textarea v-model="selectedPersona.basePrompt" id="response" rows="4" class="form-textarea w-full"
                        placeholder="User the instructions"></textarea>

                      <p>Select your model</p>
                      <select v-model="selectedModel" id="model" class="form-select w-full" required>
                        <option v-for="(model, index) in adminModels" :key="'model' + index" :value="model">{{
                          model.label }}
                        </option>
                      </select>

                      <div>You've used {{ tokens }} tokens out of a maximum {{
                        parseInt(selectedModel.maxTokens / 4 * 3) }} </div>

                      <div class="w-full">
                        <button @click="doPrompt"
                          class="btn text-black bg-teal-500 hover:bg-teal-400 w-full flex items-center mt-3">
                          <span>Prompt</span>
                          <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                            <path class="fill-current"
                              d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                          </svg>
                        </button>



                        <button @click="updatePersona"
                          class="btn text-black bg-blue-500 hover:bg-teal-400 w-full flex items-center mt-3">
                          <span>Save Changes to Persona</span>

                        </button>



                        <button @click="reset"
                          class="btn text-black bg-yellow-500 hover:bg-teal-400 w-full flex items-center mt-3">
                          <span>Reset</span>

                        </button>


                      </div>



                    </div>
                  </div>


                </div>

                <!-- Right -->
                <div class="w-1/2">
                  <!-- Page header -->
                  <div class="max-w-3xl mx-auto text-center">
                    <h2 class="h2 font-red-hat-display mb-4">Results</h2>
                    <p class="text-xl text-gray-600 dark:text-gray-400">Status: {{ status }}<b></b></p>

                    <!-- <p class="text-xl text-gray-600 dark:text-gray-400">Interact with your Persona</p> -->
                  </div>

                  <div class="flex flex-wrap -mx-3">
                    <div class="w-full px-3 m-6">
                      <div class="flex justify-between items-center mb-1">
                      </div>
                      <div v-html="promptResponse" class=" w-full form-textarea w-full" style="min-height:200px;"></div>

{{ extractedJSON }}

                      <template v-if="promptResponseCode && promptResponseCode.length">
                        <br />
                        <p>Segements of code (if provided) are identified below:</p>
                        <template v-for="code in promptResponseCode">

                          <HTMLContent :html="code.code" />

                          <!-- <div v-html="code.code" class=" w-full form-textarea w-full" style="min-height:200px;"> -->
                          <!-- </div> -->
                        </template>


                      </template>
                      <!-- <D3GC title="Results Graph" :darkMode="false" :nodesSource = "graphData.nodes" :linksSource = "graphData.links" /> -->

                    </div>
                  </div>


                </div>


              </div>

            </template>

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



import Header from '@/partials/Header.vue'
import Footer from '@/partials/Footer.vue'
import Personas from '@/partials/Personas.vue'
import HTMLContent from '@/components/HTMLContent.vue'


import { useModels } from '@/composables/useModels.js'
import { usePrompts } from '@/composables/usePrompts.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useCategories } from '@/composables/useCategories.js'
const { personas, selectedPersona, usedCategories, skills, getPersonas, getSkills, getUsedCategories, updatePersonas } = usePersonas()
const { categories, selectedCategory, getCategories } = useCategories()

const { promptOpenAI, promptResponse, promptResponseCode } = usePrompts()
const { adminModels, selectedModel } = useModels()

let userPrompt = ref("");
let status = ref("Waiting");
let tokens = computed(() => {
  return parseInt((userPrompt.value.length + selectedPersona.value.basePrompt.length) / 4)
});

let graphData =

{
  "type": "networkGraph",
  "nodes": [
    {
      "id": "timothy-overturf",
      "name": {
        "en": "Timothy Overturf",
        "fr": "Timothy Overturf"
      },
      "group": 1,
      "radius": 30
    },
    {
      "id": "sisu-capital",
      "name": {
        "en": "Sisu Capital, LLC",
        "fr": "Sisu Capital, LLC"
      },
      "group": 2,
      "radius": 30
    },
    {
      "id": "hans-overturf",
      "name": {
        "en": "Hansueli 'Hans' Overturf",
        "fr": "Hansueli 'Hans' Overturf"
      },
      "group": 3,
      "radius": 30
    },
    {
      "id": "sec",
      "name": {
        "en": "Securities and Exchange Commission",
        "fr": "Commission des valeurs mobilières et des changes"
      },
      "group": 4,
      "radius": 30
    },
    {
      "id": "alice-liu-jensen",
      "name": {
        "en": "Alice Liu Jensen",
        "fr": "Alice Liu Jensen"
      },
      "group": 5,
      "radius": 30
    },
    {
      "id": "rahul-kolhatkar",
      "name": {
        "en": "Rahul Kolhatkar",
        "fr": "Rahul Kolhatkar"
      },
      "group": 5,
      "radius": 30
    },
    {
      "id": "joseph-sansone",
      "name": {
        "en": "Joseph Sansone",
        "fr": "Joseph Sansone"
      },
      "group": 5,
      "radius": 30
    },
    {
      "id": "john-han",
      "name": {
        "en": "John Han",
        "fr": "John Han"
      },
      "group": 5,
      "radius": 30
    }
  ],
  "links": [
    {
      "source": "timothy-overturf",
      "target": "sisu-capital",
      "value": 1,
      "type": {
        "en": "Owner of",
        "fr": "Propriétaire de"
      }
    },
    {
      "source": "hans-overturf",
      "target": "timothy-overturf",
      "value": 1,
      "type": {
        "en": "Father of",
        "fr": "Père de"
      }
    },
    {
      "source": "sec",
      "target": "timothy-overturf",
      "value": 1,
      "type": {
        "en": "Charged",
        "fr": "Inculpé"
      }
    },
    {
      "source": "sec",
      "target": "sisu-capital",
      "value": 1,
      "type": {
        "en": "Charged",
        "fr": "Inculpé"
      }
    },
    {
      "source": "sec",
      "target": "hans-overturf",
      "value": 1,
      "type": {
        "en": "Charged",
        "fr": "Inculpé"
      }
    },
    {
      "source": "alice-liu-jensen",
      "target": "sec",
      "value": 1,
      "type": {
        "en": "Investigator for",
        "fr": "Enquêteur pour"
      }
    },
    {
      "source": "rahul-kolhatkar",
      "target": "sec",
      "value": 1,
      "type": {
        "en": "Supervisor for",
        "fr": "Superviseur pour"
      }
    },
    {
      "source": "joseph-sansone",
      "target": "sec",
      "value": 1,
      "type": {
        "en": "Chief of Enforcement Division for",
        "fr": "Chef de la Division de l'application pour"
      }
    },
    {
      "source": "john-han",
      "target": "sec",
      "value": 1,
      "type": {
        "en": "Litigator for",
        "fr": "Avocat pour"
      }
    }
  ]
}



onMounted(() => {
  //Personas
  getPersonas();

  //Categories
  getUsedCategories();
  // websocketConnection();

})


function doPrompt() {

  try {
    promptResponse.value = null;
    promptResponseCode.value = null;
    status.value = "Processing";
    promptOpenAI(selectedModel.value, userPrompt.value, selectedPersona.value.basePrompt).then((response) => {
      status.value = "Waiting"
    }).catch((error) => {
      console.log("Error completing prompt", error)
    })
  }
  catch (error) {
    console.log('Error', error)
  }

}

function updatePersona() {
  if (selectedPersona.value) {
    updatePersonas([selectedPersona.value])
  }
}

function reset() {
  selectedPersona.value = null;
}


let extractedJSON = computed(() => {

  var text = promptResponse.value;

  const validJSONs = [];
    
    let startIdx = text.indexOf('{');
    while (startIdx !== -1) {
        let endIdx = startIdx;
        let braceCount = 1;

        while (endIdx < text.length && braceCount > 0) {
            endIdx++;
            if (text[endIdx] === '{') {
                braceCount++;
            } else if (text[endIdx] === '}') {
                braceCount--;
            }
        }

        const potentialJSON = text.substring(startIdx, endIdx + 1);
        try {
            const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
            const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
            const parsed = JSON.parse(replacedString);
            validJSONs.push(parsed);
        } catch (e) {
            // Not valid JSON, skip
        }

        startIdx = text.indexOf('{', startIdx + 1);
    }

    return validJSONs;

  // const potentialJSONs = [];
  //   // const regex = /(\{[\s\S]*?\})(?![\s\S]*\{[\s\S]*?\})/g;  // Look for JSON-like substrings
  //   const regex = /(\{[\s\S]*?\}(?=\s|$))/g;  // Look for JSON-like substrings, adjusting the regex to capture the closing characters

  //   let match;
  //   while (match = regex.exec(text)) {
  //     console.log("match1", match)
  //       potentialJSONs.push(match[1]);
  //   }

  //   const validJSONs = [];
  //   potentialJSONs.forEach(jsonString => {
  //       try {
  //           // Remove <br/> tags and newline characters
  //           const sanitizedString = jsonString.replace(/<br\/?>/g, '').replace(/\n/g, ' ');

  //           // Replace single quotes around keys to double quotes
  //           const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
  //           console.log("replacedString 2", replacedString)
  //           const parsed = JSON.parse(replacedString);
  //           validJSONs.push(parsed);
  //       } catch (e) {
  //         console.log("e", e)
  //           // Not valid JSON, skip
  //       }
  //   });

  //   return validJSONs;
})


</script>
