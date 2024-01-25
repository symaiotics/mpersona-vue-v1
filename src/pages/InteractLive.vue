<template>
  <div class="flex flex-col min-h-screen overflow-hidden">

    <!-- Site header -->
    <Header />

    <!-- Page content -->
    <main class="grow">

      <!-- Page illustration -->
      <div class="relative max-w-9xl mx-auto h-0 pointer-events-none -z-1" aria-hidden="true">
        <PageIllustration />
      </div>
      <!-- stages -->
      <!-- {{ stages }} -->
      <section class="relative">
        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">
          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>

                <Tabs :tabs="subTabs" v-model="activeSubTab">
                  <template v-slot:tab-0>

                    <p v-if="!stages.length" class="p-1">
                      Add a stage to get started.
                      A stage allows you to interact with a set of personas on a specific prompt.</p>
                    <p v-if="!stages.length" class="p-1">
                      Each additional stage can have a unique prompt or use the output
                      from the previous stage as its prompt.</p>
                    <div class="flex flex-col md:flex-row">
                      <button @click="addStage"
                        class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 p-3 rounded">
                        Add Stage
                      </button>
                    </div>

                    <template v-for="(stage, index) in stages" :key="'stage' + stage.uuid">
                      <SocketStage 
                      v-model:userPrompt="stage.userPrompt" 
                      :options="stage.options" 
                      :model="stage.model"
                      :stageIndex="index" 
                      :stageUuid="stage.uuid" 
                      :sockets="stage.sockets"
                        :selectedSessionsContent="stage.selectedSessionsContent" @deleteStage="deleteStage"
                        @addToSockets='addToSockets' @removeFromSockets='removeFromSockets'
                        @knowledgeProfilesUpdate='knowledgeProfilesUpdate'
                        @updateSessionContent="updateSessionContent" @moveStageUp="moveStageUp"
                        @moveStageDown="moveStageDown" @update:options="handleUpdateOptions"
                        @update:model="handleUpdateModel"
                        />
                    </template>
                  </template>

                  <template v-slot:tab-1>
                    <StageVisualize2 :treeNodes="stageNodes" :treeEdges="stageEdges" />
                  </template>

                </Tabs>

              </template>


              <template v-slot:tab-1>
                <div>

                  <!-- {{ stages }} -->

                  <div class="w-full  px-3 mb-4 md:mb-1">
                    <!-- {{ workStreams }} -->
                    <!-- {{ stages }}
                    {{ sessions }} -->
                    <div class="flex items-center">
                      <VueMultiselect v-if="workStreams" v-model="selectedWorkStream" placeholder="Select a Work Stream"
                        label="name" track-by="name" :options="workStreams" :option-height="104"
                        :custom-label="customLabel" :show-labels="false" />


                      <button @click="loadWorkStream"
                        class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-200 font-bold m-2 p-2 rounded w-auto">
                        Select
                      </button>

                    </div>


                  </div>

                  <div v-if="stages.length" class="w-full  px-3 mb-4 md:mb-1">
                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1" for="name">
                      Work Stream Name
                      <span class="text-red-600">*</span>
                    </label>
                    <input v-model="newWorkStream.name" id="name" type="text" class="form-input w-full"
                      placeholder="Enter the name of the Work Stream" required />

                    <label class="block text-gray-800 dark:text-gray-300 text-sm font-medium mb-1 mt-2" for="description">
                      Description
                    </label>
                    <input v-model="newWorkStream.description.en" id="description" type="text" class="form-input w-full"
                      placeholder="Enter a brief description" />
                  </div>

                  <button @click="saveWorkStream"
                    class=" whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-3 p-3 rounded">
                    Save Work Stream
                  </button>

                </div>
              </template>
              <template v-slot:tab-2>
                <!-- {{ stages }} -->

                <template v-for="(stage, index) in messages" :key="'resultsStage' + index">
                  <div class="border m-2 p-2 rounded  preserve-whitespace-pre-line" v-html="markdown(stage)"></div>
                </template>
              </template>
            </Tabs>

          </div>
        </div>
      </section>


    </main>

    <!-- Site footer -->
    <!-- <Footer /> -->

  </div>
</template>

<script setup>
//Plugins
import { ref, computed, onMounted, watchEffect, watch } from 'vue';
import MarkdownIt from 'markdown-it';

//Libs
import { v4 as uuidv4 } from 'uuid';
import VueMultiselect from 'vue-multiselect'

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import SocketStage from '@/components/SocketStage.vue'
import Tabs from '@/components/Tabs.vue';
import StageVisualize2 from '@/components/StageVisualize2.vue';

