<template>
  <div class="mb-3">

    Write your prompt
    <input v-model="factSearchString" id="factSearchString" type="text" class="form-input w-full"
      placeholder="Search Facts" required @keyup.enter="triggerSearch" />
  </div>

  <table class="w-full">
    <thead>
      <tr class="flex w-full">
        <th v-for="(set, index) in props.evaluationSet" :key="'head' + index"
          class="flex-1 border dark:border-gray-700 dark:text-gray-300">
          Evaluator {{ index + 1 }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr class="flex w-full">
        <td v-for="(set, index) in props.evaluationSet" :key="'set' + set.uuid + index"
          class="flex-1 border dark:border-gray-700 dark:text-gray-300 p-3">
          <Socket :trigger="set.trigger" :stageIndex="index" :stageUuid="set.sessionId" :sessionId="set.sessionId"
            :socketIndex="index" :userPrompt="factSearchString" :temperature="0.5" :persona="set.persona"
            :facts="set.facts" />

          <VueMultiselect v-if="knowledgeProfiles" v-model="set.knowledgeProfiles"
            @update:modelValue="(value) => handleKnowledgeProfilesUpdate(value, index)"
            placeholder="Select a Knowledge Profile" label="name" track-by="name" :options="knowledgeProfiles"
            :multiple="true" :option-height="104" :custom-label="customLabel" :show-labels="false" />
        </td>
      </tr>
    </tbody>
  </table>

  <template v-if="factSearchResults">
    Search Results: Displaying {{ showResults }} of {{ factSearchResults.length }}
    <table class="w-full">
      <thead>
        <tr>
          <th class="border dark:border-gray-700 dark:text-gray-300">Fact / Questions</th>
          <th class="border dark:border-gray-700 dark:text-gray-300">Score</th>
          <th class="border dark:border-gray-700 dark:text-gray-300">Source</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(fact, index) in topSearchResults" :key="'searchFact' + index">
          <tr class="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-800">
            <td  
              class="border dark:border-gray-700 dark:text-gray-300 p-3">
              {{ fact.fact }}
            </td>
            <td :class="{ 'bg-red-200 dark:bg-red-800 dark:hover:bg-red-700': isScoreLessThanHalfOfTop(fact.score) }"
              class="border dark:border-gray-700 dark:text-gray-300 p-3">
              {{ fact.score }}
            </td>
            <td class="border dark:border-gray-700 dark:text-gray-300 p-3">
              <a :href="'https://mpersona.blob.core.windows.net/' + fact.storageUrl" target="_blank">{{ fact.storageUrl
              }}</a>
            </td>
          </tr>
        </template>

      </tbody>
    </table>
  </template>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import VueMultiselect from 'vue-multiselect'
import { v4 as uuidv4 } from 'uuid';

//Components
import Socket from '@/components/Socket.vue';

//Composables
import { useFacts } from '@/composables/useFacts.js'
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js'
const { factSearchString, searchFacts, factSearchResults } = useFacts()
const { knowledgeProfiles, selectedKnowledgeProfile, getKnowledgeProfiles } = useKnowledgeProfiles()

//Props and Emits
const props = defineProps({
  evaluationSet: { type: Array, default: [] },
  // triggerGeneration: { type: Boolean, default: false }
})
const emit = defineEmits(['triggerSearch', 'deleteEvaluator', 'knowledgeProfilesUpdate'])

let showResults = ref(20);

//Multiselect
const customLabel = (option) => option ? option.name : '';

//Functions
async function triggerSearch() {
  emit("triggerSearch")
}

let topSearchResults = computed(() => {
  return factSearchResults.value.slice(0, showResults.value);
})

const isScoreLessThanHalfOfTop = (score) => {
  if (topSearchResults.value.length === 0) return false;
  return score < (topSearchResults.value[0].score / 2);
};

function handleKnowledgeProfilesUpdate(newValue, index) {
  emit("knowledgeProfilesUpdate", { knowledgeProfiles: newValue, index: index })

}

</script>