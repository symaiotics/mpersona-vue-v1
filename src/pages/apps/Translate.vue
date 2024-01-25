<template>
  <div class="bg-gray-100 min-h-screen lg:p-2">
    <div class=" mx-auto bg-white lg:p-8 rounded shadow-lg">

      <!-- Top Header -->
      <div class="bg-white">
        <div class="flex justify-between items-center pl-2  border-b border-gray-300 pb-2">
          <a href="https://mpersona.com">
            <div v-if="selectedRoster" class="flex items-center">
              <img v-if="selectedRoster && selectedRoster?.url?.length" :src="selectedRoster.url" alt="Brand Logo"
                class="w-auto h-24 mr-4">
              <img v-else :src="canada" alt="Canada Flag" class="w-64  mr-4">
            </div>
          </a>
          <!-- <span>Français</span> -->
        </div>
      </div>

      <div class="flex flex-box w-full justify-center ">
        <section class="w-10/12">
          <h1 v-if="selectedRoster" id="wb-cont"
            class="font-lato font-bold text-3xl mt-10 mb-1 pb-1 border-b border-red-600 leading-tight">
            {{ selectedRoster.name }} </h1>

          <section class="mb-2">
            <p v-if="selectedRoster" id="wb-cont" class="font-lato text-1xl.5 mt-1 mb-1 pb-1 ">
              {{ selectedRoster.description.en }}
            </p>
          </section>
        </section>
      </div>

      <div class="flex justify-center ">
        <div class=" w-full">
          <section class="mb-6 w-full">
            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>
                <div v-if="selectedRoster">
                  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <template v-for="(persona, index) in selectedRoster.personas" :key="persona.uuid">
                      <div class="pl-6 pr-6">
                        <DisplayPersona @click="selectPersona(persona, index)" :persona="persona" alignment="center" />
                      </div>
                    </template>
                  </div>
                </div>
              </template>

              <template v-slot:tab-1>

                <!-- Left Column (Skinny) - Aligned to Bottom -->
                <!-- <div v-if="selectedRoster?.personas" class="col-span-1 flex flex-col justify-end">
                  <DisplayPersonaStack :personas="selectedRoster.personas" :selectedPersonaIndex="selectedPersonaIndex"
                    @selectPersona="selectPersona" />
                </div> -->

                <div class="flex items-center mb-2 space-x-2">

                  <button @click="trigger"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Translate
                  </button>

                  <div style="max-width:300px">
                    <VueMultiselect v-model="selectedLng" :options="lngs" :searchable="true" :close-on-select="true"
                      :preselect-first="true" :custom-label="customLng" :show-labels="false"
                      placeholder="Select a language" />
                  </div>


                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.asPlainText" class="mr-1 checkbox-large" />
                    Paste Plain Text
                  </label>

                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.useLexicon" class="mr-1 checkbox-large" />
                    Use Lexicon
                  </label>

                  <!-- <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.display.showLexicon" class="mr-1 checkbox-large" />
                    Show Lexicon
                  </label> -->
                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.showPrompt" class="mr-1 checkbox-large" />
                    Show Prompt
                  </label>

                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.display.showReference" class="mr-1 checkbox-large" />
                    Show Reference
                  </label>

                  <button @click="toLocalLexicon('en')"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    + EN
                  </button>

                  <button @click="toLocalLexicon('fr')"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    + FR
                  </button>


                </div>


                <div :class="`grid gap-2 h-full sm:grid-cols-1 md:grid-cols-${2 + showColsCount}`">


                  <div>

                    <!-- <textarea ref="textarea" @keyup.enter="event => { if (!event.shiftKey) trigger() }"
                        v-model="chatPrompt" @input="adjustHeight" class="form-input w-full pl-12"
                        placeholder="Enter text to translate... / Saisissez le texte à traduire..."
                        aria-label="Search anything" /> -->


                    <DivInput placeholder="Enter text to translate... / Saisissez le texte à traduire..."
                      v-model="chatPrompt" :asPlainText="settings.asPlainText" />


                    <!-- {{ chatPrompt }} -->
                    <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                      :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                      placeholder="Pick a model" />

                    <div v-if="selectedPersona">
                      <!-- <p class="italic pt-2 mb-0 pb-1">{{ selectedPersona.name }}</p> -->
                      <p class="italic pt-0">Cost per Interaction / Coût d'interaction: ${{
                        costOfInteraction().toFixed(3) }}</p>
                    </div>

                    <div v-if="settings.showPrompt">
                      Full prompt to LLM:<br />

                      <DivInput placeholder="Full prompt preview" v-model="chatPromptWithLexicon"
                        :asPlainText="settings.asPlainText" />


                    </div>
                  </div>


                  <div v-if="selectedPersona">
                    <Socket :key="selectedPersona.uuid" :persona="selectedPersona" :userPrompt="chatPromptWithLexicon"
                      :model="selectedModel" :trigger="triggerGenerate" @messageComplete="messageComplete"
                      @messagePartial="messagePartial">
                      <!-- <ChatWindow :messages="messageHistory" /> -->

                      <DivInput placeholder="Persona response..." v-model="latestMessage"
                        :asPlainText="settings.asPlainText" />



                      <!-- <DivInput v-if = "messageHistory.length" v-model="messageHistory[messageHistory.length-1]" :asPlainText="settings.asPlainText" /> -->

                    </Socket>

                  </div>

                  <div v-if="settings.display.showReference">

                    <DivInput placeholder="Text to compare / Texte à comparer" v-model="referenceText"
                      :asPlainText="settings.asPlainText" />

                  </div>


                </div>

              </template>


              <template v-slot:tab-2>



                <div class="flex items-center mb-2 space-x-2">


                  <button @click="translateFormatted"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Translate with Formats
                  </button>
                  <button @click="copyTranslated"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Copy
                  </button>

                  <div style="max-width:300px">
                    <VueMultiselect v-model="selectedLng" :options="lngs" :searchable="true" :close-on-select="true"
                      :preselect-first="true" :custom-label="customLng" :show-labels="false"
                      placeholder="Select a language" />
                  </div>

                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.useLexicon" class="mr-1 checkbox-large" />
                    Use Lexicon
                  </label>

                  <label class="label-style whitespace-nowrap">
                    <input type="checkbox" v-model="settings.showPrompt" class="mr-1 checkbox-large" />
                    Show Prompt
                  </label>

                  
                </div>

                <div :class="`grid gap-2 h-full sm:grid-cols-1 md:grid-cols-4`">



                  <div class="col-span-3 flex-grow">

        
                    <DivInput ref="chatPromptFormattedDom"
                      placeholder="Enter text to translate... / Saisissez le texte à traduire..."
                      v-model="chatPromptFormatted" @selectionChange="formattedSelectionChange" :asPlainText="false" />


                    <!-- {{ chatPrompt }} -->
                    <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                      :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                      placeholder="Pick a model" />

                    <div v-if="selectedPersona">
                      <!-- <p class="italic pt-2 mb-0 pb-1">{{ selectedPersona.name }}</p> -->
                      <p class="italic pt-0">Cost per Interaction / Coût d'interaction: ${{
                        costOfInteraction().toFixed(3) }}</p>
                    </div>

                    <div v-if="settings.showPrompt">
                      Full prompt to LLM:<br />

                      <DivInput placeholder="Full prompt preview" v-model="chatPromptFormattedWithLexicon"
                        :asPlainText="settings.asPlainText" />


                    </div>
                  </div>


                  <div class="flex-grow" v-if="selectedPersona && formattedSocketUuid">
                    <Socket :key="selectedPersona.uuid" :sessionId="formattedSocketUuid" :persona="selectedPersona"
                      :userPrompt="chatPromptFormattedWithLexicon" :model="selectedModel"
                      :trigger="triggerGenerateFormatted" @messageComplete="messageCompleteFormatted"
                      @messagePartial="messagePartialFormatted">
                      <!-- <ChatWindow :messages="messageHistory" /> -->





                      <!-- <DivInput v-if = "messageHistory.length" v-model="messageHistory[messageHistory.length-1]" :asPlainText="settings.asPlainText" /> -->

                    </Socket>

                  </div>

                  <div v-if="settings.display.showReference">

                    <DivInput placeholder="Text to compare / Texte à comparer" v-model="referenceText"
                      :asPlainText="settings.asPlainText" />

                  </div>


                </div>

              </template>
              <template v-slot:tab-3>


                <button @click="toLocalLexicon"
                  class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Add Lexicon Item
                </button>

                <button @click="uploadLexicon"
                  class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Upload Lexicon
                </button>

                <button @click="downloadLexicon"
                  class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Download Lexicon
                </button>

                <button @click="clearLexicon"
                  class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Clear Lexicon
                </button>

                <table class=" w-full ">
                  <thead class="bg-gray-200 dark:bg-gray-700">
                    <tr>
                      <th class="px-4 py-2">English</th>
                      <th class="px-4 py-2">French</th>
                      <th class="px-4 py-2">Remove</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(entry, index) in localLexicon" :key="index">
                      <td class="border px-4 py-2">
                        <input type="text" v-model="entry.en"
                          class="w-full form-input px-4 py-2 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                      </td>
                      <td class="border px-4 py-2">
                        <input type="text" v-model="entry.fr"
                          class=" w-full form-input px-4 py-2 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white" />
                      </td>
                      <td class="text-center">

                        <button @click="deleteLexiconItem(index)"
                          class="w-auto whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                          X
                        </button>


                      </td>
                    </tr>
                  </tbody>
                </table>

              </template>

              <template v-slot:tab-4>


                <button @click="triggerLexicon"
                  class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Generate Lexicon
                </button>

                <button v-if="lexiconExtracts?.[0]?.extracts?.json?.[0]?.length" @click="addToLexicon"
                  class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                  Add to Lexicon ({{ lexiconExtracts?.[0]?.extracts?.json?.[0]?.length }} items)
                </button>


                <Socket v-if="selectedPersona && lexiconSocketUuid" :key="selectedPersona.uuid + 'lexicon'"
                  :sessionId="lexiconSocketUuid" :persona="selectedPersona"
                  :userPrompt="lexiconBuilderPromptWithAttachments" :model="selectedModel"
                  :trigger="triggerGenerateLexicon" @messageComplete="messageLexicon" @messagePartial="messageLexicon">
                  <!-- <ChatWindow :messages="messageHistory" /> -->

                  <!-- <DivInput placeholder="Lexicon response..." v-model="latestLexiconMessage"
                        :asPlainText="false" />   -->


                </Socket>



                <div class="grid grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6">

                  <div>
                    Original Text
                    <DivInput placeholder="Original text" v-model="chatPrompt" :asPlainText="settings.asPlainText" />
                  </div>

                  <div>
                    Translation (AI translated)
                    <DivInput placeholder="Translated text" v-model="latestMessage" :asPlainText="settings.asPlainText" />
                  </div>

                  <div>
                    Reference (Correct translation)
                    <DivInput placeholder="Reference text" v-model="referenceText" :asPlainText="settings.asPlainText" />
                  </div>

                </div>


              </template>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted, nextTick, watch, watchEffect, computed } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import DisplayPersona from '@/components/DisplayPersona.vue'
