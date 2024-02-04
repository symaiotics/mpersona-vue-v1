<template>
  <div class="flex flex-col min-h-screen overflow-hidden">
    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">
      <!-- Page illustration -->

      <!-- Page sections -->

      <section class="relative">
        <!-- Background gradient (light version only) -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-gray-100 to-white pointer-events-none dark:hidden"
          aria-hidden="true"
        ></div>
        <!-- End background gradient (light version only) -->
        <div class="relative max-w-6xl mx-auto px-4 sm:px-6">
          <div class="pb-8">
            <div class="max-w-6xl mx-auto text-center">
              <h1 class="h1 font-red-hat-display mb-4" data-aos="fade-down">
                How can I help you today?
              </h1>

              <!-- <p class="text-xl text-gray-600 dark:text-gray-400" data-aos="fade-down" data-aos-delay="150">I am here to assist you within your inquiry.</p> -->
            </div>
          </div>
        </div>
      </section>

      <section class="relative">
        <div class="max-w-6xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32">
            <!-- <DisplayPersona alignment="center" :persona="selectedPersona" /> -->

           
            <!-- {{ messageHistory }} -->
            <Socket
              alignment="center"
              :model="selectedModel"
              :sessionId="sessionId"
              :persona="selectedPersona"
              :userPrompt="chatPrompt"
              :messageHistory="messageHistory"
              :trigger="triggerGenerate"
              @messageComplete="messageComplete"
              @messagePartial="messagePartial"
            >
              <!-- {{ messageHistory }} -->
              <ChatWindow :messages="messageHistory" />
            </Socket>
            <!-- <ChatWindow :messages="messageHistory"/> -->

            <div class="mx-auto md:px-4">
              <div class="mt-6">
                <VueMultiselect
                  v-model="selectedModel"
                  :options="adminModels"
                  :searchable="true"
                  :close-on-select="true"
                  :custom-label="customLabelModel"
                  :show-labels="false"
                  placeholder="Pick a model"
                />

                <form
                  @submit.prevent="trigger"
                  class="relative flex items-center mb-2"
                  data-aos="fade-down"
                  data-aos-delay="300"
                >
                  <textarea
                    ref="textarea"
                    @keyup.enter="
                      (event) => {
                        if (!event.shiftKey) trigger();
                      }
                    "
                    v-model="chatPrompt"
                    @input="adjustHeight"
                    class="form-input w-full pl-12"
                    placeholder="Ask me about …"
                    aria-label="Search anything"
                  />
                  <button
                    type="submit"
                    class="absolute inset-0 right-auto"
                    aria-label="Search"
                  >
                    <svg
                      class="w-4 h-4 shrink-0 ml-4 mr-3"
                      viewBox="0 0 16 16"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        class="fill-current text-gray-400"
                        d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z"
                      />
                    </svg>
                  </button>
                </form>

                <DocumentDragAndDrop 
                  @documentsChanged="documentsPendingChanged"
                />

                <div class="flex flex-wrap">
                  <div v-if="documentsPending?.length" class="w-full">
                    <p class="mt-2 font-lato">
                      Check any content to include it in your interactions.
                      Uncheck items to remove them from subsequent interactions.
                    </p>
                    <!-- {{ documentsPending }} -->
                    <DocumentTable
                      :simple="true"
                      :documents="documentsPending"
                      @edit="documentsPendingSelectToEdit"
                      @checked="documentsPendingCheck"
                      @view="documentsPendingSelectToView"
                    />
                  </div>

                  <div
                    v-if="selectedDocumentPending && !documentViewContent"
                    class="w-full"
                  >
                    <DocumentCreateEdit
                      v-model="selectedDocumentPending"
                      @close="selectedDocumentPending = null"
                    />
                  </div>

                  <button
                    v-if="documentViewContent"
                    @click="
                      documentViewContent = false;
                      selectedDocumentPending = null;
                    "
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                  >
                    Close View
                  </button>
                  <DivInput
                    v-if="documentViewContent && selectedDocumentPending"
                    v-model="selectedDocumentPending.htmlContent"
                    :asPlainText="false"
                  />
                </div>
              </div>
            </div>

            <ChatList
              v-if="selectedPersona?.knowledgeProfiles?.length"
              :facts="factSearchResults"
              @promptQuestion="promptQuestion"
            />
          </div>
        </div>
      </section>
    </main>

    <!-- Site footer -->
    <Footer />
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";

import { v4 as uuidv4 } from "uuid";

import Header from "@/partials/Header.vue";
import ChatList from "@/partials/ChatList.vue";
import Footer from "@/partials/Footer.vue";

import DocumentTable from "@/components/knowledgeMapping/DocumentTable.vue";
import DocumentCreateEdit from "@/components/knowledgeMapping/DocumentCreateEdit.vue";
import DocumentDragAndDrop from "@/components/knowledgeMapping/DocumentDragAndDrop.vue";
import DivInput from "@/components/DivInput.vue";

import DisplayPersona from "@/components/DisplayPersona.vue";
import ChatWindow from "@/components/ChatWindow.vue";
import Socket from "@/components/Socket.vue";
import VueMultiselect from "vue-multiselect";

//Composables
import { useDocuments } from "@/composables/knowledgeMapping/useDocuments.js";
import { useModels } from "@/composables/useModels.js";
import { usePersonas } from "@/composables/usePersonas.js";
import { useFacts } from "@/composables/useFacts.js";
const { adminModels, selectedModel } = useModels();
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } =
  usePersonas();
const { searchFacts, factSearchResults } = useFacts();

