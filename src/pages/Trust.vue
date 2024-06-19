<template>
  <div class="m-6">
    <button
      @click="toggleDark()"
      class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
    >
      Dark
    </button>
    <div class="max-w-3xl mx-auto text-center">
      <h1 class="h3 font-red-hat-display mb-4">AI Trust Framework (Concept)</h1>
    </div>

    <h1>Agent 1</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400">Triage the Question</p>

    <div class="flex box border border-radius-6">
      <!-- Column 1, Row 1 -->
      <div class="dark:bg-gray-800 p-4 w-1/3 flex-shrink-0">
        <!-- Slider for number of models -->

        <!-- Textarea for Agent 1 System Prompt -->
        <div>
          <textarea
            v-model="agent0SystemPrompt"
            disabled
            placeholder="Agent 0 System Prompt"
            class="form-textarea bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          ></textarea>
        </div>
        <div>
          <textarea
            v-model="agent0UserPrompt"
            placeholder="Agent 0 User Prompt"
            class="form-textarea bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          ></textarea>
        </div>

        <VueMultiselect
          v-model="agent0Model"
          :options="adminModels"
          :searchable="true"
          :close-on-select="true"
          :custom-label="customLabelModel"
          :show-labels="false"
          placeholder="Pick a model"
        />

        <!-- Buttons for actions -->
        <div class="flex space-x-4">
          <button
            @click="handleGo0"
            class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          >
            Step 0 - Let's Go
          </button>

          <!-- {{ modelsResponsesArray }} -->
        </div>
      </div>

      <!-- Column 2, Row 1 -->
      <div
        class="w-2/3 flex-shrink-0"
        style="overflow-x: auto"
        :class="{
          'bg-red-200 dark:bg-red-800':
            agent0Prompt && agent0Prompt.ranking === 'wrong',
          'bg-green-200 dark:bg-green-800':
            agent0Prompt && agent0Prompt.ranking === 'right',
        }"
      >
        <section class="w-full p-4">
          <!-- Header row with select dropdowns -->

          <Socket
            v-show="false"
            :sessionId="agent0Prompt.sessionId"
            :persona="agent0Prompt.persona"
            :temperature="settings?.temperature || 0.5"
            :messageHistory="agent0Prompt.messages"
            :model="agent0Model"
            :trigger="agent0Prompt.trigger"
            @messageComplete="(payload) => agent0MessagePromptComplete(payload)"
            @messagePartial="(payload) => agent0MessagePromptPartial(payload)"
            @messageError="(payload) => agent0MessagePromptError(payload)"
          >
          </Socket>

          <!-- Model {{ model.modelIndex + 1 }}, Response
                {{ responseIndex + 1 }}<br/> -->
          <div v-show="agent0Prompt?.message">
            {{ agent0Prompt.message }} <br />
          </div>
          <p v-show="agent0Prompt.status !== 'waiting'" class="text-xs">
            {{ agent0Prompt.status }} <br />
          </p>

          <div v-show="agent0Prompt?.status == 'completed'">
            <button
              @click="agent0RankResponse(agent0Prompt, 'right')"
              class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
            >
              Right
            </button>
            <button
              @click="agent0RankResponse(agent0Prompt, 'wrong')"
              class="btn text-white bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 rounded"
            >
              Wrong
            </button>
          </div>
          <!-- JSON: {{ agent0Json }} -->
        </section>
      </div>
    </div>

    <h1>Agent 2</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400">
      Parallel Processing - Multiple Models and Multiple Instances.
    </p>

    <div class="flex box border border-radius-6">
      <!-- Column 1, Row 1 -->
      <div class="dark:bg-gray-800 p-4 w-1/3 flex-shrink-0">
        <!-- Slider for number of models -->
        <div>
          <label
            for="modelsSlider"
            class="block text-gray-700 dark:text-gray-300"
          >
            Number of models: {{ numberOfModels }}
          </label>
          <input
            type="range"
            id="modelsSlider"
            min="1"
            max="6"
            v-model="numberOfModels"
            class="slider"
          />
        </div>
        <!-- Slider for number of responses -->
        <div>
          <label
            for="responsesSlider"
            class="block text-gray-700 dark:text-gray-300"
          >
            Number of responses: {{ numberOfResponses }}
          </label>
          <input
            type="range"
            id="responsesSlider"
            min="1"
            max="100"
            v-model="numberOfResponses"
            class="slider"
          />
        </div>

        <!-- Slider for number of responses -->
        <div>
          <label
            for="responsesSlider"
            class="block text-gray-700 dark:text-gray-300"
          >
            Temperature: {{ settings.temperature }}
          </label>
          <input
            type="range"
            id="responsesSlider"
            min="0"
            max="1"
            step=".1"
            v-model="settings.temperature"
            class="slider"
          />
        </div>

        <!-- Textarea for Agent 1 System Prompt -->
        <div>
          <textarea
            v-model="agent1SystemPrompt"
            placeholder="Agent 1 System Prompt"
            class="form-textarea bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          ></textarea>
        </div>
        <!-- Textarea for Agent 1 User Prompt -->
        <div>
          <textarea
            disabled
            v-model="agent0UserPrompt"
            placeholder="Agent 1 User Prompt"
            class="form-textarea bg-white mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          ></textarea>
        </div>
        <!-- Buttons for actions -->
        <div class="flex space-x-4">
          <button
            @click="handleGo1"
            class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          >
            Step 1 - Let's Go
          </button>
          <button
            @click="handleClear"
            class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          >
            Clear
          </button>

          <!-- {{ modelsResponsesArray }} -->
        </div>
      </div>

      <!-- Column 2, Row 1 -->
      <div
        class="w-2/3 flex-shrink-0 bg-white dark:bg-gray-700"
        style="overflow-x: auto"
      >
        <section class="w-full p-4 bg-white dark:bg-gray-700">
          <!-- Header row with select dropdowns -->
          <div class="grid" :style="headerStyle">
            <div
              v-for="model in modelsResponsesArray"
              :key="'model-header-' + model.modelIndex"
              class="border p-2 min-w-[300px]"
            >
              <VueMultiselect
                v-model="model.model"
                :options="adminModels"
                :searchable="true"
                :close-on-select="true"
                :custom-label="customLabelModel"
                :show-labels="false"
                placeholder="Pick a model"
              />

              <!-- Model {{ model.modelIndex }} -->
            </div>
          </div>

          <!-- Reactive grid based on slider values -->
          <div class="grid" :style="gridStyle">
            <div
              v-for="(model, modelIndex) in modelsResponsesArray"
              :key="'model-' + model.modelIndex"
            >
              <div
                v-for="(response, responseIndex) in model.responses"
                :key="'model-' + model.modelIndex + '-response-' + response"
                class="border p-2 min-w-[300px]"
                :class="{
                  'bg-red-200 dark:bg-red-800':
                    response && response.ranking === 'wrong',
                  'bg-green-200 dark:bg-green-800':
                    response && response.ranking === 'right',
                }"
              >
                <!-- {{ model?.model }} -->

                <Socket
                  v-show="false"
                  :sessionId="response.sessionId"
                  :persona="response.persona"
                  :temperature="settings?.temperature || 0.5"
                  :messageHistory="response.messages"
                  :model="model?.model"
                  :trigger="response.trigger"
                  @messageComplete="
                    (payload) =>
                      agent1MessagePromptComplete(
                        payload,
                        model,
                        modelIndex,
                        response,
                        responseIndex
                      )
                  "
                  @messagePartial="
                    (payload) =>
                      agent1MessagePromptPartial(
                        payload,
                        model,
                        modelIndex,
                        response,
                        responseIndex
                      )
                  "
                  @messageError="
                    (payload) =>
                      agent1MessagePromptError(
                        payload,
                        model,
                        modelIndex,
                        response,
                        responseIndex
                      )
                  "
                >
                </Socket>

                <!-- Model {{ model.modelIndex + 1 }}, Response
                {{ responseIndex + 1 }}<br/> -->
                <div v-show="response?.message">
                  {{ response.message }} <br />
                </div>
                <p v-show="response.status !== 'waiting'" class="text-xs">
                  {{ response.status }} <br />
                </p>

                <div v-show="response?.status == 'completed'">
                  <button
                    @click="agent1RankResponse(response, 'right')"
                    class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
                  >
                    Right
                  </button>
                  <button
                    @click="agent1RankResponse(response, 'wrong')"
                    class="btn text-white bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 rounded"
                  >
                    Wrong
                  </button>
                </div>
              </div>

              <div>
                <button
                  @click="agent1RankAllResponses(model, 'right')"
                  class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
                >
                  All Right
                </button>
                <button
                  @click="agent1RankAllResponses(model, 'wrong')"
                  class="btn text-white bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 rounded"
                >
                  All Wrong
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>

    <h1>Agent 3</h1>
    <p class="text-xl text-gray-600 dark:text-gray-400">
      Identify Unique Answers / Select Majority / Flag for Human Review.
    </p>

    <div class="flex box border border-radius-6">
      <!-- Column 1, Row 1 -->
      <div class="dark:bg-gray-800 p-4 w-1/3 flex-shrink-0">
        <!-- Slider for number of models -->

        <!-- Textarea for Agent 1 System Prompt -->
        <div>
          <textarea
            v-model="agent2SystemPrompt"
            disabled
            placeholder="Agent 2 System Prompt"
            class="form-textarea mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          ></textarea>
        </div>
        <!-- Textarea for Agent 1 User Prompt -->
        <!-- Buttons for actions -->
        <div class="flex space-x-4">
          <button
            @click="handleGo2"
            class="btn text-white bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded"
          >
            Step 2 - Let's Go
          </button>

          <!-- {{ modelsResponsesArray }} -->
        </div>
      </div>

      <!-- Column 2, Row 1 -->
      <div
        class="w-2/3 flex-shrink-0 dark:bg-gray-700"
        style="overflow-x: auto"
      >
        <section class="w-full p-4 dark:bg-gray-700">
          <!-- Header row with select dropdowns -->
          <div class="grid" :style="headerStyle">
            <div
              v-for="(model, modelIndex) in modelsResponsesArray"
              :key="'model-header-' + model.modelIndex"
              class="border p-2 min-w-[300px]"
              :class="{
                'bg-red-200 dark:bg-red-800':
                  agent2UserPrompts[modelIndex] &&
                  agent2UserPrompts[modelIndex].ranking === 'wrong',
                'bg-green-200 dark:bg-green-800':
                  agent2UserPrompts[modelIndex] &&
                  agent2UserPrompts[modelIndex].ranking === 'right',
              }"
            >
              Model: {{ model?.model?.name.en }} ({{
                agent2UserPrompts[modelIndex]?.trigger
              }})

              <div
                v-if="agent2UserPrompts[modelIndex] && agent1Complete == true"
              >
                <!-- {{ agent2UserPrompts[modelIndex] }} -->
                <Socket
                  v-show="false"
                  :sessionId="agent2UserPrompts[modelIndex].sessionId"
                  :persona="agent2UserPrompts[modelIndex].persona"
                  :temperature="settings?.temperature || 0.5"
                  :messageHistory="agent2UserPrompts[modelIndex].messages"
                  :model="model?.model"
                  :trigger="agent2UserPrompts[modelIndex].trigger"
                  @messageComplete="
                    (payload) =>
                      agent2MessagePromptComplete(payload, model, modelIndex)
                  "
                  @messagePartial="
                    (payload) =>
                      agent2MessagePromptPartial(payload, model, modelIndex)
                  "
                  @messageError="
                    (payload) =>
                      agent2MessagePromptError(payload, model, modelIndex)
                  "
                >
                </Socket>

                <div v-show="agent2UserPrompts[modelIndex]?.message">
                  {{ agent2UserPrompts[modelIndex].message }} <br />
                </div>
                <p
                  v-show="agent2UserPrompts[modelIndex].status !== 'waiting'"
                  class="text-xs"
                >
                  {{ agent2UserPrompts[modelIndex].status }} <br />
                </p>

                <div
                  v-show="agent2UserPrompts[modelIndex]?.status == 'completed'"
                >
                  <button
                    @click="
                      agent2RankResponse(agent2UserPrompts[modelIndex], 'right')
                    "
                    class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
                  >
                    Right
                  </button>
                  <button
                    @click="
                      agent2RankResponse(agent2UserPrompts[modelIndex], 'wrong')
                    "
                    class="btn text-white bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 rounded"
                  >
                    Wrong
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Reactive grid based on slider values -->
        </section>
      </div>
    </div>

    <button
      @click="saveResults()"
      class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
    >
      Save Results from Step 1 and 2
    </button>

    <button
      @click="clearResults()"
      class="btn text-white bg-yellow-500 hover:bg-yellow-400 text-white font-bold py-2 px-4 m-2 rounded"
    >
      Clear Results
    </button>

    <div class="flex box border border-radius-6">
      Agent 1 Correct: {{ (agent1Correct * 100).toFixed(2) }}<br />
      Agent 2 Correct: {{ (agent2Correct * 100).toFixed(2) }}
      <table class="table striped full-width w-full">
        <thead>
          <tr>
            <th scope="col">Result</th>
            <th scope="col">Ranking</th>
            <th scope="col">Message</th>
            <th scope="col">Modify</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(answer, answerIndex) in agent1Table"
            :key="'answer-' + answerIndex"
            :class="{
              'bg-red-200 dark:bg-red-800':
                answer && answer.ranking === 'wrong',
              'bg-green-200 dark:bg-green-800':
                answer && answer.ranking === 'right',
            }"
          >
            <td>{{ answerIndex + 1 }}</td>
            <td>{{ answer.ranking }}</td>
            <td>{{ answer.message }}</td>
            <td>
              <button
                @click="
                  agent1RankResponse(answer, 'right');
                  updateStats();
                "
                class="btn text-white bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 m-2 rounded"
              >
                Right
              </button>
              <button
                @click="
                  agent1RankResponse(answer, 'wrong');
                  updateStats();
                "
                class="btn text-white bg-red-500 hover:bg-red-400 text-white font-bold py-2 px-4 m-2 rounded"
              >
                Wrong
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  {{ agent2Table }}
  <!-- {{ agent2UserPrompts }} -->
  <!-- {{ modelsResponsesArray }} -->

  <!-- {{ agent2UserPrompts }} -->