import DivInput from '@/components/DivInput.vue'
import DisplayPersonaStack from '@/components/DisplayPersonaStack.vue'
import Socket from '@/components/Socket.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatList from '@/partials/ChatList.vue'
import Tabs from '@/components/Tabs.vue';
import canada from "@/images/canada.svg";
import VueMultiselect from 'vue-multiselect'

import { notify } from "notiwind"

//Composables

import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useFacts } from '@/composables/useFacts.js'
import { useWebsockets } from '@/composables/useWebsockets.js';

const { adminModels, selectedModel } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, getRosterFromUuid } = useRosters()
const { searchFacts, factSearchResults } = useFacts()


const { sessionsContent } = useWebsockets();
const lexiconExtracts = computed(() => sessionsContent.value.filter((session) => { return session.sessionId == lexiconSocketUuid.value }));
const formattedExtracts = computed(() => sessionsContent.value.filter((session) => { return session.sessionId == formattedSocketUuid.value }));

let lngs = ref([

  { type: "auto", label: { en: "Automatically Detect", fr: "" } },
  { type: "enToFr", label: { en: "English to French", fr: "" } },
  { type: "frToEn", label: { en: "French to English", fr: "" } },

])


let selectedLng = ref(null)
let lexiconInstructions = ref("\n\nEnsure that in your translation you ALWAYS use the following lexicon of translations to ensure accuracy. If the term is in the list below, do not use another term. \n\n Do not correct my lexicon at all. There is a specific and important reason I wish you to substitute these words for my work, even if that translation is incorrect")