const {
  defaultDocument,
  newDocument,
  documents,
  documentsFiltered,
  applyFilter,

  documentsPending,
  selectedDocument,
  selectedDocumentPending,
  addNewDocument,
  resetDocument,

  getDocuments,
  createDocuments,
  updateDocuments,
  addRemoveTags,
  deleteDocuments,
} = useDocuments();

let documentViewContent = ref(false);

let props = defineProps({ personaId: { type: String, default: null } });
let triggerGenerate = ref(false);
let chatPrompt = ref("");
// let initialPrompt = ref('Say hello.');
let sessionId = ref(uuidv4());
let messageHistory = ref([]);
const textarea = ref(null);

const customLabelModel = (option) => (option ? option.name.en : "");

onMounted(async () => {
  if (props.personaId) {
    await getPersonas();
    selectedPersona.value = personas.value.find((persona) => {
      return persona.uuid == props.personaId;
    });
    // if (selectedPersona?.value?.basePrompt?.length) {
    messageHistory.value.push({
      role: "system",
      content: selectedPersona.value.basePrompt,
    });
    // }
  }
});

function trigger() {
  //Save the history

  let checkedDocuments = documentsPending.value.filter((doc) => {
    return doc._checked;
  });
  console.log(checkedDocuments.length);
  console.log(messageHistory?.value?.length);
  console.log(messageHistory.value);
  console.log(messageHistory?.value?.[0]?.role == "system");
  if (
    checkedDocuments.length &&
    messageHistory.value.length &&
    messageHistory.value[0].role == "system"
  ) {
    messageHistory.value[0].content =
      selectedPersona.value.basePrompt +
      `\n\n Prioritize the use of the following reference information in your response above all other information:\n\n${checkedDocuments
        .map((file) =>
          JSON.stringify({ original: file.original, content: file.textContent })
        )
        .join(",\n")}`;
  } else {
    messageHistory.value[0].content = selectedPersona.value.basePrompt;
  }
  messageHistory.value.push({
    role: "user",
    content: JSON.parse(JSON.stringify(chatPrompt.value)),
  });

  triggerGenerate.value = !triggerGenerate.value;

  //Get the facts
  let knowledgeProfileUuids = [];
  if (selectedPersona?.value?.knowledgeProfiles?.length)
    knowledgeProfileUuids =
      selectedPersona.value.knowledgeProfiles.map((kp) => {
        return kp.uuid;
      }) || [];
  if (chatPrompt?.value?.length)
    searchFacts(chatPrompt.value, knowledgeProfileUuids);
  nextTick(() => {
    chatPrompt.value = "";
  });
}

// function messageComplete(val) {
//   //On message completion add it
//   messageHistory.value.push({ role: "system", content: val.message })
//   messageHistory.value = cleanseMessageHistory(messageHistory.value)
//   // chatPrompt.value = "";
// }

function messagePartial(val) {
  if (messageHistory?.value?.length) {
    if (messageHistory.value[messageHistory.value.length - 1].role == "user") {
      messageHistory.value.push({ role: "system", content: val.message });
    }
    if (
      messageHistory.value[messageHistory.value.length - 1].role == "system" &&
      val.message.length
    ) {
      messageHistory.value[messageHistory.value.length - 1].content =
        val.message;
    }
  }
  //  scrollToBottom();
}

function messageComplete(val) {
  console.log("MC", val);
  if (messageHistory?.value?.length) {
    if (
      messageHistory.value[messageHistory.value.length - 1].role == "system"
    ) {
      messageHistory.value[messageHistory.value.length - 1].content =
        val.message;
    }
  }
}

function cleanseMessageHistory(messageHistory) {
  // Define a function to check if the messageHistory exceeds the length limit.
  const exceedsLimit = () => JSON.stringify(messageHistory).length > 5000;

  // If the length is more than 8 items, handle normally
  if (messageHistory.length > 8) {
    // Truncate the 5 items before the last 2
    for (
      let i = messageHistory.length - 7;
      i <= messageHistory.length - 3;
      i++
    ) {
      if (messageHistory[i].content.length > 500) {
        messageHistory[i].content = messageHistory[i].content.substring(0, 500);
      }
    }

    // If still exceeds limit after truncation, remove middle items
    if (exceedsLimit()) {
      return [
        messageHistory[0],
        ...messageHistory.slice(messageHistory.length - 7),
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
    textarea.value.style.height = "auto";
    textarea.value.style.height = textarea.value.scrollHeight + 10 + "px";
  });
};

watch(chatPrompt, () => {
  adjustHeight();
});

function promptQuestion(question) {
  chatPrompt.value = question;
  trigger();
}

function documentsPendingChanged(files) {
  for (const file of files) {
    documentsPending.value.push(file);
    console.log("file", file);
  }
}

function documentsPendingCheck(val) {
  let matchedDoc = documentsPending.value.find((doc) => {
    return doc.uuid == val.uuid;
  });
  if (matchedDoc) matchedDoc._checked = val.isChecked;
}

function documentsPendingToggleCheckAll() {
  documentsPendingCheckAll.value = !documentsPendingCheckAll.value;
  for (const doc of documentsPending.value) {
    doc._checked = documentsPendingCheckAll.value;
  }
}

function documentsPendingSelectToEdit(index) {
  documentViewContent.value = false;
  selectedDocumentPending.value = documentsPending.value[index];
  nextTick(() => {
    selectedDocumentPending.value = { ...selectedDocumentPending.value };
  });
}

function documentsPendingSelectToView(index) {
  documentViewContent.value = true;

  selectedDocumentPending.value = documentsPending.value[index];
  nextTick(() => {
    selectedDocumentPending.value = { ...selectedDocumentPending.value };
  });
}
</script>
