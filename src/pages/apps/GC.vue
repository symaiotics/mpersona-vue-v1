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
        <div class=" w-10/12">
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
                <div class="grid grid-cols-12 gap-4 h-full">

                  <!-- Left Column (Skinny) - Aligned to Bottom -->
                  <div v-if="selectedRoster?.personas" class="col-span-1 flex flex-col justify-end">
                    <DisplayPersonaStack :personas="selectedRoster.personas" :selectedPersonaIndex="selectedPersonaIndex"
                      @selectPersona="selectPersona" />
                  </div>

                  <!-- Right Column (Wider) -->
                  <div class="col-span-11">
                    <template v-if="selectedPersona">
                      <Socket :key="selectedPersona.uuid" :persona="selectedPersona" :userPrompt="chatPrompt"
                        :model="selectedModel" :messageHistory="messageHistory" :trigger="triggerGenerate"
                        @messageComplete="messageComplete" @messagePartial="messagePartial">
                        <ChatWindow :messages="messageHistory" />
                      </Socket>

                      <div class="w-full mx-auto ">

                        <div class="mt-6">

                          <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                            :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                            placeholder="Pick a model" />


                          <form @submit.prevent="trigger" class="relative flex items-center mt-2" data-aos="fade-down"
                            data-aos-delay="300">
                            <textarea ref="textarea" @keyup.enter="event => { if (!event.shiftKey) trigger() }"
                              v-model="chatPrompt" @input="adjustHeight" class="form-input w-full pl-12"
                              placeholder="Ask me about... / Demande moi à propos de..." aria-label="Search anything" />
                            <button type="submit" class="absolute inset-0 right-auto" aria-label="Search">
                              <svg class="w-4 h-4 shrink-0 ml-4 mr-3" viewBox="0 0 16 16"
                                xmlns="http://www.w3.org/2000/svg">
                                <path class="fill-current text-gray-400"
                                  d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z" />
                              </svg>
                            </button>
                          </form>

                        </div>
                        <p class="italic pt-2 mb-0 pb-1">{{ selectedPersona.name }}</p>
                        <p class="italic pt-0">Cost / Coût d'interaction: ${{ costOfInteraction().toFixed(3) }}</p><br />

                      </div>


                    </template>

                  </div>

                  <section class="col-span-12 w-full">
                    <ChatList v-if="selectedPersona?.knowledgeProfiles?.length" :facts="factSearchResults"
                      @promptQuestion="promptQuestion" />
                  </section>

                </div>
              </template>

              <template v-slot:tab-2>
                <h2>Coming in mPersona V2 (2024)</h2>
              </template>
            </Tabs>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, onUnmounted, nextTick, watch, watchEffect } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import DisplayPersona from '@/components/DisplayPersona.vue'
import DisplayPersonaStack from '@/components/DisplayPersonaStack.vue'
import Socket from '@/components/Socket.vue'
import ChatWindow from '@/components/ChatWindow.vue'
import ChatList from '@/partials/ChatList.vue'
import Tabs from '@/components/Tabs.vue';
import canada from "@/images/canada.svg";
import VueMultiselect from 'vue-multiselect'


//Composables
import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useFacts } from '@/composables/useFacts.js'

const { adminModels, selectedModel } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, getRosterFromUuid } = useRosters()
const { searchFacts, factSearchResults } = useFacts()

let props = defineProps({ rosterUuid: { type: String, default: null } })
let triggerGenerate = ref(false);
let chatPrompt = ref("");
let sessionId = ref(uuidv4())
let messageHistory = ref([]);
const textarea = ref(null);
let selectedPersonaIndex = ref(null)
const isAutoScrollActive = ref(true);
const customLabelModel = (option) => option ? option.name.en: '';

let activeTab = ref(0)
const tabs = ref([
  { label: 'Roster / Équipe' },
  { label: 'Interact / Interagir' },
  { label: 'Audit / Vérification' }
]);

onMounted(async () => {
  setDark(false)
  if (props.rosterUuid) {
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
  let knowledgeProfileUuids = [];
  if (selectedPersona?.value?.knowledgeProfiles?.length) knowledgeProfileUuids = selectedPersona.value.knowledgeProfiles.map((kp) => { return kp.uuid }) || [];
  if (chatPrompt?.value?.length) searchFacts(chatPrompt.value, knowledgeProfileUuids)
  nextTick(() => {
    chatPrompt.value = "";
  })
}

function messagePartial(val) {
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
  console.log("MC", val)
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == 'system') {
      messageHistory.value[messageHistory.value.length - 1].content = val.message;
    }
  }
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
  let lengthOfHistory = JSON.stringify(messageHistory.value).length + chatPrompt.value.length;
  return (lengthOfHistory / 4000) * 0.01;
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


const adjustHeight = () => {
  nextTick(() => {
    textarea.value.style.height = 'auto';
    textarea.value.style.height = (textarea.value.scrollHeight + 10) + 'px';
  });
};

watch(chatPrompt, () => {
  adjustHeight();
});

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


</script>