let props = defineProps({ rosterUuid: { type: String, default: null } })

//Triggers for the different functions
let triggerGenerate = ref(false);
let triggerGenerateLexicon = ref(false);
let triggerGenerateFormatted = ref(false);

let chatPrompt = ref("");

//Formatting translation
let chatPromptFormatted = ref("")
let chatPromptFormattedDom = ref(null)
let chatPromptFormattedSelection = ref(null)
let chatPromptJson = ref("")


let chatPromptWithLexicon = computed(() => {
  let direction = "";
  if (selectedLng?.value?.type !== 'auto') direction = " from " + selectedLng?.value?.label?.en;
  let chatValue = `Translate the following text${direction}:\n` + chatPrompt.value;

  if (localLexicon.value.length && settings.value.useLexicon) {
    // Cleanse chatPrompt.value of HTML if it's HTML
    const cleansedChatPrompt = stripHtml(chatPrompt.value);

    // Filter the localLexicon based on the cleansedChatPrompt
    const filteredLexicon = localLexicon.value.filter((term) => {
      return includesIgnoreCaseAndInvisible(cleansedChatPrompt, term.en) || includesIgnoreCaseAndInvisible(cleansedChatPrompt, term.fr);
    });

    // Append the filtered lexicon to the chatValue
    if (filteredLexicon.length) {
      chatValue += lexiconInstructions.value + "\n" + filteredLexicon.map(obj => JSON.stringify(obj)).join(',\n');
    }
  }

  return chatValue;
});


