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
                  <h1 class="h3 font-red-hat-display mb-4">Personas</h1>
                  <p class="text-lg text-gray-600 dark:text-gray-400">Personas define the tasks and skills of your digital
                    ecosystem.</p>
                  <p v-if="personas?.length" class="text-lg text-gray-600 dark:text-gray-400">You currently have access to
                    <b>{{ personas.length }}</b> personas.
                  </p>
                  <p v-if="tokenDecoded?.roles?.includes('admin')" class="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    As an admin, you can view all personas</p>

                  <div v-if="tokenDecoded?.roles?.includes('admin')">
                    <button @click="viewAllPersonas" class="btn text-white bg-teal-500 hover:bg-teal-400  mb-3">
                      <span>View All</span>
                    </button>
                  </div>

                  <br />
                </div>

                <div class="flex space-x-4">

                  <div>
                    <button @click="addPersona" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                      <span>Add New</span>
                    </button>
                  </div>

                </div>


                <PersonaTable @changeTab="activeTab = 1" />
              </template>
              <template v-slot:tab-1>
                <PersonaCreateEdit v-if="selectedPersona" :persona="selectedPersona"
                  :key="'persona' + selectedPersona._id" @changeTab="changeTab" />
                <PersonaCreateEdit v-else-if="newPersona" :persona="newPersona" @changeTab="changeTab" />
              </template>


              <template v-slot:tab-2>
                <!-- Page header -->
                <div class="max-w-3xl mx-auto text-center pb-3 md:pb-4">
                  <h1 class="h3 font-red-hat-display mb-4">Rosters</h1>
                  <p class="text-lg text-gray-600 dark:text-gray-400">Rosters are groupings of personas to support specific teams.</p>
                  <p v-if="rosters?.length" class="text-lg text-gray-600 dark:text-gray-400">You currently have access to
                    <b>{{ rosters.length }}</b> rosters.
                  </p>
                  <p v-if="tokenDecoded?.roles?.includes('admin')" class="text-lg text-gray-600 dark:text-gray-400 mt-2">
                    As an admin, you can view all rosters</p>

                  <div v-if="tokenDecoded?.roles?.includes('admin')">
                    <button @click="viewAllRosters" class="btn text-white bg-teal-500 hover:bg-teal-400  mb-3">
                      <span>View All</span>
                    </button>
                  </div>

                  <br />
                </div>

                <div class="flex space-x-4">

                  <div>
                    <button @click="addRoster" class="btn text-white bg-teal-500 hover:bg-teal-400 flex items-center mb-3">
                      <span>Add New</span>
                    </button>
                  </div>

                </div>


                <RosterTable @changeTab="activeTab = 3" />
              </template>

              <template v-slot:tab-3>
                <RosterCreateEdit v-if="selectedRoster" :roster="selectedRoster" :key="'roster' + selectedRoster._id"
                  @changeTab="changeTab" />
                <RosterCreateEdit v-else-if="newRoster" :roster="newRoster" @changeTab="changeTab" />
              </template>


            </Tabs>

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
import { ref, onMounted, nextTick } from 'vue';

//Components
import Header from '@/partials/Header.vue'
import PageIllustration from '@/partials/PageIllustration.vue'
import Footer from '@/partials/Footer.vue'
import Tabs from '@/components/Tabs.vue';
import PersonaTable from '@/components/PersonaTable.vue';
import PersonaCreateEdit from '@/components/PersonaCreateEdit.vue';
import RosterTable from '@/components/RosterTable.vue';
import RosterCreateEdit from '@/components/RosterCreateEdit.vue';

//Composables
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useTokens } from '@/composables/useTokens.js'
const {  personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, newRoster, getRosters, resetRoster } = useRosters()
const { tokenDecoded } = useTokens()

let activeTab = ref(0)
const tabs = ref([
  { label: 'Personas' },
  { label: 'Create/Edit Personas' },
  { label: 'Rosters' },
  { label: 'Create/Edit Rosters' },
]);

onMounted(() => {
  getPersonas();
  getRosters();
  console.log("getting")
})

function viewAllPersonas() {
  getPersonas(true);
}

function viewAllRosters() {
  getRosters(true);
}


function addPersona() {
  resetPersona();
  selectedPersona.value = null;
  activeTab.value = 1;
}

function addRoster() {
  resetRoster();
  selectedRoster.value = null;
  activeTab.value = 3;
}


function changeTab(tab) {
  activeTab.value = tab;
}

</script>
