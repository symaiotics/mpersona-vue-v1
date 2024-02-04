<template>
  <div class="bg-gray-100 min-h-screen p-2">
    <div class=" mx-auto bg-white p-8 rounded shadow-lg">
      <div class="flex flex-box w-full justify-center ">

        <section class="  w-10/12">

          <h1 id="wb-cont" class="font-lato font-bold text-3xl mt-10 mb-1 pb-1 border-b border-red-600 leading-tight">
            Legislative Assistant </h1>


          <p class="mb-1">
            <strong>From:</strong>
            <a href="/intro-eng" class="text-blue-500 hover:underline">
             Government of Canada
            </a>
          </p>


          <section class="mb-2">
            <p id="wb-cont" class="font-lato text-1xl.5 mt-1 mb-1 pb-1 ">
              This tool puts forward a roster of capable AI personas to address questions relating to forms, validation
              rules, and technical details.
            </p>

          </section>

        </section>
      </div>
      <div class="flex justify-center ">

        <div class="flex w-10/12">


          <section class="mb-6 w-2/3">

            Roster:
            <Socket alignment="center" :sessionId="sessionId" :persona="selectedPersona" :userPrompt="chatPrompt"
              :messageHistory="messageHistory" :trigger="triggerGenerate" @messageComplete="messageComplete">
            </Socket>

            <div class="w-full mx-auto ">
              <form @submit.prevent="trigger" class="relative flex items-center mt-8" data-aos="fade-down"
                data-aos-delay="300">
                <textarea ref="textarea" @keyup.enter="event => { if (!event.shiftKey) trigger() }" v-model="chatPrompt"
                  @input="adjustHeight" class="form-input w-full pl-12" placeholder="Ask me about …"
                  aria-label="Search anything" />
                <button type="submit" class="absolute inset-0 right-auto" aria-label="Search">
                  <svg class="w-4 h-4 shrink-0 ml-4 mr-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                    <path class="fill-current text-gray-400"
                      d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z" />
                  </svg>
                </button>
              </form>
            </div>

          </section>
          <section class=" w-1/3">
            <ChatList v-if="selectedPersona?.knowledgeProfiles?.length" :facts="factSearchResults"
              @promptQuestion="promptQuestion" />
          </section>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>

import { ref, onMounted, nextTick, watch } from 'vue';
import { v4 as uuidv4 } from 'uuid';
import DisplayPersona from '@/components/DisplayPersona.vue'
import Socket from '@/components/Socket.vue'
import ChatList from '@/partials/ChatList.vue'

//Composables
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useFacts } from '@/composables/useFacts.js'
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { getRosterFromUuid } = useRosters()
const { searchFacts, factSearchResults } = useFacts()

let props = defineProps({ rosterUuid: { type: String, default: null } })
let triggerGenerate = ref(false);
let chatPrompt = ref("");
let sessionId = ref(uuidv4())
let messageHistory = ref([]);
const textarea = ref(null);

onMounted(async () => {
  setDark(false)
  if (props.rosterUuid) {
    await getRosterFromUuid();
    // selectedPersona.value = personas.value.find((persona) => { return persona.uuid == props.rosterUuid })
    // if (selectedPersona?.value?.basePrompt?.length) {
    //   messageHistory.value.push({ role: "system", content: selectedPersona.value.basePrompt })
    // }
  }
})


function setDark(newValue) {
  localStorage.setItem('dark-mode', newValue);
  if (newValue) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
}

// function quickLinks(text) {
//   chatPrompt.value = text;
//   trigger();
// }


function trigger() {
  //Save the history
  messageHistory.value.push({ role: "user", content: JSON.stringify(chatPrompt.value) })

  triggerGenerate.value = !triggerGenerate.value;

  //Get the facts
  let knowledgeProfileUuids = [];
  if (selectedPersona?.value?.knowledgeProfiles?.length) knowledgeProfileUuids = selectedPersona.value.knowledgeProfiles.map((kp) => { return kp.uuid }) || [];
  if (chatPrompt?.value?.length) searchFacts(chatPrompt.value, knowledgeProfileUuids)
  nextTick(() => {
    chatPrompt.value = "";
  })


}

function messageComplete(val) {
  //On message completion add it
  messageHistory.value.push({ role: "system", content: val.message })
  messageHistory.value = cleanseMessageHistory(messageHistory.value)
  // chatPrompt.value = "";
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
</script>