let chatPromptFormattedWithLexicon = computed(() => {
  let direction = "";
  if (selectedLng?.value?.type !== 'auto') direction = " from " + selectedLng?.value?.label?.en;
  let chatValue = `Translate the following text${direction}:\n` + chatPrompt.value;
  chatValue += "\n\nReturn the following JSON with structure intact fully translated:\n\n Ensure the entire JSON array is translated, and maintain the UUIDs. Maintain all whitespaces as well. Don't just translate the items in isolation, consider how they might fit together as fragments of a sentence if applicable." + JSON.stringify(chatPromptJson.value);

  if (localLexicon.value.length && settings.value.useLexicon) {
    // Cleanse chatPrompt.value of HTML if it's HTML
    const cleansedChatPrompt = stripHtml(chatPromptFormatted.value);

    // Filter the localLexicon based on the cleansedChatPrompt
    const filteredLexicon = localLexicon.value.filter((term) => {
      return includesIgnoreCaseAndInvisible(cleansedChatPrompt, term.en) || includesIgnoreCaseAndInvisible(cleansedChatPrompt, term.fr);
    });

    // Append the filtered lexicon to the chatValue
    if (filteredLexicon.length) {
      chatValue += lexiconInstructions.value + "\n" + filteredLexicon.map(obj => JSON.stringify(obj)).join(',\n');
    }
  }

  return chatValue;
});