</template>

<script setup>
import { ref, computed, watchEffect, onMounted, watch } from "vue";
import VueMultiselect from "vue-multiselect";
import { v4 as uuidv4 } from "uuid";
import Socket from "@/components/Socket.vue";

import { extractData } from "@/utils/extractJsonAndCode.js";

//Load the models from the Composable
import { useModels } from "@/composables/useModels.js";
const { adminModels, selectedModel } = useModels();
const customLabelModel = (option) => (option ? option.name.en : "");

const numberOfModels = ref(1);
const numberOfResponses = ref(25);
const modelsResponsesArray = ref([]);

/*
Present the results in this format
  {algebraicAnswer:"", reasoning:"", counterpoint:""}.
  {reasoning:"", counterpoint:"", algebraicAnswer:""}.

*/

/*
Alice has N brothers and M sisters.
Alice is one of the siblings in the family.
Alice's brother would count all of Alice's sisters as his sisters.
Alice herself should also be counted as one of her brother's sisters.
Given these points, how many sisters does Alice’s brother have?
*/

//Determine what we are talking about
//Route the question type into the system prompt based onthe structured response
const agent0QuestionTypes = ref([
  "logicAlgorithmic",
  "guidance",
  "information",
  "educational",
]);
const agent0SystemPrompt = computed(() => {
  return `What kind of question is this? Answer in JSON format only. {questionType:enum of [${agent0QuestionTypes.value}]}`;
});
const agent0UserPrompt = ref(
  `Alice has N brothers and she also has M sisters. How many sisters does Alice's brother have?`
);

