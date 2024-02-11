<template>
   
      <section class="relative">
        <div class="max-w-6xl mx-auto px-2 sm:px-6 relative">
          <div class="pt-2">
            <!-- <DisplayPersona alignment="center" :persona="selectedPersona" /> -->

           
            <!-- {{ messageHistory }} -->
            <Socket v-show = "false"
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
            
            </Socket>
            <ChatWindow :messages="messageHistory" />

            <div class="mx-auto md:px-4">
              <div class="mt-1">
              

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

                <VueMultiselect v-show = true
                  v-model="selectedModel"
                  :options="adminModels"
                  :searchable="true"
                  :close-on-select="true"
                  :custom-label="customLabelModel"
                  :show-labels="false"
                  placeholder="Pick a model"
                />

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

            
          </div>
        </div>
      </section>
   
</template>

<script setup>
import { ref, onMounted, nextTick, watch } from "vue";

import { v4 as uuidv4 } from "uuid";

import ChatList from "@/partials/ChatList.vue";

import DocumentTable from "@/components/knowledgeMapping/DocumentTable.vue";
import DocumentCreateEdit from "@/components/knowledgeMapping/DocumentCreateEdit.vue";
import DocumentDragAndDrop from "@/components/knowledgeMapping/DocumentDragAndDrop.vue";
import DivInput from "@/components/DivInput.vue";

import ChatWindow from "@/components/ChatWindow.vue";
import Socket from "@/components/Socket.vue";
import VueMultiselect from "vue-multiselect";

//Composables
import { useDocuments } from "@/composables/knowledgeMapping/useDocuments.js";
import { useModels } from "@/composables/useModels.js";
const { adminModels, selectedModel, getModels } = useModels();

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

let triggerGenerate = ref(false);
let chatPrompt = ref("");
let sessionId = ref(uuidv4());
let messageHistory = ref([]);
const textarea = ref(null);

const customLabelModel = (option) => (option ? option.name.en : "");
let selectedPersona = ref({basePrompt:"", description:{en:"Default",fr:"Default"}})

onMounted(async () => {
 
  await getModels();
    // if (selectedPersona?.value?.basePrompt?.length) {
    messageHistory.value = [{
      role: "system",
      content: selectedPersona.value.basePrompt,
    }];

    //Attempt to use Claude for maximum speed.
    let claude = adminModels.value.find((model)=>{return model.model == 'claude-instant-1.2'})
    if(claude) selectedModel.value = claude;
    console.log("Claude", selectedModel.value)
  
});

function trigger() {
  //Save the history

  let checkedDocuments = documentsPending.value.filter((doc) => {
    return doc._checked;
  });

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
    // searchFacts(chatPrompt.value, knowledgeProfileUuids);
  nextTick(() => {
    chatPrompt.value = "";
  });
}


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