// Helper function to remove HTML tags from a string
function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

// Helper function to escape a string for use in a regular expression
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

// Helper function to check if a string includes another string, ignoring case and invisible characters
function includesIgnoreCaseAndInvisible(str, search) {
  const escapedSearch = escapeRegExp(search).replace(/\s+/g, '').toLowerCase();
  return str.replace(/\s+/g, '').toLowerCase().includes(escapedSearch);
}

let referenceText = ref("");

let latestMessage = ref("")
let latestLexiconMessage = ref("")
let latestMessageFormatted = ref("")

let localLexicon = ref([])
let lexiconBuilderPrompt = ref(`Below are 3 samples of text. The first is the original text provided for translation. The second is an attempted translation which may include incorrect syntax. The third is the correct translation. Evaluate the attempted translation against the correct translation to identify differences. Then, build an array of JSON objects structured like this [{"en","[The english term which was translated]","fr":"[The correct French term which should have been used from the official translation]"}]. Build an object in the array for each difference in this format. Do not say anything else other than returning the JSON array. Strictly only return JSON under all circumstances. `);
let lexiconBuilderPromptWithAttachments = computed(() => {
  return lexiconBuilderPrompt.value + "\n\n# 1. Original Text: " + chatPrompt.value + "\n\n # 2. Translated Text with potential issues: \n\n" + latestMessage.value + "\n\n # 3. Correct translate to compare: \n\n" + referenceText.value;
});
let lexiconSocketUuid = ref(null);
let formattedSocketUuid = ref(null);
let messageHistory = ref([]);
let selectedPersonaIndex = ref(null)
const isAutoScrollActive = ref(true);
const customLabelModel = (option) => option ? option.name.en: '';
const customLng = (option) => option ? option.label.en : '';





let settings = ref({ display: { showReference: false }, showPrompt: true, useLexicon: true, asPlainText: true })
let showColsCount = computed(() => {
  return Object.values(settings.value.display).filter(value => value).length;
});

let activeTab = ref(0)
const tabs = ref([
  { label: 'Roster / Équipe' },
  { label: 'Translate / Traduire' },
  { label: 'Formatted / Formaté' },
  { label: 'Lexicon / Lexique' },
  { label: 'Lexicon Builder / Générateur de lexique' }
]);

onMounted(async () => {

  lexiconSocketUuid.value = uuidv4()
  formattedSocketUuid.value = uuidv4()

  setDark(false)
  if (props.rosterUuid) {
    console.log("Loading Roster", props.rosterUuid)
    await getRosterFromUuid(props.rosterUuid);
  }
  window.addEventListener('scroll', handleScroll);

})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});