let agent0Prompt = ref({
  status: "waiting",
  persona: null,
  messages: computed(() => {
    return [
      { role: "system", content: agent0SystemPrompt.value },
      { role: "user", content: agent0UserPrompt.value },
    ];
  }),
  sessionId: uuidv4(),
  trigger: false,
  message: null,
  json: null,
  ranking: null,
});

const agent0Json = ref({});
const agent0Complete = ref(false);
const agent0Model = ref(null);

//Agent 1 - Pick a system prompt from this one
const agent1SystemPrompts = ref({
  logicAlgorithmic: `Format {algebraicAnswer:""}. Say nothing else.`,
  guidance: `Please provide guidance to this question in as clear a fashion as possible. Reiterate in simple terms what is being asked, and then provide a bulleted list of guidance.`,
  information: `Present any known information on the topic. Break down the response into header, brief text, and bulleted facts relevant to what is being discussed.`,
  educational: `You are a coach guiding someone through understanding on the topic they are asking about. Present the information simply and with a clear structure, progressing from foundational ideas onward.`,
});
const agent1SystemPrompt = ref();
// const agent1UserPrompt = ref(`Alice has N brothers and she also has M sisters. How many sisters does Alice's brother have?`);
const agent1Complete = ref(false);
const agent1Table = ref([]);
const agent1Correct = ref(0);

