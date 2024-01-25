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




      <section class="relative">


        <div class="max-w-9xl mx-auto px-4 sm:px-6 relative">


          <div class="pt-32 pb-12 md:pt-40 md:pb-20">

            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>


                <!-- Page header -->
                <div class="max-w-3xl mx-auto text-center pb-3 md:pb-4">
                  <h1 class="h3 font-red-hat-display mb-4">Knowledge Profiles</h1>
                  <p class="text-lg text-gray-600 dark:text-gray-400">A knowledge profiles define specific knowledge sets
                    for your personas.</p>
                  <br />


                </div>



                <div class="w-full px-3">
                  <button @click="add" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                    <span>Add New</span>
                  </button>
                </div>


                <KnowledgeProfileTable @changeTab="activeTab = 1" />
              </template>
              <template v-slot:tab-1>

                <KnowledgeProfileCreateEdit v-if = "selectedKnowledgeProfile" :knowledgeProfile = "selectedKnowledgeProfile"/>
                <KnowledgeProfileCreateEdit v-else-if = "newKnowledgeProfile" :knowledgeProfile = "newKnowledgeProfile"/>
                
              </template>

              <template v-slot:tab-2>

                <div class="flex flex-wrap -mx-3 mt-6">
                  <div class="w-full px-3">
                    <DragAndDropFiles />
                  </div>
                </div>

                <div class="flex flex-wrap -mx-3 mt-6">
                  <div class="w-full px-3">
                    <button @click="processFiles()"
                      class="btn text-white bg-blue-500 hover:bg-blue-400 w-full flex items-center mb-3">
                      <span>Pre-Process Files</span>
                      <svg class="w-3 h-3 shrink-0 mt-px ml-2" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current"
                          d="M6.602 11l-.875-.864L9.33 6.534H0v-1.25h9.33L5.727 1.693l.875-.875 5.091 5.091z" />
                      </svg>
                    </button>
                  </div>
                </div>

                <FileViewer />



              </template>


              <template v-slot:tab-3>


                <div class="flex items-center">

                  <!-- {{ personas }} -->
                  <VueMultiselect v-if="personas" v-model="selectedPersona" placeholder="Select a persona" label="name"
                    track-by="name" :options="personas" :option-height="104" :custom-label="customLabel"
                    :show-labels="false" />

                  <button @click="addEvaluator"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold m-2 p-2 rounded w-auto">
                    Add Persona to Evaluate
                  </button>

                </div>

                <!-- {{ evaluationSet }} -->

                <EvaluatePersonas :evaluationSet="evaluationSet" 
                  @deleteEvaluator="deleteEvaluator" @knowledgeProfilesUpdate="knowledgeProfilesUpdate"
                  @triggerSearch="triggerSearch" />


                  <!--:triggerGeneration="triggerGeneration"-->

                <!-- Evaluate
                <input v-model="factSearchString" id="factSearchString" type="text" class="form-input w-full"
                  placeholder="Search Facts" required @keyup.enter="searchFacts(factSearchString)" />


                <table class="w-full">
                  <thead>
                    <tr>
                      <th class="border dark:border-gray-700 dark:text-gray-300">Fact / Questions</th>
                      <th class="border dark:border-gray-700 dark:text-gray-300">Score</th>
                      <th class="border dark:border-gray-700 dark:text-gray-300">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    <template v-for="(fact, index) in factSearchResults" :key="'searchFact' + index">

                      <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.fact }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.score }}</td>
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3"><a
                            :href="'https://mpersona.blob.core.windows.net/' + fact.storageUrl" target="_blank"> {{
                              fact.storageUrl }}</a></td>
                      </tr>

                      <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ fact.keywords }}</td>
                      </tr>

                      <tr v-for="(question, index2) in fact.questions" :key="'question' + index + index2"
                        class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700">
                        <td colspan=3 class="border dark:border-gray-700 dark:text-gray-300 p-3">{{ question }}</td>
                      </tr>


                    </template>

                  </tbody>
                </table> -->

              </template>


            </Tabs>



            <!-- Contact form -->
            <!-- <div class="max-w-xl mx-auto"> -->


            <!-- </div> -->

          </div>
        </div>
      </section>

    </main>

    <!-- Site footer -->
    <Footer />

  </div>