function setDark(newValue) {
  localStorage.setItem('dark-mode', newValue);
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

function trigger() {
  //Save the history
  messageHistory.value.push({ role: "user", content: chatPrompt.value })
  triggerGenerate.value = !triggerGenerate.value;

  //Get the facts
  // let knowledgeProfileUuids = [];
  // if (selectedPersona?.value?.knowledgeProfiles?.length) knowledgeProfileUuids = selectedPersona.value.knowledgeProfiles.map((kp) => { return kp.uuid }) || [];

}

function triggerLexicon() {
  console.log('Trigger Lexicon')
  triggerGenerateLexicon.value = !triggerGenerateLexicon.value;
}

//Redo the full element
function translateFormatted() {
  let extract = extractTextAndReplaceWithUUIDs(chatPromptFormatted.value);
  chatPromptJson.value = extract.textElements;
  chatPromptFormatted.value = extract.updatedHtmlString;
  triggerGenerateFormatted.value = !triggerGenerateFormatted.value;
}
async function copyTranslated() {
  if (chatPromptFormatted.value) {
    try {
      const blob = new Blob([chatPromptFormatted.value], { type: 'text/html' });
      const data = [new ClipboardItem({ 'text/html': blob })];
      await navigator.clipboard.write(data);
      console.log('Copied to clipboard');
      notify({ group: "success", title: "Success", text: "Copied to Clipboard" }, 4000) // 4s


    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  }
}


function cloneVisibleElements(element) {
  console.log(element); // Add this line to log the element

  // Clone the element if it's visible
  if (element && element.nodeType === Node.ELEMENT_NODE && element.offsetWidth !== 0 && element.offsetHeight !== 0) {
    const clone = element.cloneNode(false);
    Array.from(element.children).forEach(child => {
      const childClone = cloneVisibleElements(child);
      if (childClone) {
        clone.appendChild(childClone);
      }
    });
    return clone;
  }
  return null;
}

function formattedSelectionChange(val) {
  chatPromptFormattedSelection.value = val;
  console.log(val)
}

//First working version
// function extractTextAndReplaceWithUUIDs(htmlString) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, 'text/html');
//   const textElements = [];

//   function processNode(node) {
//     // Skip script and style nodes, as well as comments
//     if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') ||
//         node.nodeType === Node.COMMENT_NODE) {
//       return;
//     }
//     if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
//       const uuid = uuidv4().substring(0,8);
//       textElements.push({ uuid: uuid, text: node.nodeValue }); //.trim()
//       node.nodeValue = uuid;
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       Array.from(node.childNodes).forEach(processNode);
//     }
//   }

//   Array.from(doc.body.childNodes).forEach(processNode);

//   // Serialize the document back to a string
//   const serializer = new XMLSerializer();
//   const updatedHtmlString = serializer.serializeToString(doc.body);

//   return {
//     updatedHtmlString: updatedHtmlString,
//     textElements: textElements
//   };
// }


// function restoreTextFromUUIDs(updatedHtmlString, textElements) {
//   let restoredHtmlString = updatedHtmlString;

//   textElements.forEach((val) => {
//     // Use a regular expression to replace the UUID globally, accounting for potential HTML encoding
//     const uuidRegex = new RegExp(val.uuid, 'g');
//     restoredHtmlString = restoredHtmlString.replace(uuidRegex, val.text);
//   });

//   return restoredHtmlString;
// }

//Do whole HTML string
//Version 2
// function extractTextAndReplaceWithUUIDs(htmlString) {
//   const parser = new DOMParser();
//   const doc = parser.parseFromString(htmlString, 'text/html');
//   const textElements = [];

//   function processNode(node) {
//     if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') ||
//       node.nodeType === Node.COMMENT_NODE) {
//       return;
//     }
//     if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
//       const uuid = uuidv4().substring(0, 8);
//       textElements.push({ uuid: uuid, text: node.nodeValue }); //.trim()
//       const span = doc.createElement('span');
//       span.setAttribute('tId', uuid);
//       span.textContent = node.nodeValue;
//       span.style.color = 'red'; // Style the text content to be bright red
//       node.parentNode.replaceChild(span, node);
//     } else if (node.nodeType === Node.ELEMENT_NODE) {
//       Array.from(node.childNodes).forEach(processNode);
//     }
//   }

//   Array.from(doc.body.childNodes).forEach(processNode);

//   const serializer = new XMLSerializer();
//   const updatedHtmlString = serializer.serializeToString(doc.body);

//   return {
//     updatedHtmlString: updatedHtmlString,
//     textElements: textElements
//   };
// }


//Version 3
function extractTextAndReplaceWithUUIDs(htmlString) {
  const parser = new DOMParser();
  const doc = parser.parseFromString('<!doctype html><body>' + htmlString + '</body>', 'text/html');
  const fragment = doc.createDocumentFragment();
  Array.from(doc.body.childNodes).forEach(node => fragment.appendChild(node));

  const textElements = [];

  function processNode(node) {
    if (node.nodeType === Node.ELEMENT_NODE && (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') ||
      node.nodeType === Node.COMMENT_NODE) {
      return;
    }
    if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim()) {
      const uuid = uuidv4().substring(0, 8);
      textElements.push({ uuid: uuid, text: node.nodeValue });
      const span = document.createElement('span');
      span.setAttribute('tId', uuid);
      span.textContent = node.nodeValue;
      span.style.color = 'red';
      node.parentNode.replaceChild(span, node);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(processNode);
    }
  }

  Array.from(fragment.childNodes).forEach(processNode);

  const serializer = new XMLSerializer();
  const updatedHtmlString = serializer.serializeToString(fragment);

  return {
    updatedHtmlString: updatedHtmlString,
    textElements: textElements
  };
}



function restoreTextFromUUIDs(updatedHtmlString, textElements) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(updatedHtmlString, 'text/html');

  textElements.forEach((val) => {
    const elements = doc.querySelectorAll(`span[tId="${val.uuid}"]`);
    elements.forEach((element) => {
      const textNode = document.createTextNode(val.text); // Create a text node with the original text
      element.parentNode.replaceChild(textNode, element); // Replace the span with the text node
    });
  });

  const serializer = new XMLSerializer();
  const restoredHtmlString = serializer.serializeToString(doc.body);

  return restoredHtmlString;
}


function addToLexicon() {
  console.log("lexiconExtracts.value", lexiconExtracts.value)
  if (lexiconExtracts?.value?.[0]?.extracts?.json?.[0]?.length) {
    let newValues = lexiconExtracts.value[0].extracts.json[0];
    newValues.forEach((val) => {

      //Dont add redundant
      const exists = localLexicon.value.some(lexiconItem => lexiconItem.en.toLowerCase() === val.en.toLowerCase());
      if (!exists) {
        // If it doesn't exist, unshift it onto localLexicon
        localLexicon.value.unshift(val);
      }

    })
    notify({ group: "success", title: "Success", text: "added to lexicon" }, 4000) // 4s

  }
}

function messagePartial(val) {

  if (val?.message?.length) latestMessage.value = val.message;
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == 'user') {
      messageHistory.value.push({ role: "system", content: val.message })
    }
    if (messageHistory.value[messageHistory.value.length - 1].role == 'system' && val.message.length) {
      messageHistory.value[messageHistory.value.length - 1].content = val.message;
    }
  }
  //  scrollToBottom();
}