//Composables
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js';
import { useWebsockets } from '@/composables/useWebsockets.js';
import { useWorkStreams } from '@/composables/useWorkStreams.js';
import { useModels } from '@/composables/useModels.js'
const { getKnowledgeProfiles } = useKnowledgeProfiles();
const { sessions, stages, stageNodes, stageEdges } = useWebsockets();
const { getWorkStreams, createWorkStreams, updateWorkStreams, workStreams, selectedWorkStream, selectWorkStream } = useWorkStreams();
const { adminModels, selectedModel } = useModels()

const customLabel = (option) => option ? option.name : '';


//Tabs
let activeTab = ref(0)
const tabs = ref([
  { label: 'Interact' },
  { label: 'Work Streams' },
  { label: 'Results' },
]);


let activeSubTab = ref(0)
const subTabs = ref([
  { label: 'Build Stages' },
  { label: 'Visualize' },
]);

let newWorkStream = ref({
  name: "",
  description: { en: "", fr: "" },
});


const messages = computed(() => {
  var combinedResults = [];
  var keys = Object.keys(sessions.value)
  keys.forEach((key, index, origArray) => {
    var text = sessions.value[key].completedMessage || sessions.value[key].partialMessage;
    if (text.length) combinedResults.push(text)

  })

  // const md = new MarkdownIt();
  // return md.render(combinedResults.join(''));
  return combinedResults;

});


//Lifecycle hooks
onMounted(() => {
  getWorkStreams();
  getKnowledgeProfiles();
  if (!stages.value.length)
    addStage();
})

//Functions
function addStage() {
  var newStage = {
    userPrompt: "",
    selectedSessionsContent: [],
    uuid: uuidv4(),
    sockets: [],
    options: null,
    model: adminModels.value[0],
    // personaRoster: [],

  }
  stages.value.push(newStage)
}

function deleteStage(index) {
  console.log(index)
  stages.value.splice(index, 1)
}

function moveStageUp(index) {
  if (index > 0) {
    var newIndex = index - 1;

    //TODO This code is still buggy
    //TODO update selectedSessionsContent so the indexes of those change as well
    //Incorrect, this is fixing the wrong thing. Need to fix all the other indexes 
    // stages.value.forEach((stage)=>{
    //   stage.selectedSessionsContent.forEach((session)=>{
    //     if(session.stageIndex == index) session.stageIndex = newIndex;
    //   })
    // })
    const itemToMoveUp = stages.value[index];
    stages.value.splice(index, 1);
    stages.value.splice(index - 1, 0, itemToMoveUp);


    stages.value[index].selectedSessionsContent = []
    stages.value[newIndex].selectedSessionsContent = []


  }
}

function moveStageDown(index) {
  if (index < stages.value.length - 1) {
    var newIndex = index + 1;

    //TODO update selectedSessionsContent so the indexes of those change as well
    const itemToMoveDown = stages.value[index];
    stages.value.splice(index, 1);
    stages.value.splice(index + 1, 0, itemToMoveDown);

    stages.value[index].selectedSessionsContent = []
    stages.value[newIndex].selectedSessionsContent = []


  }
}


function addToSockets(val) {
  console.log("Add to Roster", val)
  if (val.persona) stages.value[val.stageIndex].sockets.push(
    {
      sessionId: uuidv4(), //generate this at the parent level now
      socketIndex: stages.value[val.stageIndex].sockets.length,
      stageIndex: val.stageIndex,
      stageUuid: val.stageUuid,
      persona: val.persona,
      knowledgeProfiles: val.persona.knowledgeProfiles || []
    }
  )
}

function removeFromSockets(val) {
  stages.value[val.stageIndex].sockets.splice(val.index, 1)
}

function saveWorkStream() {
  createWorkStreams(newWorkStream.value).then((response) => {

    //Reset Work Stream
    newWorkStream.value =
    {
      name: "",
      description: { en: "", fr: "" },
    }

  })
}

function loadWorkStream() {
  selectWorkStream(selectedWorkStream.value);
  activeTab.value = 0;
}
 

function updateSessionContent(val) {
  stages.value[val.stageIndex].selectedSessionsContent = val.newValue;
}

function knowledgeProfilesUpdate(val) {
  console.log("New KPs", val)
  stages.value[val.stageIndex].sockets[val.index].knowledgeProfiles = val.knowledgeProfiles;
}



function markdown(html) {

  const md = new MarkdownIt();
  return md.render(html);

}

function handleUpdateOptions(val) {
  stages.value[val.stageIndex].options = val.options;
}

function handleUpdateModel(val) {
  stages.value[val.stageIndex].model = val.model;
}

</script>

<style src="vue-multiselect/dist/vue-multiselect.css"></style>