</template>

<script setup>

//Plugins
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'
import VueMultiselect from 'vue-multiselect'
import { v4 as uuidv4 } from 'uuid';


//Components
import DragAndDropFiles from '@/components/DragAndDropFiles.vue';
import FloatingHighlightBar from '@/components/FloatingHighlightBar.vue';
import StickyBox from '@/components/StickyBox.vue';
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import Footer from '@/partials/Footer.vue'
import Tabs from '@/components/Tabs.vue';
import FileViewer from '@/components/FileViewer.vue';
import KnowledgeProfileTable from '@/components/KnowledgeProfileTable.vue';
import EvaluatePersonas from '@/components/EvaluatePersonas.vue';
import KnowledgeProfileCreateEdit from '@/components/KnowledgeProfileCreateEdit.vue';

//Composables
import { useTokens } from '@/composables/useTokens.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useFiles } from '@/composables/useFiles.js'
import { useFacts } from '@/composables/useFacts.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
// import { nextTick } from 'proceknowledgeProfilesUpdatess';
// import { randomUUID } from 'crypto';
const { addNewKnowledgeProfile, newKnowledgeProfile, resetKnowledgeProfile, getKnowledgeProfiles, createKnowledgeProfiles, selectedKnowledgeProfile } = useKnowledgeProfiles()

//Variables
const { personas, selectedPersona } = usePersonas()
const { token, tokenDecoded } = useTokens()
const { files, processFiles, getFiles } = useFiles()
const { factSearchString, searchFacts } = useFacts()

let activeTab = ref(0)
const tabs = ref([
  { label: 'Knowledge Profiles' },
  { label: 'Create/Edit' },
  { label: 'Files and Facts' },
  { label: 'Evaluate' },
  // { label: '' },
]);


let evaluationSet = ref([])
// let triggerGeneration = ref(false);
// let newKnowledgeProfile = ref({
//   name: "",
//   description: { en: "", fr: "" },
//   createdBy: 'public',
// })

const router = useRouter()

//Multiselect
const customLabel = (option) => option ? option.name : '';

onMounted(() => {
  // getCategories();
  getKnowledgeProfiles();
  getFiles();
})


function add()
{
activeTab.value = 1;
}


function addEvaluator() {
  if (selectedPersona.value) {
    var newEval = {
      trigger: false,
      sessionId: uuidv4(),
      persona: JSON.parse(JSON.stringify(selectedPersona.value)),
      knowledgeProfiles: [],
      useKnowledgeProfiles: false,
      facts: [],
    }
    evaluationSet.value.push(newEval)
  }
}

//Remove the evaluator
function deleteEvaluator(index) {
  evaluationSet.value.splice(index, 1)
}


function knowledgeProfilesUpdate(val) {
  evaluationSet.value[val.index].knowledgeProfiles = val.knowledgeProfiles;
}
//Trigger Search Results for each Persona
async function triggerSearch() {

  //Perform the search if it is relevant
  evaluationSet.value.forEach(async (evaluation, index, origArray) => {
    var knowledgeProfileUuids = evaluation.knowledgeProfiles.map((kp) => { return kp.uuid });
    console.log("knowledgeProfileUuids " + index, knowledgeProfileUuids)
    if (knowledgeProfileUuids.length) {
      
      evaluation.facts = await searchFacts(factSearchString.value, knowledgeProfileUuids)
      console.log(index, evaluation.facts)
      evaluation.trigger = !evaluation.trigger;
    }
    else {
      evaluation.trigger = !evaluation.trigger;
    }

    // We COULD alternatively search against all facts, regardless of knowledgeProfile
    // else searchFacts(factSearchString.value)

  })

}



// function beginProcessFiles() {
//   //Begin processing the stages files
//   processFiles();
// }

// function handleCommand(command) {
//   console.log("Command", command)
// }

</script>