function messageComplete(val) {
  if (val?.message?.length) latestMessage.value = val.message;
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == 'system') {
      messageHistory.value[messageHistory.value.length - 1].content = val.message;
    }
  }
}



function messagePartialFormatted(val) {

  if (val?.message?.length) latestMessageFormatted.value = val.message;

}


function messageCompleteFormatted(val) {
  if (val?.message?.length) latestMessageFormatted.value = val.message;


  if (formattedExtracts?.value?.[0]?.extracts?.json?.[0]?.length) {

    let newValues = formattedExtracts.value[0].extracts.json[0];
    chatPromptFormatted.value = restoreTextFromUUIDs(chatPromptFormatted.value, newValues)
  }

}


function messageLexicon(val) {
  if (val?.message?.length) latestLexiconMessage.value = val.message;
}



const handleScroll = () => {
  const isAtBottom = (window.innerHeight + window.scrollY) >= document.body.offsetHeight;
  isAutoScrollActive.value = isAtBottom;
};

// Function to scroll to the bottom of the page
const scrollToBottom = () => {
  window.scrollTo(0, document.body.scrollHeight);
};

// Watch for changes in logLines and auto-scroll if active
watchEffect(() => {
  if (isAutoScrollActive.value) {
    scrollToBottom();
  }
});