//Agent 2 - Find the concensus
const agent2Complete = ref(false);
const agent2Table = ref([]);
const agent2Correct = ref(0);
const agent2SystemPrompt = computed(() => {
  return `{
  uniqueAnswers:[] an array of unique answers,
  majorityAnswer: as a string or Object,
  flagForHumanReview: true if there is more than a 20% discrepancy between the quantity of different unique answers}`;
});
const agent2UserPrompts = ref([]);

//Agent 3 - Challenge Function
const agent3Complete = ref(false);

const settings = ref({ temperature: 0.2 });

watchEffect(() => {
  let newModelsResponses = [];

  for (let modelIndex = 0; modelIndex < numberOfModels.value; modelIndex++) {
    let existingModel = modelsResponsesArray.value[modelIndex];
    let responses = [];
    let model = existingModel ? existingModel.model : null; // Preserve existing model if available

    for (
      let responseIndex = 0;
      responseIndex < numberOfResponses.value;
      responseIndex++
    ) {
      if (
        existingModel &&
        existingModel.responses &&
        responseIndex < existingModel.responses.length
      ) {
        // Preserve existing response
        responses.push(existingModel.responses[responseIndex]);
      } else {
        // Initialize new response

        let defaultPrompt = {
          status: "waiting",
          persona: null,
          messages: computed(() => {
            return [
              { role: "system", content: agent1SystemPrompt.value },
              { role: "user", content: agent0UserPrompt.value },
            ];
          }),
          sessionId: uuidv4(),
          trigger: false,
          message: null,
          json: null,
          ranking: null,
        };

        // let newResponse = {

        //   sessionId: uuidv4(),

        // };

        responses.push(defaultPrompt);
      }
    }

    newModelsResponses.push({
      modelIndex: modelIndex,
      responses,
      model,
    });
  }

  modelsResponsesArray.value = newModelsResponses;
});