function costOfInteraction() {

  // let lengthOfHistory = JSON.stringify(messageHistory.value).length + chatPromptWithLexicon.value.length;
  // return (lengthOfHistory / 4000) * 0.01;

  let lengthOfPrompt = (selectedPersona?.value?.basePrompt?.length || 0) + (chatPromptWithLexicon?.value?.length || 0);
  return lengthOfPrompt / 4000 * 0.01;

}

function cleanseMessageHistory(messageHistory) {
  // Define a function to check if the messageHistory exceeds the length limit.
  const exceedsLimit = () => JSON.stringify(messageHistory).length > 5000;

  // If the length is more than 8 items, handle normally
  if (messageHistory.length > 8) {
    // Truncate the 5 items before the last 2
    for (let i = messageHistory.length - 7; i <= messageHistory.length - 3; i++) {
      if (messageHistory[i].content.length > 500) {
        messageHistory[i].content = messageHistory[i].content.substring(0, 500);
      }
    }

    // If still exceeds limit after truncation, remove middle items
    if (exceedsLimit()) {
      return [
        messageHistory[0],
        ...messageHistory.slice(messageHistory.length - 7)
      ];
    }

    return messageHistory;
  } else {
    // If 8 or fewer items, truncate all but the 1st and last 2 items
    for (let i = 1; i < messageHistory.length - 2; i++) {
      if (messageHistory[i].content.length > 500) {
        messageHistory[i].content = messageHistory[i].content.substring(0, 500);
      }
    }

    // No need to remove any items since there are 8 or fewer
    return messageHistory;
  }
}


// const adjustHeight = () => {
//   nextTick(() => {
//     textarea.value.style.height = 'auto';
//     textarea.value.style.height = (textarea.value.scrollHeight + 10) + 'px';
//   });
// };

// watch(chatPrompt, () => {
//   adjustHeight();
// });

function promptQuestion(question) {
  chatPrompt.value = question;
  trigger();
}

function selectPersona(persona, index) {
  selectedPersona.value = persona;
  if (index) selectedPersonaIndex.value = index;
  let findIndex = selectedRoster.value.personas.findIndex((rosterPersona) => { return rosterPersona.uuid == selectedPersona.value.uuid })
  if (findIndex > -1) selectedPersonaIndex.value = findIndex;
  //Don't automatically remove the history
  // messageHistory.value = []; //Clear message history when you switch Personas

  // if (selectedPersona?.value?.basePrompt?.length) {
  //      messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
  // }

  //Instead, replace the original system prompt
  if (selectedPersona?.value?.basePrompt?.length) {
    if (messageHistory?.value?.length) {
      if (messageHistory.value[0].role == 'system') messageHistory.value[0] = { role: "system", content: selectedPersona.value.basePrompt };
      else messageHistory.value.unshift({ role: "system", content: selectedPersona.value.basePrompt })
    }
    else {
      messageHistory.value = []
      messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
    }
  }

  activeTab.value = 1;
}



function toLocalLexicon(lng) {
  let newEntry = { en: "", fr: "" };

  if (lng) {
    let text = getSelectedText().trim();
    if (lng == 'en') newEntry.en = text
    else newEntry.fr = text;
  }

  localLexicon.value.unshift(newEntry);
  activeTab.value = 3;

}

function deleteLexiconItem(index) {
  localLexicon.value.splice(index, 1)
}

function getSelectedText() {
  if (window.getSelection) {
    return window.getSelection().toString();
  }
  return '';
}



const clearLexicon = () => {
  localLexicon.value = [];
};


const downloadLexicon = () => {
  const blob = new Blob([JSON.stringify(localLexicon.value)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'localLexicon.json';
  link.click();
  URL.revokeObjectURL(link.href);
};

const uploadLexicon = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';

  input.onchange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      try {
        const text = await file.text();
        const json = JSON.parse(text);
        localLexicon.value = [...localLexicon.value, ...json];
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    }
  };

  input.click();
};

</script>