onMounted(() => {
  document.querySelector("html").classList.remove("dark");
});

const headerStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${numberOfModels.value}, minmax(300px, 1fr))`,
  gap: ".5rem",
}));

const gridStyle = computed(() => ({
  display: "grid",
  gridTemplateColumns: `repeat(${numberOfModels.value}, minmax(300px, 1fr))`,
  gridAutoRows: "minmax(50px, auto)",
  gap: ".5rem",
}));

function toggleDark() {
  if (document.querySelector("html").classList.contains("dark")) {
    document.querySelector("html").classList.remove("dark");
  } else {
    document.querySelector("html").classList.add("dark");
  }
}

function handleGo0() {
  // Logic for "Let's Go" button

  agent0Complete.value = false;
  agent0Prompt.value.ranking = null;
  agent0Prompt.value.trigger = !agent0Prompt.value.trigger;
  agent0Prompt.value.status = "running";
}

function handleGo1() {
  // Logic for "Let's Go" button

  agent1Complete.value = false;
  resetResponses();
  processHandleGo1();

  //See if they are all done. If so, mark as complete
  //agent1Complete triggers agent2 preparation
  let total = 0;
  let completed = 0;
  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    total += modelsResponsesArray.value[a].responses.length;
    completed = modelsResponsesArray.value[a].responses.filter((response) => {
      return response.status === "completed";
    }).length;
  }
  if (total == completed) agent1Complete.value = true;
}

function resetResponses()
{
  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    for (let b = 0; b < modelsResponsesArray.value[a].responses.length; b++) {
      modelsResponsesArray.value[a].responses[b].status = 'waiting';
    }
  }
}
function processHandleGo1() {
  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    for (let b = 0; b < modelsResponsesArray.value[a].responses.length; b++) {
      let running = modelsResponsesArray.value[a].responses.filter(
        (response) => {
          return response.status === "running";
        }
      ).length;

      if (
        running < modelsResponsesArray.value[a].model.concurrentInstances &&
        modelsResponsesArray.value[a].responses[b].status !== "running" &&
        modelsResponsesArray.value[a].responses[b].status !== "completed"
      ) {
        running++;
        modelsResponsesArray.value[a].responses[b].ranking = null;
        modelsResponsesArray.value[a].responses[b].trigger =
          !modelsResponsesArray.value[a].responses[b].trigger;

        modelsResponsesArray.value[a].responses[b].status = "running";
      }
    }
  }
}

function handleGo2() {
  agent2Complete.value = false;

  for (let a = 0; a < agent2UserPrompts.value.length; a++) {
    agent2UserPrompts.value[a].ranking = null;
    agent2UserPrompts.value[a].status = "running";
    agent2UserPrompts.value[a].trigger = !agent2UserPrompts.value[a].trigger;
  }
}

function handleClear() {
  numberOfModels.value = 1;
  numberOfResponses.value = 1;
  agent1SystemPrompt.value = "";
  agent0UserPrompt.value = "";

  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    for (let b = 0; b < modelsResponsesArray.value[a].responses.length; b++) {
      modelsResponsesArray.value[a].responses[b].ranking = null;
      modelsResponsesArray.value[a].responses[b].status = "waiting";
    }
  }
}

function agent0RankResponse(response, ranking) {
  response.ranking = ranking;
}

function agent1RankResponse(response, ranking) {
  response.ranking = ranking;
}

function agent1RankAllResponses(model, ranking) {
  for (var a = 0; a < model.responses.length; a++) {
    model.responses[a].ranking = ranking;
  }
}

function agent2RankResponse(response, ranking) {
  response.ranking = ranking;
}

function agent0MessagePromptComplete(payload) {
  if (payload?.message?.length) {
    agent0Prompt.value.message = payload.message;
    agent0Prompt.value.status = "completed";
  }
  agent0Complete.value = true;

  agent0Json.value = extractData(agent0Prompt.value.message);
  if (
    agent0Json?.value?.json?.[0]?.questionType &&
    agent1SystemPrompts.value[agent0Json.value.json[0].questionType]
  ) {
    agent1SystemPrompt.value =
      agent1SystemPrompts.value[agent0Json.value.json[0].questionType];
  }
}

function agent0MessagePromptPartial(payload) {
  if (payload?.message?.length) {
    agent0Prompt.value.message = payload.message;
  }
}

function agent0MessagePromptError(payload) {}

function agent1MessagePromptComplete(
  payload,
  model,
  modelIndex,
  response,
  responseIndex
) {
  if (payload?.message?.length) {
    response.message = payload.message;
    response.status = "completed";
  }

  //Check to see if the last one is complete

  let allDone = true;
  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    for (let b = 0; b < modelsResponsesArray.value[a].responses.length; b++) {
      if (modelsResponsesArray.value[a].responses[b].status !== "completed")
        allDone = false;
    }
  }
  agent1Complete.value = allDone;

  //Check to see if there are any more to process
  processHandleGo1();
}

// Set up the watcher
watch(agent1Complete, (newValue, oldValue) => {
  if (newValue === true) {
    agent2UserPrompts.value = [];
    for (var a = 0; a < numberOfModels.value; a++) {
      let defaultPrompt = {
        status: "waiting",
        persona: null,
        messages: [
          { role: "system", content: agent2SystemPrompt.value },
          {
            role: "user",
            content: `
       This question was asked:
        ${JSON.stringify(modelsResponsesArray.value[a].responses)}
        Provide the correct answer from the availalbe responses.
        `,
          },
        ],

        sessionId: uuidv4(),
        trigger: false,
        message: null,
        json: null,
        ranking: null,
      };

      agent2UserPrompts.value.push(defaultPrompt);
    }
  }
});

function agent1MessagePromptPartial(
  payload,
  model,
  modelIndex,
  response,
  responseIndex
) {
  if (payload?.message?.length) {
    response.message = payload.message;
  }
}

function agent1MessagePromptError(
  payload,
  model,
  modelIndex,
  response,
  responseIndex
) {
  if (payload?.message?.length) {
    response.message = null;
    response.status = "error";
  }
}

function agent2MessagePromptComplete(payload, model, modelIndex) {
  if (payload?.message?.length) {
    agent2UserPrompts.value[modelIndex].message = payload.message;
  }
  agent2UserPrompts.value[modelIndex].status = "completed";
  let allDone = true;
  for (let a = 0; a < agent2UserPrompts.value.length; a++) {
    if (modelsResponsesArray.value[a].status !== "completed") allDone = false;
  }
  agent2Complete.value = allDone;
}

function agent2MessagePromptPartial(payload, model, modelIndex) {
  if (payload?.message?.length) {
    agent2UserPrompts.value[modelIndex].message = payload.message;
  }
}

function agent2MessagePromptError(payload, model, modelIndex) {
  if (payload?.message?.length) {
    agent2UserPrompts.value[modelIndex].message = null;
    agent2UserPrompts.value[modelIndex].status = "error";
  }
}

function saveResults() {
  for (let a = 0; a < modelsResponsesArray.value.length; a++) {
    for (let b = 0; b < modelsResponsesArray.value[a].responses.length; b++) {
      agent1Table.value.push(
        JSON.parse(JSON.stringify(modelsResponsesArray.value[a].responses[b]))
      );
    }
  }

  for (let a = 0; a < agent2UserPrompts.value.length; a++) {
    agent2Table.value.push(
      JSON.parse(JSON.stringify(agent2UserPrompts.value[a]))
    );
    //  console.log("agent2UserPrompts.value[a]", agent2UserPrompts.value[a])
  }

  updateStats();
}

function updateStats() {
  agent1Correct.value =
    agent1Table.value.filter((response) => response.ranking === "right")
      .length / agent1Table.value.length;
  agent2Correct.value =
    agent2Table.value.filter((response) => response.ranking === "right")
      .length / agent2Table.value.length;
}

function clearResults() {
  agent1Table.value = [];
  agent1Correct.value = 0;
  agent2Table.value = [];
  agent2Correct.value = 0;
}
</script>

<style scoped>
/* Slider styles */
.slider {
  -webkit-appearance: none;
  width: 100%;
  height: 2px;
  background: #ddd;
  outline: none;
  opacity: 0.7;
  transition: opacity 0.2s;
  border-radius: 5px;
  margin-bottom: 1rem;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  background: #4caf50;
  cursor: pointer;
  border-radius: 50%;
}

.slider::-moz-range-thumb {
  width: 20px;
  height: 20px;
  background: #4caf50;
  cursor: pointer;
  border-radius: 50%;
}

/* Textarea styles */
.form-textarea {
  width: 100%;
  min-height: 100px;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem; /* Rounded from Tailwind */
  background-color: #fff;
  color: #111;
}
/* 
.dark\:bg-gray-700 {
  background-color: #2d3748;
}

.dark\:border-gray-600 {
  border-color: #4a5568;
}

.dark\:placeholder-gray-400::placeholder {
  color: #a0aec0;
}

.dark\:text-white {
  color: #fff;
} */
</style>
