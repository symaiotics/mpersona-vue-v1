<template class = "bg-white dark:bg-gray-800">
  <div class="w-full h-20">
    <Header />

  </div>


  <div class="bg-gray-100  dark:bg-gray-900 min-h-screen lg:p-2">
    <div class=" mx-auto bg-white dark:bg-gray-800 lg:p-8 rounded shadow-lg">

      <div class="flex flex-box w-full justify-center ">
        <section class="w-11/12">
          <h1 v-if="selectedRoster"
            class="font-lato font-bold text-3xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
            {{ selectedRoster.name }} </h1>

          <section class="mb-2">
            <p v-if="selectedRoster" class="font-lato text-1xl.5 mt-1 mb-1 pb-1 ">
              {{ selectedRoster.description.en }}
            </p>
          </section>
        </section>
      </div>

      <div class="flex justify-center ">
        <div class=" w-11/12">
          <section class="mb-6 w-full">
            <Tabs :tabs="tabs" v-model="activeTab">
              <template v-slot:tab-0>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                  Personas
                </h2>
                <p>These Personas will be supporting your RE support process.</p>


                <div v-if="selectedRoster">
                  <div class="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <template v-for="(persona, index) in selectedRoster.personas" :key="persona.uuid">
                      <div class="pl-6 pr-6">
                        <DisplayPersona :persona="persona" alignment="center" />
                        <!--@click="selectPersona(persona, index)"-->
                      </div>
                    </template>
                  </div>


                  <h2 v-if="selectedRoster"
                    class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                    Assignments
                  </h2>
                  <p> The following assignments must be set for the app to use the correct Personas and operate properly.
                  </p>

                  <AssignmentsTable :assignmentList="wrappAssignments" :personas="selectedRoster.personas"
                    :wrappUuid="wrappUuid" :rosterUuid="props.rosterUuid" />

                  <h2 v-if="selectedRoster"
                    class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight mb-2">
                    Models
                  </h2>
                  <p> Select the AI model for this session.
                  </p>

                  <VueMultiselect v-model="selectedModel" :options="adminModels" :searchable="true"
                    :close-on-select="true" :custom-label="customLabelModel" :show-labels="false"
                    placeholder="Pick a model" />


                  <div class="w-96 whitespace-nowrap self-start ">
                    <label>Temperature</label>
                    <VueSlider :modelValue="settings.temperature"
                      @update:modelValue="value => updateSettings('temperature', value)" :min="0" :max="2"
                      :interval="0.1" />
                  </div>


                </div>
              </template>


              <template v-slot:tab-1>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Define your Knowledge Sets
                </h2>
                <p>Knowledge Sets are comprehensive collections of Categories, Tags, Documents, Segments, Mappings, and
                  Artifacts.</p>
                <p>Define and share Knowledge Sets for yourself and your team.</p>

                <div class="space-x-2">
                  <button @click="addNewKnowledgeSet"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-2 rounded w-auto">
                    {{ L_('New Knowledge Set') }}
                  </button>
                  <button @click="refreshKnowledgeSets"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold  p-2 rounded w-auto">
                    {{ L_('Reload') }}
                  </button>
                </div>
                <KnowledgeSetCreateEdit :wrappUuid="wrappUuid" :rosterUuid="props.rosterUuid" />
                <KnowledgeSetCards v-if="knowledgeSets" :data="knowledgeSets" :rosterUuid='props.rosterUuid'
                  @selected="knowledgeSetSelected" />



              </template>

              <!-- Removed categories - too many steps -->
              <template v-slot:tab-2>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Categories
                </h2>
                <p>Categories are used to define the key topics within your Knowledge Sets, enabling the AI to understand
                  how your prompts and knowledge relate</p>

                <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="addNewCategory">
                  Add Category
                </button>

                <CategoryCreateEdit :knowledgeSetUuid="selectedKnowledgeSet.uuid" />
                <CategoryTable :data="categories" @check="checkCategories" @edit="editCategories" />



                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Document Tags
                </h2>
                <p>Tags are used to group and classify Documents. They allow you and the AI to search and identify the
                  purpose of each file. </p>

                <button class="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  @click="addNewTag">
                  Add Tag
                </button>

                <TagCreateEdit :knowledgeSetUuid="selectedKnowledgeSet.uuid" />
                <TagTable :data="tags" @check="checkTags" @edit="editTags" />

              </template>

              <template v-slot:tab-3>


                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Documents
                </h2>
                <p>Documents are text-based files used by language model AIs to gain deep understanding around your
                  policies and practices.</p>

                <div v-for="(prompt, index) in prompts.documents.set" :key="'documentPrompt' + prompt.sessionId">
                  <!-- {{ prompt }} -->
                  <Socket v-show="false" :sessionId="prompt.sessionId" :persona="prompt.persona"
                    :temperature="settings.temperature" :userPrompt="prompt.adaptedPrompt" :model="selectedModel"
                    :trigger="prompt.trigger" @messageComplete="payload => messagePromptComplete(payload, prompt)"
                    @messagePartial="payload => messagePromptPartial(payload, prompt)"
                    @messageError="payload => messagePromptError(payload, prompt)">
                  </Socket>
                </div>

                <DocumentDragAndDrop @documentsChanged="documentsPendingChanged" />
                <h3 v-if="documentsPending?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Pending Documents
                </h3>

                <div v-if="documentsPending?.length" class="flex space-x-2">
                  <button @click="documentsPendingToggleCheckAll"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Toggle Select') }}
                  </button>

                  <button @click="documentsPendingProcessCheckedFiles"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Process Checked Files') }}
                  </button>

                  <button @click="documentsPendingSaveCheckedFiles"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Save Checked to Knowledge Set') }}
                  </button>

                  <div class="w-96 whitespace-nowrap self-start ">
                    <label>AI Instances</label>
                    <VueSlider :modelValue="promptMax" @update:modelValue="value => updatePromptMax(value)" :min="1"
                      :max="10" />
                  </div>
                </div>

                <div class="flex flex-wrap">
                  <div v-if="documentsPending?.length" :class="selectedDocumentPending ? 'w-2/3' : 'w-full'" class="  ">
                    <DocumentTable :documents="documentsPending" @edit="documentsPendingSelectToEdit"
                      @checked="payload => documentsCheck(documentsPending, payload)" />
                  </div>

                  <div v-if="selectedDocumentPending" class="w-full md:w-1/3 ">
                    <DocumentCreateEdit v-model="selectedDocumentPending" @close="selectedDocumentPending = null" />
                  </div>
                </div>

                <h3 v-if="documents?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Uploaded Documents
                </h3>


                <div v-if="documents?.length" class="flex space-x-2">
                  <button @click="documentsToggleCheckAll"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Toggle Select') }}
                  </button>

                  <button @click="documentsSelectToSegment"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Segment Selected') }}
                  </button>

                  <button @click="documentsAddTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Add Tags') }}
                  </button>

                  <button @click="documentsRemoveTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Remove Tags') }}
                  </button>

                  <div class="mt-2" v-if="tags?.length">
                    <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true"
                      track-by="uuid" :close-on-select="false" :custom-label="customLabelTag" :show-labels="false"
                      @remove="removeTag" placeholder="Select tags" />
                  </div>

                  <button v-if="!applyFilter" @click="applyFilter = true"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Apply Filters') }}
                  </button>
                  <button v-if="applyFilter" @click="applyFilter = false"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Filters') }}
                  </button>


                </div>


                <div class="flex flex-wrap">
                  <div v-if="documents?.length && !documentsForSegments?.length"
                    :class="selectedDocument ? 'w-2/3' : 'w-full'" class="  ">
                    <DocumentTable :documents="documentsFiltered" :showTags="true" @edit="documentsSelectToEdit"
                      @checked="payload => documentsCheck(documentsFiltered, payload)" @view="documentsSelectToView" />
                  </div>

                  <div v-if="selectedDocument && !documentsForSegments?.length && !documentViewContent"
                    class="w-full md:w-1/3 ">
                    <DocumentCreateEdit v-model="selectedDocument" @close="selectedDocument = null" />
                  </div>




                  <div v-if="documents?.length && selectedDocument && documentViewContent"
                    :class="selectedDocument ? 'w-1/3' : 'w-full'" class="  ">
                    <button @click="documentViewContent = false; selectedDocument = null"
                      class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Close View') }}
                    </button>


                    <DivInput v-model="selectedDocument.htmlContent" :asPlainText="false" />
                  </div>



                </div>




                <div v-for="(prompt, index) in prompts.segments.set" :key="'segmentPrompt' + prompt.sessionId">
                  <!-- {{ prompt }} -->
                  <Socket v-show="false" :sessionId="prompt.sessionId" :persona="prompt.persona"
                    :temperature="settings.temperature" :userPrompt="prompt.adaptedPrompt" :model="selectedModel"
                    :trigger="prompt.trigger" @messageComplete="payload => messagePromptComplete(payload, prompt)"
                    @messagePartial="payload => messagePromptPartial(payload, prompt)"
                    @messageError="payload => messagePromptError(payload, prompt)">
                  </Socket>
                </div>

                <!-- Segment Selection-->


                <div v-if="documentsForSegments?.length">
                  <button @click="documentsForSegments = null"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Pending Segments') }}
                  </button>
                </div>


                <!-- Segmemnts-->
                <div v-for="(doc, index) in documentsForSegments" :key="'docToSegment' + index">
                  <h3 class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                    {{ L_('Document') }} {{ index + 1 }}
                  </h3>
                  <DivInput v-if="doc._plainText" placeholder="Segment your document" v-model="doc.textContent"
                    :asPlainText="true" :setMarker="true" @setMarkers="payload => segmentSetMarkers(payload, doc)">
                    <label class="label-style whitespace-nowrap">
                      <input type="checkbox" v-model="doc._plainText"
                        class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      {{ L_('Plain Text') }}
                    </label>
                  </DivInput>
                  <DivInput v-else placeholder="Segment your document" v-model="doc.htmlContent" :asPlainText="false"
                    :setMarker="true" @setMarkers="payload => segmentSetMarkers(payload, doc)">
                    <label class="label-style whitespace-nowrap">
                      <input type="checkbox" v-model="doc._plainText"
                        class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                      {{ L_('Plain Text') }}
                    </label>
                  </DivInput>


                  <div v-if="doc._segments.length" class="flex space-x-2">
                    <button @click="segmentsPendingToggleCheckAll(doc)"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Toggle Select') }}
                    </button>

                    <button @click="segmentsPendingProcessChecked(doc)"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Process Checked Segments') }}
                    </button>

                    <button @click="segmentsPendingSaveChecked(doc)"
                      class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Save Checked Segments to Knowledge Set') }}
                    </button>

                    <div class="w-96 whitespace-nowrap self-start ">
                      <label>AI Instances</label>
                      <VueSlider :modelValue="promptMax" @update:modelValue="value => updatePromptMax(value)" :min="1"
                        :max="10" />
                    </div>
                  </div>

                  <!-- {{ doc._segments }} -->
                  <SegmentsPendingTable :data="doc._segments" :fullText="doc.textContent" :fullHtml="doc.htmlContent"
                    @remove="index => removePendingSegment(index, doc)" />



                </div>


                <!-- <div v-for = "(document, index) in documentsPending" :key = "'document' + index">
                {{ document.original }}
                </div>  -->
                <!-- {{ documentsPending }} -->

              </template>
              <template v-slot:tab-4>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Segments
                </h2>
                <p>Segments are extracts from documents which focus in on key reusable topics. They are further analyzed
                  by AI to determine their key concepts and content.</p>

                <div class="space-x-2">

                  <button @click="segmentsAddTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Add Tags') }}
                  </button>

                  <button @click="segmentsRemoveTags"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Remove Tags') }}
                  </button>

                  <button v-if="!applySegmentFilter" @click="applySegmentFilter = true"
                    class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Apply Filters') }}
                  </button>
                  <button v-if="applySegmentFilter" @click="applySegmentFilter = false"
                    class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Clear Filters') }}
                  </button>



                </div>

                <div class="mt-2" v-if="tags?.length">
                  <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true" track-by="uuid"
                    :close-on-select="false" :custom-label="customLabelTag" :show-labels="false" @remove="removeTag"
                    placeholder="Select tags" />
                </div>

                <div class="flex flex-wrap">
                  <div v-if="segments?.length" :class="selectedSegment ? 'w-2/3' : 'w-full'" class="  ">
                    <SegmentsTable :data="segmentsFiltered" :showTags="true" @edit="segmentsSelectToEdit"
                      @view="segmentsSelectToView" @checked="payload => segmentsCheck(segmentsFiltered, payload)" />
                  </div>

                  <div v-if="segments?.length && selectedSegment && !segmentViewContent"
                    :class="selectedSegment ? 'w-1/3' : 'w-full'" class="  ">
                    <SegmentCreateEdit v-model="selectedSegment" @close="selectedSegment = null"
                      @update="eventUpdateSegment" />
                  </div>

                  <div v-if="segments?.length && selectedSegment && segmentViewContent"
                    :class="selectedSegment ? 'w-1/3' : 'w-full'" class="  ">
                    <button @click="segmentViewContent = false; selectedSegment = null"
                      class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Close View') }}
                    </button>


                    <DivInput v-model="selectedSegment.htmlContent" :asPlainText="false" />
                  </div>

                </div>
                <!-- {{ segments }} -->




              </template>
              <template v-slot:tab-5>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Mappings
                </h2>
                <p>Mappings are collections of Documents and Segments which may be grouped together as a package of
                  information to serve as AI reference materials.</p>
              </template>
              <template v-slot:tab-6>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Interact
                </h2>
                <p>Interact to build comprehensive AI-enabled Artifacts.</p>
                <p>You can interact in Q&A Mode, with an automatic Audit function, or you can use Chat Mode and speak to
                  the persona directly.</p>

                <div class="">
                  <input type="checkbox" v-model="isChatMode" @change="chatModeToggle"
                    class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                  {{ L_('Chat Mode') }}
                </div>


                <!-- <ToggleSwitch v-model = "isChatMode"/> -->

                <div v-show="false">
                  <Socket :sessionId="prompts.triage.sessionId" :persona="prompts.triage.persona"
                    :temperature="settings.temperature" :userPrompt="prompts.triage.adaptedPrompt"
                    :messageHistory="prompts.triage.messageHistory" :model="selectedModel"
                    :trigger="prompts.triage.trigger"
                    @messageComplete="payload => messagePromptComplete(payload, prompts.triage)"
                    @messagePartial="payload => messagePromptPartial(payload, prompts.triage)"
                    @messageError="payload => messagePromptError(payload, prompts.triage)" />


                  <DivInput placeholder="Triage results" v-model="prompts.triage.message" :asPlainText="true" />

                  <Socket :sessionId="prompts.reference.sessionId" :persona="prompts.reference.persona"
                    :temperature="settings.temperature" :userPrompt="prompts.reference.adaptedPrompt"
                    :messageHistory="prompts.reference.messageHistory" :model="selectedModel"
                    :trigger="prompts.reference.trigger"
                    @messageComplete="payload => messagePromptComplete(payload, prompts.reference)"
                    @messagePartial="payload => messagePromptPartial(payload, prompts.reference)"
                    @messageError="payload => messagePromptError(payload, prompts.reference)" />

                  <DivInput placeholder="Reference results" v-model="prompts.reference.message" :asPlainText="true" />

                </div>

                <!-- if Multiple questions -->
                <div v-for="(prompt, index) in prompts.questions.set" :key="'questions' + prompt.sessionId">
                  <Socket v-show="false" :sessionId="prompt.sessionId" :persona="prompt.persona"
                    :temperature="settings.temperature" :messageHistory="prompt.messageHistory" :model="selectedModel"
                    :trigger="prompt.trigger" @messageComplete="payload => messagePromptComplete(payload, prompt)"
                    @messagePartial="payload => messagePromptPartial(payload, prompt)"
                    @messageError="payload => messagePromptError(payload, prompt)">
                  </Socket>
                </div>

                <!-- Previous, if single questions -->
                <Socket v-show="false" :sessionId="prompts.question.sessionId" :persona="prompts.question.persona"
                  :temperature="settings.temperature" :userPrompt="prompts.question.adaptedPrompt"
                  :messageHistory="prompts.question.messageHistory" :model="selectedModel"
                  :trigger="prompts.question.trigger"
                  @messageComplete="payload => messagePromptComplete(payload, prompts.question)"
                  @messagePartial="payload => messagePromptPartial(payload, prompts.question)"
                  @messageError="payload => messagePromptError(payload, prompts.question)">
                </Socket>

                <Socket v-show="false" :sessionId="prompts.answer.sessionId" :persona="prompts.answer.persona"
                  :temperature="settings.temperature" :messageHistory="prompts.answer.messageHistory"
                  :model="selectedModel" :trigger="prompts.answer.trigger"
                  @messageComplete="payload => messagePromptComplete(payload, prompts.answer)"
                  @messagePartial="payload => messagePromptPartial(payload, prompts.answer)"
                  @messageError="payload => messagePromptError(payload, prompts.answer)">
                </Socket>


                <Socket v-show="false" :sessionId="prompts.audit.sessionId" :persona="prompts.audit.persona"
                  :temperature="settings.temperature" :userPrompt="prompts.audit.adaptedPrompt"
                  :messageHistory="prompts.audit.messageHistory" :model="selectedModel" :trigger="prompts.audit.trigger"
                  @messageComplete="payload => messagePromptComplete(payload, prompts.audit)"
                  @messagePartial="payload => messagePromptPartial(payload, prompts.audit)"
                  @messageError="payload => messagePromptError(payload, prompts.audit)">
                </Socket>


                <div v-if="!isChatMode">
                  <h3 class="font-lato font-bold text-2xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                    Step 1: Define and Triage Your Input
                  </h3>



                  <DivInput placeholder="Enter your complex question" v-model="prompts.questions.prompt"
                    :asPlainText="true" />
                  Size of checked Documents and Segments: {{ calculateSizeOfChecked.formattedLength }} ({{
                    calculateSizeOfChecked.formattedPercentage }})<br />
                  <span class="font-bold" v-if="calculateSizeOfChecked.totalLength > 400000">This will likely cause an
                    error. Too much context.</span>
                </div>


                <div class="flex space-x-2">

                  <!-- <button @click="questionWithReferences"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                    {{ L_('Prompt') }}
                  </button> -->

                  <button @click="triageWithReferences" v-if="!isChatMode"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                    :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': triageInProgress }"
                    :disabled="triageInProgress">
                    {{ L_('Triage') }}
                  </button>

                  <button @click="selectReferences" v-if="!isChatMode"
                    class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                    :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': referenceInProgress }"
                    :disabled="referenceInProgress">
                    {{ L_('Match References') }}
                  </button>




                </div>




                <div v-show="isChatMode">

                  <Socket :sessionId="prompts.chat.sessionId" :persona="prompts.chat.persona"
                    :temperature="settings.temperature" :messageHistory="prompts.chat.messageHistory"
                    :userPrompt="prompts.chat.adaptedPrompt" :model="selectedModel" :trigger="prompts.chat.trigger"
                    @messageComplete="payload => messageComplete(payload, prompts.chat)"
                    @messagePartial="payload => messagePartial(payload, prompts.chat)"
                    @messageError="payload => messageError(payload, prompts.chat)">

                    <ChatWindow :messages="prompts.chat.messageHistory" />

                  </Socket>



                  <form @submit.prevent="chatModeTrigger()" class="relative flex items-center mb-2 ">
                    <textarea ref="textarea" @keyup.enter="event => { if (!event.shiftKey) chatModeTrigger() }"
                      v-model="chatPrompt" @input="adjustHeight" class="form-input w-full pl-12"
                      placeholder="Ask me about …" aria-label="Search anything" />
                    <button type="submit" class="absolute inset-0 right-auto" aria-label="Search">
                      <svg class="w-4 h-4 shrink-0 ml-4 mr-3" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                        <path class="fill-current text-gray-400"
                          d="M7 14c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zM7 2C4.243 2 2 4.243 2 7s2.243 5 5 5 5-2.243 5-5-2.243-5-5-5zm8.707 12.293a.999.999 0 11-1.414 1.414L11.9 13.314a8.019 8.019 0 001.414-1.414l2.393 2.393z" />
                      </svg>
                    </button>
                  </form>


                  <div class="space-x-2">

                    <button @click="chatCopy"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Copy Answer to Q&A Mode') }}
                    </button>

                    <button @click="chatClear"
                      class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Clear Chat') }}
                    </button>



                  </div>



                </div>

                <div v-show="!isChatMode">


                  <h3 v-if="prompts.triage.json || prompts.reference.json"
                    class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight"> Triage
                    Results </h3>


                    <div class="flex flex-wrap -mx-2">

                      <div class="flex-auto w-full md:w-1/2 px-2">
                    <Spinner v-if="triageInProgress && prompts?.triage?.message?.length" :inProgress="triageInProgress"
                      :message="'Triaging question'" :subtext="`Content loading ${prompts.triage.message.length}`" />
                    </div>
                    <div class="flex-auto w-full md:w-1/2 px-2">
                    <Spinner v-if="referenceInProgress && prompts?.reference?.message?.length"
                      :inProgress="referenceInProgress" :message="'Loading References'"
                      :subtext="`Content loading ${prompts.reference.message.length}`" />
                    </div>
                    <!-- Show triage complete-->
                    <div v-if="!triageInProgress && prompts.triage.json" class="flex-auto w-full md:w-1/2 px-2">
                      <p>Triage determines how your prompt aligns to your Categories. This assists in matching the right
                        reference materials.</p>
                      <EssentialInformation v-model="prompts.triage.json" />
                    </div>

                    <!-- Show recommended references-->
                    <div
                      v-if="!referenceInProgress && prompts.reference.json && (documentsChecked.length || segmentsChecked.length)"
                      class="flex-auto w-full md:w-1/2 px-2">
                      <p>References are recommended by AI from your Documents and Segments.</p>
                      <p>Uncheck items to remove them, or check items from the full list below to add.</p>
                      <div v-if="documentsChecked.length">
                        <span class="font-bold">Documents</span>
                        <DocumentTable :documents="documentsChecked"
                          @checked="payload => documentsCheck(documentsChecked, payload)" />
                      </div>

                      <div v-if="segmentsChecked.length">

                        <span class="font-bold">Segments</span>
                        <SegmentsTable :data="segmentsChecked"
                          @checked="payload => segmentsCheck(segmentsChecked, payload)" />

                      </div>

                    </div>

                  </div>

                  <div class="flex">

                    <div class="w-full">
                      <h3 class="font-lato font-bold text-2xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                        Step 2: View or Edit Generated Answer(s)
                      </h3>

                      <div class="flex space-x-2">
                        <button @click="questionsWithReferences" v-if="!isChatMode"
                          class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                          :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': questionInProgress }"
                          :disabled="questionInProgress">
                          {{ L_('Generate') }}
                        </button>



                        <button @click="selectAllAnswers"
                          class="ml-2 whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                          {{ L_('Select All') }}
                        </button>


                        <button @click="mergeSelectedAnswers"
                          class="ml-2 whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                          :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': questionInProgress || auditInProgress }"
                          :disabled="questionInProgress || auditInProgress">
                          {{ L_('Merge Selected') }}
                        </button>

                      </div>

                      <div class="flex space-x-2">

                        <div v-if="!isChatMode" class="w-96 whitespace-nowrap self-start ">
                          <label>Answers to Generate</label>
                          <VueSlider :modelValue="settings.questions"
                            @update:modelValue="value => updateSettings('questions', value)" :min="1" :max="10" />
                        </div>

                      </div>
                      <div class="flex flex-wrap -m-2 mb-2">

                        <div v-for="(prompt, index) in prompts.questions.set" :key="index" :class="{
                          'w-full md:w-1/2 lg:w-1/3': prompts.questions.set.length > 2,
                          'w-1/2': prompts.questions.set.length === 2,
                          'w-full': prompts.questions.set.length === 1
                        }" class="p-2 flex flex-col">
                          <div class="bg-white dark:bg-gray-800 rounded shadow p-4 flex-grow">
                            <DivInput placeholder="View your answer" v-model="prompt.message" :asPlainText="true" />

                            <label class="label-style whitespace-nowrap">
                              <input type="checkbox" v-model="prompt._checked"
                                class="w-6 h-6 m-2 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600" />
                              {{ L_('Select answer') }}
                            </label>

                          </div>



                        </div>



                      </div>

                      <h3 class="font-lato font-bold text-2xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                        Step 3: Review and Edit Final Answer
                      </h3>
                      <DivInput placeholder="Meged answer" v-model="prompts.answer.message" :asPlainText="true" />


                      <h3 class="font-lato font-bold text-2xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                        Step 4: Perform Audit and Quality Assurange
                      </h3>


                      <button @click="auditWithReferences" v-if="!isChatMode"
                        class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                        :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': auditInProgress }"
                        :disabled="auditInProgress">
                        {{ L_('Audit') }}
                      </button>


                      <div class="flex">
                        <div class=" rounded-lg shadow-md overflow-hidden w-full">


                          <h3 class="font-lato font-bold text-1xl mt-2 mb-2 pb-1 border-b border-red-600 leading-tight">
                            Quality Analysis
                          </h3>


                          <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden p-4 w-full">

                            <div class="w-96 whitespace-nowrap self-start ">
                              <label>Completeness</label>
                              <VueSlider :modelValue="interactionScore.completeness"
                                @update:modelValue="value => updateScore('completeness', value)" :min="0" :max="10" />
                            </div>

                            <div class="w-96 whitespace-nowrap self-start ">
                              <label>Accuracy</label>
                              <VueSlider :modelValue="interactionScore.accuracy"
                                @update:modelValue="value => updateScore('accuracy', value)" :min="0" :max="10" />
                            </div>


                            <div class="w-96 whitespace-nowrap self-start ">
                              <label>Tone</label>
                              <VueSlider :modelValue="interactionScore.tone"
                                @update:modelValue="value => updateScore('tone', value)" :min="0" :max="10" />
                            </div>

                            <div class="w-96 whitespace-nowrap self-start ">
                              <label>Overall</label>
                              <VueSlider :modelValue="interactionScore.overall"
                                @update:modelValue="value => updateScore('overall', value)" :min="0" :max="10" />
                            </div>

                            <DivInput placeholder="Comments" v-model="interactionScore.comments" :asPlainText="true" />


                            <button @click="saveArtifacts"
                              class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto"
                              :class="{ 'bg-gray-500 hover:bg-gray-500 dark:bg-gray-600 dark:hover:bg-gray-600 cursor-not-allowed': questionInProgress || auditInProgress }"
                              :disabled="questionInProgress || auditInProgress">
                              {{ L_('Save as Artifact') }}
                            </button>

                          </div>
                        </div>



                        <div v-if="prompts.audit.message || prompts.audit.json" class="w-full">

                          <h3 class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                            Audit Analysis
                          </h3>

                          <Spinner v-if="auditInProgress" :inProgress="auditInProgress" :message="'Generating audit'"
                            :subtext="`Content loading ${prompts?.audit?.message?.length}`" />


                          <DivInput v-if="!prompts.audit.json" placeholder="View the audit"
                            v-model="prompts.audit.message" :asPlainText="false" />

                          <AuditTable v-if="prompts.audit.json" :data="prompts.audit.json" />

                        </div>



                      </div>

                    </div>


                  </div>


                  <p>Attach your Documents and Segments.</p>

                  <div v-if="documents?.length" class="flex space-x-2">
                    <button @click="documentsToggleCheckAll"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Toggle Select') }}
                    </button>

                    <button @click="segmentsSelectToEdit"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Add Tags') }}
                    </button>

                    <button @click="documentsRemoveTags"
                      class="whitespace-nowrap self-start bg-blue-500 hover:bg-blue-700 dark:bg-blue-400 dark:hover:bg-blue-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Remove Tags') }}
                    </button>

                    <div class="mt-2" v-if="tags?.length">
                      <VueMultiselect v-model="filterTags" :options="tags" :searchable="true" :multiple="true"
                        track-by="uuid" :close-on-select="false" :custom-label="customLabelTag" :show-labels="false"
                        @remove="removeTag" placeholder="Select tags" />
                    </div>

                    <button v-if="!applyFilter" @click="applyFilter = true"
                      class="whitespace-nowrap self-start bg-green-500 hover:bg-green-700 dark:bg-green-400 dark:hover:bg-green-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Apply Filters') }}
                    </button>
                    <button v-if="applyFilter" @click="applyFilter = false"
                      class="whitespace-nowrap self-start bg-yellow-500 hover:bg-yellow-700 dark:bg-yellow-400 dark:hover:bg-yellow-600 text-white dark:text-gray-800 font-bold mt-2 mb-2 p-2 rounded w-auto">
                      {{ L_('Clear Filters') }}
                    </button>


                  </div>
                </div>

                <h3 v-if="documents?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Documents
                </h3>

                <div v-if="documents?.length" class="w-full">
                  <DocumentTable :documents="documentsFiltered" :showTags="true" @edit="documentsSelectToEdit"
                    @checked="payload => documentsCheck(documentsFiltered, payload)" />
                </div>

                <h3 v-if="segments?.length"
                  class="font-lato font-bold text-1xl mt-2 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Segments
                </h3>

                <div v-if="segments?.length" class="w-full">
                  <SegmentsTable :data="segmentsFiltered" :showTags="true" @edit="segmentsSelectToEdit"
                    @checked="payload => segmentsCheck(segmentsFiltered, payload)" />
                </div>
              </template>
              <template v-slot:tab-7>
                <h2 class="font-lato font-bold text-2xl mt-1 mb-1 pb-1 border-b border-red-600 leading-tight">
                  Artifacts
                </h2>
                <p>View the previously saved artifacts</p>
                <div v-for="(artifact, index) in artifacts">
                  <!-- {{ artifact }} -->
                  <ArtifactCard :data="artifact" @select="selectSavedArtifact(index)" />
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
//Plugins
import { ref, onMounted, onUnmounted, onBeforeMount, nextTick, watch, watchEffect, computed, reactive } from 'vue';
import { v4 as uuidv4 } from 'uuid';


//The permanent ID of this app to load the Assignments;
//Right now, this uuid is user defined, but may become uuid in the future to prevent conflicts
const wrappUuid = "ft-support-with-knowledge-mapping-v1";
const wrappAssignments = ref([
  { code: 'triage', personaUuid: null, persona: null, name: { en: "Triage", fr: "Triageur/Triageuse" } },
  { code: 'reference', personaUuid: null, persona: null, name: { en: "Reference Analyst", fr: "Analyste de référence" } },
  { code: 'writer', personaUuid: null, persona: null, name: { en: "Writer", fr: "Auteur(e)" } },
  { code: 'auditor', personaUuid: null, persona: null, name: { en: "Auditor", fr: "Auditeur/Auditrice" } },
  { code: 'translator', personaUuid: null, persona: null, name: { en: "Translator", fr: "Traducteur/Traductrice" } },
  { code: 'artifactAnalyst', personaUuid: null, persona: null, name: { en: "Artifact Analyst", fr: "Analyste d'artefacts" } },
])

// Misc 
import canada from "@/images/canada.svg";
import { notify } from "notiwind"
import VueSlider from 'vue-slider-component'
import 'vue-slider-component/theme/default.css'


//Components
import Header from '@/partials/Header.vue'
import DisplayPersona from '@/components/DisplayPersona.vue'
import DisplayPersonaStack from '@/components/DisplayPersonaStack.vue'
import DivInput from '@/components/DivInput.vue'
import Socket from '@/components/Socket.vue'
import Tabs from '@/components/Tabs.vue';
import VueMultiselect from 'vue-multiselect'
import DocumentDragAndDrop from '@/components/knowledgeMapping/DocumentDragAndDrop.vue';
import DocumentTable from '@/components/knowledgeMapping/DocumentTable.vue';
import DocumentCreateEdit from '@/components/knowledgeMapping/DocumentCreateEdit.vue';
import WordPreview from '@/components/knowledgeMapping/WordPreview.vue';
import KnowledgeSegment from '@/components/knowledgeMapping/KnowledgeSegment.vue';
import KnowledgeCategory from '@/components/knowledgeMapping/KnowledgeCategory.vue';

//New
import AssignmentsTable from '@/components/AssignmentsTable.vue';
import KnowledgeSetCreateEdit from '@/components/knowledgeMapping/KnowledgeSetCreateEdit.vue';
import KnowledgeSetCards from '@/components/knowledgeMapping/KnowledgeSetCards.vue';
import CategoryTable from '@/components/knowledgeMapping/CategoryTable.vue';
import CategoryCreateEdit from '@/components/knowledgeMapping/CategoryCreateEdit.vue';
import TagTable from '@/components/knowledgeMapping/TagTable.vue';
import TagCreateEdit from '@/components/knowledgeMapping/TagCreateEdit.vue';
import SegmentsPendingTable from '@/components/knowledgeMapping/SegmentsPendingTable.vue';
import SegmentsTable from '@/components/knowledgeMapping/SegmentsTable.vue';
import SegmentCreateEdit from '@/components/knowledgeMapping/SegmentCreateEdit.vue';
import AuditTable from '@/components/knowledgeMapping/AuditTable.vue';
import ToggleSwitch from '@/components/ToggleSwitch.vue';
import ChatWindow from '@/components/ChatWindow.vue';
import ArtifactCard from '@/components/knowledgeMapping/ArtifactCard.vue';
import Spinner from '@/components/knowledgeMapping/Spinner.vue';
import EssentialInformation from '@/components/knowledgeMapping/EssentialInformation.vue';

// SegmentCreateEdit
//Composables
import { useLexicon } from '@/composables/useLexicon.js'
import { useAssignments } from '@/composables/useAssignments.js'
import { useModels } from '@/composables/useModels.js'
import { usePersonas } from '@/composables/usePersonas.js'
import { useRosters } from '@/composables/useRosters.js'
import { useWebsockets } from '@/composables/useWebsockets.js';

//New
import { useKnowledgeSets } from '@/composables/knowledgeMapping/useKnowledgeSets.js';
import { useCategories } from '@/composables/knowledgeMapping/useCategories.js';
import { useTags } from '@/composables/knowledgeMapping/useTags.js';
import { useDocuments } from '@/composables/knowledgeMapping/useDocuments.js';
import { useSegments } from '@/composables/knowledgeMapping/useSegments.js';
import { useArtifacts } from '@/composables/knowledgeMapping/useArtifacts.js';

const { L_ } = useLexicon()
const { assignments, getAssignments, createAssignments, deleteAssignments } = useAssignments()
const { adminModels, selectedModel } = useModels()
const { personas, selectedPersona, newPersona, getPersonas, resetPersona } = usePersonas()
const { rosters, selectedRoster, getRosterFromUuid } = useRosters()
const { sessionsContent } = useWebsockets();

//New
const { defaultKnowledgeSet,
  newKnowledgeSet,
  knowledgeSets,
  selectedKnowledgeSet,
  addNewKnowledgeSet,
  resetKnowledgeSet,
  getKnowledgeSets,
  createKnowledgeSets,
  updateKnowledgeSets,
  deleteKnowledgeSets } = useKnowledgeSets();

const { defaultCategory,
  newCategory,
  categories,
  categoriesPending,
  selectedCategory,
  selectedCategoryPending,
  addNewCategory,
  resetCategory,

  getCategories,
  createCategories,
  updateCategories,
  deleteCategories
} = useCategories()

const {
  defaultTag,
  newTag,
  tags,
  filterTags,
  selectedTag,

  addNewTag,
  resetTag,

  getTags,
  createTags,
  updateTags,

  deleteTags
} = useTags()


const { defaultDocument,
  newDocument,
  documents,
  documentsFiltered,
  documentsChecked,
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
  deleteDocuments } = useDocuments()

const {
  defaultSegment,
  newSegment,
  segments,
  segmentsFiltered,
  segmentsChecked,
  applyFilter: applySegmentFilter,

  segmentsPending,
  selectedSegment,
  selectedSegmentPending,
  addNewSegment,
  resetSegment,


  getSegments,
  createSegments,
  updateSegments,
  addRemoveTags: addRemoveSegmentTags,
  deleteSegments
} = useSegments();



const {
  defaultArtifact,
  newArtifact,
  artifacts,
  artifactsFiltered,
  applyFilter: applyArtifactFilter,

  artifactsPending,
  selectedArtifact,
  selectedArtifactPending,
  addNewArtifact,
  resetArtifact,


  getArtifacts,
  createArtifacts,
  updateArtifacts,
  addRemoveTags: addRemoveArtifactTags,
  deleteArtifacts
} = useArtifacts();



let props = defineProps({ rosterUuid: { type: String, default: null } })

const tabs = computed(() => {
  let checkmarkWrappAssignments = wrappAssignments.value.every(wA => wA.personaUuid) ? ' ✓' : '';
  let checkmarkKnowledgeSets = selectedKnowledgeSet?.value?.uuid ? ' ✓' : '';
  let checkMarkCategories = categories?.value?.length ? ' ✓' : '';
  let checkMarkDocuments = documents?.value?.length ? ' ✓' : '';
  let checkMarkSegments = segments?.value?.length ? ' ✓' : '';
  let checkMarkArtifacts = artifacts?.value?.length ? ' ✓' : '';
  if (selectedKnowledgeSet?.value?._id) {
    return [
      { label: L_('Assignments') + checkmarkWrappAssignments },
      { label: L_('Knowledge Sets') + checkmarkKnowledgeSets },
      { label: L_('Metadata') + checkMarkCategories },
      { label: L_('Documents') + checkMarkDocuments },
      { label: L_('Segments') + checkMarkSegments },
      { label: L_('Mappings') },
      { label: L_('Interact') },
      { label: L_('Analytics') + checkMarkArtifacts }
    ]
  }
  else {
    return [
      { label: L_('Assignments') + checkmarkWrappAssignments },
      { label: L_('Knowledge Sets') + checkmarkKnowledgeSets },
    ]
  }
});

let activeTab = ref(0)

let defaultPrompt = { referenceUuid: null, status: "waiting", persona: null, prompt: null, adaptedPrompt: null, sessionId: uuidv4(), trigger: false, message: null, json: null };
const createPrompt = (overrides = {}) => ({ ...defaultPrompt, ...overrides, sessionId: uuidv4() });
const prompts = ref({
  documents: { set: [] },
  segments: { set: [] },
  triage: createPrompt(),
  reference: createPrompt(),
  question: createPrompt(),
  questions: { prompt: null, set: [] }, //Generates many instances 
  answer: createPrompt(),
  audit: createPrompt(),
  translation: createPrompt(),
  chat: createPrompt({ promptType: "chat", messageHistory: [] }),

});
let promptMax = ref(5);



let documentsPendingCheckAll = ref(false)
let documentsCheckAll = ref(false)
let documentsForSegments = ref(false)

let triageInProgress = ref(false);
let referenceInProgress = ref(false);
let questionInProgress = ref(false);
let questionsInProgress = ref(false);
let answerInProgress = ref(false);
let auditInProgress = ref(false);


const isChatMode = ref(false);
const chatPrompt = ref(null)

const interactionScore = ref({
  completeness: 5,
  accuracy: 5,
  tone: 5,
  overall: 5,
  comments: null
})

const settings = ref({
  temperature: 0.2,
  questions: 2,
  useHtml: false,
})




onMounted(async () => {

  if (props?.rosterUuid) {
    //Step 1 load the roster
    await getRosterFromUuid(props.rosterUuid);

    //Step 2 get the Roster Assignment
    await getAssignments(wrappUuid, props.rosterUuid)
    //Map the selectedRoster.personas to the assignments.personas
    if (selectedRoster?.value?.personas?.length && assignments?.value?.length) {
      wrappAssignments.value.forEach((wA) => {
        let matchedAssignment = assignments.value.find((a) => { return a.code == wA.code });
        if (matchedAssignment?.personaUuid) {
          let matchedPersona = selectedRoster.value.personas.find((p) => { return p.uuid == matchedAssignment.personaUuid })
          if (matchedPersona) { wA.persona = matchedPersona; wA.personaUuid = matchedPersona.uuid }
        }
      })
    }

    //Step 3 get the Knowledge Sets
    await getKnowledgeSets(props.rosterUuid);
    refreshKnowledgeSets();
    //Step 4, load the other information once Knowledge Sets selected
  }
  else
    console.log("Missing RosterUUID. Please replace and try again.")


})

const customLabelModel = (option) => option ? option.name.en : '';
const customLabelTag = (option) => option ? option.name.en + " | " + option.name.fr : '';

function checkAssignment(code) {
  let thisAssignment = wrappAssignments.value.find((wA) => { return wA.code == code })
  return thisAssignment;
}

function updateSettings(category, newSetting) {
  settings.value[category] = newSetting;
}


function updatePromptMax(val) {
  promptMax.value = val;
}

async function refreshKnowledgeSets() {
  if (selectedKnowledgeSet?.value?.uuid) {
    getCategories(selectedKnowledgeSet.value.uuid);
    getTags(selectedKnowledgeSet.value.uuid);
    getDocuments(selectedKnowledgeSet.value.uuid);
    getSegments(selectedKnowledgeSet.value.uuid);
    getArtifacts(selectedKnowledgeSet.value.uuid);
  }
}

//Knowledge Set
function knowledgeSetSelected(item) {
  selectedKnowledgeSet.value = item;
  getCategories(item.uuid);
  getTags(item.uuid);
  getDocuments(selectedKnowledgeSet.value.uuid);
  getSegments(selectedKnowledgeSet.value.uuid);
  getArtifacts(selectedKnowledgeSet.value.uuid);
  // getSegments(item.uuid);
  // getMappings(item.uuid);
  // getArtifacts(item.uuid);


}

function editCategories(index) {
  selectedCategory.value = categories.value[index]
}

function checkCategories(val) {
  categories.value[val.index]._checked = val.isChecked
}


function editTags(index) {
  selectedTag.value = tags.value[index]
}

function checkTags(val) {
  tags.value[val.index]._checked = val.isChecked
}

const removeTag = (tag) => {
  console.log(tag)

};

//Documents Pending
function documentsPendingChanged(files) {
  for (const file of files) {
    documentsPending.value.push(file)
  }
}

function documentsPendingCheck(val) {
  documentsPending.value[val.index]._checked = val.isChecked;
}

function documentsPendingToggleCheckAll() {

  documentsPendingCheckAll.value = !documentsPendingCheckAll.value;
  for (const doc of documentsPending.value) {
    doc._checked = documentsPendingCheckAll.value;
  }
}

function documentsPendingSelectToEdit(index) {
  selectedDocumentPending.value = documentsPending.value[index];
  nextTick(() => {
    selectedDocumentPending.value = { ...selectedDocumentPending.value };
  });
}



function documentsPendingProcessCheckedFiles() {
  try {
    //Reset the checkmark
    documentsPendingCheckAll.value = false;

    //Set all the checked docs all to pending 
    for (const doc of documentsPending.value) {
      if (doc._checked) {
        doc._processingStatus = "pending";
        doc._checked = false;
      }
    }

    //Find the next pending doc in the list
    let nextDoc = documentsPending.value.find((doc) => { return doc._processingStatus == 'pending' })

    //See how many concurrent processors there are running
    let processingCount = prompts.value.documents.set.filter((prompt) => { return prompt?.status == 'processing' }).length;

    //If both conditions meet
    if (nextDoc && processingCount < promptMax.value) {
      //Add a new prompt
      prompts.value.documents.set.push(createPrompt({ promptType: "documents", status: "waiting", persona: checkAssignment('triage').persona, trigger: false }));
      let promptIndex = prompts.value.documents.set.length - 1;
      console.log("prompts.value.documents.set", prompts.value.documents.set)
      nextDoc._processingStatus = 'processing';
      nextDoc._processingStatusNumber = 0;
      prompts.value.documents.set[promptIndex].status = "processing";
      prompts.value.documents.set[promptIndex].referenceUuid = nextDoc.uuid;

      let categoryPrompt = "";
      if (categories.value.length) categoryPrompt = `\n\nEvaluate this content against the following categories:\n\n  ${categories.value.map(category => JSON.stringify(category)).join(',\n')} \n\n`;

      prompts.value.documents.set[promptIndex].adaptedPrompt = `Summarize the following file contents:\n\n For reference, the content comes from a file with this info: ${JSON.stringify(nextDoc.original)} ${categoryPrompt} \n\nHere are the contents to analyze:\n\n ${nextDoc.textContent}`;

      nextTick(() => {
        prompts.value.documents.set[promptIndex].trigger = !prompts.value.documents.set[promptIndex].trigger;
      })

      //Check for the next file
      documentsPendingProcessCheckedFiles();

    }

  }
  catch (error) {
    console.log(error)
  }
}

function documentsPendingSaveCheckedFiles() {
  //See how many concurrent processors there are running
  let docsToSave = documentsPending.value.filter((doc) => { return doc._checked });
  createDocuments(selectedKnowledgeSet.value.uuid, docsToSave);

  //Remove the checked
  documentsPending.value = documentsPending.value.filter(
    (doc) => !doc._checked
  );
  //Save them to the work 
}

function messagePromptComplete(payload, thisPrompt) {
  if (payload?.message?.length) {
    thisPrompt.status = "waiting";
    thisPrompt.message = payload.message;

    //Extract the JSON
    let thisSessionContent = sessionsContent.value.filter((session) => { return session.sessionId == thisPrompt.sessionId })
    if (thisSessionContent?.[0]?.extracts?.json?.length) {
      thisPrompt.json = JSON.parse(JSON.stringify(thisSessionContent[0].extracts.json[0]));
    };

    //Do Cleanup by removing sockets
    if (thisPrompt.promptType == 'documents') {

      let updateDoc = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid })
      if (updateDoc) {
        updateDoc._processingStatus = "completed";
        updateDoc._processingStatusNumber = null;
        if (thisPrompt?.json?.name) updateDoc.name = thisPrompt.json.name;
        if (thisPrompt?.json?.description) updateDoc.description = thisPrompt.json.description;
        if (thisPrompt?.json?.keywords) updateDoc.keywords = thisPrompt.json.keywords;
        if (thisPrompt?.json?.categories) updateDoc.categories = thisPrompt.json.categories;
      }

      prompts.value.documents.set = prompts.value.documents.set.filter(
        (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
      );
      documentsPendingProcessCheckedFiles();
    }

    if (thisPrompt.promptType == 'segments') {
      let updateDoc = documents.value.find((document) => { return document.uuid == thisPrompt.referenceDocUuid })
      if (updateDoc) {
        let updateSegment = updateDoc._segments.find((segment) => { return segment.uuid == thisPrompt.referenceUuid })

        if (updateSegment) {
          updateSegment._processingStatus = "completed";
          updateSegment._processingStatusNumber = null;
          if (thisPrompt?.json?.name) updateSegment.name = thisPrompt.json.name;
          if (thisPrompt?.json?.description) updateSegment.description = thisPrompt.json.description;
          if (thisPrompt?.json?.keywords) updateSegment.keywords = thisPrompt.json.keywords;
          if (thisPrompt?.json?.categories) updateSegment.categories = thisPrompt.json.categories;

        }
        prompts.value.segments.set = prompts.value.segments.set.filter(
          (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
        );

        segmentsPendingProcessChecked(updateDoc)

      }
    }

    if (thisPrompt.promptType == 'triage') {
      triageInProgress.value = false;

    }

    if (thisPrompt.promptType === 'reference') {
      referenceInProgress.value = false;
      documents.value.forEach(doc => doc._checked = false);
      segments.value.forEach(doc => doc._checked = false);

      if (thisPrompt?.json?.length) {
        documents.value.forEach(doc => {
          const found = thisPrompt.json.some(promptItem => promptItem.uuid === doc.uuid.slice(0, 8));
          if (found) {
            doc._checked = true;
          }
        });
        segments.value.forEach(doc => {
          const found = thisPrompt.json.some(promptItem => promptItem.uuid === doc.uuid.slice(0, 8));
          if (found) {
            doc._checked = true;
          }
        });

        //Let checked segments override their source documents, making these the preferred sources
        segments.value.forEach(segment => {
          let parentDoc = documents.value.find(doc => { return doc.uuid == segment.documentUuid })
          if (parentDoc) parentDoc._checked = false;
        })

      }
    }

    //Trigger the audit to happen automatically
    if (thisPrompt.promptType == 'questions') {
      questionsInProgress.value = false;
    }


    //Trigger the audit to happen automatically
    if (thisPrompt.promptType == 'question') {
      questionInProgress.value = false;
    }

    //Trigger the audit to happen automatically
    if (thisPrompt.promptType == 'answer') {
      answerInProgress.value = false;
    }

    //Flag it is in progress
    if (thisPrompt.promptType == 'audit') {
      auditInProgress.value = false;
    }


    //And so forth... Add more promptTypes as required

  }


}


function messagePromptPartial(payload, thisPrompt) {
  if (payload?.message?.length) {
    thisPrompt.message = payload.message;

    if (thisPrompt.promptType == 'documents') {
      let updateDoc = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid })
      if (updateDoc) {
        updateDoc._processingStatusNumber = payload.message.length;
      }
    }

    if (thisPrompt.promptType == 'segments') {
      let updateDoc = documents.value.find((document) => { return document.uuid == thisPrompt.referenceDocUuid })
      if (updateDoc) {
        let updateSegment = updateDoc._segments.find((segment) => { return segment.uuid == thisPrompt.referenceUuid })
        if (updateSegment) {

          updateSegment._processingStatusNumber = payload.message.length;
        }

      }
    }



  }
}


//Remove if error
function messagePromptError(payload, thisPrompt) {

  //Clean up for documents
  if (thisPrompt.promptType == 'documents') {
    let setError = documentsPending.value.find((doc) => { return doc.uuid == thisPrompt.referenceUuid });
    setError._processingStatus = 'error'
    prompts.value.documents.set = prompts.value.documents.set.filter(
      (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
    );
  }

  if (thisPrompt.promptType == 'segments') {

    let updateDoc = documents.value.find((document) => { return document.uuid == thisPrompt.referenceDocUuid })
    if (updateDoc) {
      let updateSegment = updateDoc._segments.find((segment) => { return segment.uuid == thisPrompt.referenceUuid })
      if (updateSegment) {
        updateSegment._processingStatus = 'error';
      }
      prompts.value.documents.set = prompts.value.segments.set.filter(
        (prompt) => prompt.referenceUuid !== thisPrompt.referenceUuid
      );
    }

  }

  if (thisPrompt.promptType == 'question') {
    questionInProgress.value = false;
  }

  if (thisPrompt.promptType == 'questions') {
    questionsInProgress.value = false;
  }

  if (thisPrompt.promptType == 'answer') {
    answerInProgress.value = false;
  }

  if (thisPrompt.promptType == 'audit') {
    auditInProgress.value = false;
  }

  if (thisPrompt.promptType == 'reference') {
    referenceInProgress.value = false;
  }

  if (thisPrompt.promptType == 'triage') {
    triageInProgress.value = false;
  }


}


//Full documents
function documentsCheck(documentArray, payload) {
  const document = documentArray.find(s => s.uuid === payload.uuid);
  if (document) {
    document._checked = payload.isChecked;
  }
}

function documentsToggleCheckAll() {
  documentsCheckAll.value = !documentsCheckAll.value;
  for (const doc of documents.value) {
    doc._checked = documentsCheckAll.value;
  }
}

function documentsSelectToEdit(index) {
  selectedDocument.value = documents.value[index];
  nextTick(() => {
    selectedDocument.value = { ...selectedDocument.value };
  });
}

//Full segments
function segmentsCheck(segmentArray, payload) {
  // Assuming payload contains a unique identifier, such as `uuid`
  const segment = segments.value.find(s => s.uuid === payload.uuid);
  if (segment) {
    segment._checked = payload.isChecked;
  }

}

function segmentsSelectToEdit(index) {
  selectedSegment.value = segments.value[index];
  nextTick(() => {
    selectedSegment.value = { ...selectedSegment.value };
  });
}

let documentViewContent = ref(false);
let segmentViewContent = ref(false);

function documentsSelectToView(index) {
  selectedDocument.value = documents.value[index];
  documentViewContent.value = true;
  nextTick(() => {
    selectedDocument.value = { ...selectedDocument.value };
  });
}

function documentsCloseView(index) {
  selectedDocument.value = documents.value[index];
  documentViewContent.value = false;
  nextTick(() => {
    selectedDocument.value = { ...selectedDocument.value };
  });
}


function segmentsSelectToView(index) {
  selectedSegment.value = segments.value[index];
  segmentViewContent.value = true;
  nextTick(() => {
    selectedSegment.value = { ...selectedSegment.value };
  });
}

function segmentsCloseView(index) {
  selectedSegment.value = segments.value[index];
  segmentViewContent.value = false;
  nextTick(() => {
    selectedSegment.value = { ...selectedSegment.value };
  });
}


function documentsAddTags() {
  let tagDocuments = documents.value.filter((doc) => { return doc._checked })
  addRemoveTags(selectedKnowledgeSet.value.uuid, 'add', tagDocuments, filterTags.value)
}

function documentsRemoveTags() {
  let tagDocuments = documents.value.filter((doc) => { return doc._checked })
  addRemoveTags(selectedKnowledgeSet.value.uuid, 'remove', tagDocuments, filterTags.value)
}

function segmentsAddTags() {
  let tagSegments = segments.value.filter((segment) => { return segment._checked })
  addRemoveSegmentTags(selectedKnowledgeSet.value.uuid, 'add', tagSegments, filterTags.value)
}

function segmentsRemoveTags() {
  let tagSegments = segments.value.filter((segment) => { return segment._checked })
  addRemoveSegmentTags(selectedKnowledgeSet.value.uuid, 'remove', tagSegments, filterTags.value)
}



//Segments 
function documentsSelectToSegment() {
  documentsForSegments.value = documentsFiltered.value.filter((doc) => { return doc._checked });
  for (const doc of documentsForSegments.value) {
    doc._segments = [];
  }
}

function segmentSetMarkers(segments, doc) {
  doc._segments = segments;
}

function removePendingSegment(index, doc) {
  const segmentToRemove = doc._segments[index];
  if (segmentToRemove) {
    // Use the UUID to find the marker element in the DOM
    const markerEl = document.querySelector(`[data-marker-id="${segmentToRemove.markerId}"]`);
    if (markerEl) {
      markerEl.remove(); // Remove the marker element from the DOM
    }
    // Remove the segment from the array
    doc._segments.splice(index, 1);
  }
}

function segmentsPendingToggleCheckAll(doc) {
  doc._checkAllSegments = !doc._checkAllSegments;

  for (const segment of doc._segments) {
    segment._checked = doc._checkAllSegments;
  }
}

function segmentsPendingProcessChecked(doc) {
  //Bulk process all the segments by AI using the file classifier

  try {
    //Reset the checkmark
    if (doc._checkAllSegments) doc._checkAllSegments = false;

    //Set all the checked docs all to pending 
    for (const segment of doc._segments) {
      if (segment._checked) {
        segment.uuid = uuidv4();
        segment._processingStatus = "pending";
        segment._checked = false;
      }
    }

    //Find the next pending doc in the list
    let nextSegment = doc._segments.find((segment) => { return segment._processingStatus == 'pending' })

    // console.log('nextSegment', nextSegment)
    //See how many concurrent processors there are running
    let processingCount = prompts.value.segments.set.filter((prompt) => { return prompt.status == 'processing' }).length;
    // console.log('processingCount', processingCount)

    //If both conditions meet
    if (nextSegment && processingCount < promptMax.value) {

      //Add a nwe prompt
      prompts.value.segments.set.push(createPrompt({ promptType: "segments", status: "waiting", persona: checkAssignment('triage').persona, trigger: false }));
      let promptIndex = prompts.value.segments.set.length - 1;

      nextSegment._processingStatus = 'processing';
      nextSegment._processingStatusNumber = 0;

      nextSegment.documentName = doc.name;
      nextSegment.documentDescription = doc.description;
      nextSegment.docoumentUuid = doc.uuid;
      nextSegment.cursorStart = nextSegment.cursorIndex;
      nextSegment.cursorEnd = nextSegment.cursorIndex + nextSegment.textContent.length;

      prompts.value.segments.set[promptIndex].status = "processing";
      prompts.value.segments.set[promptIndex].referenceDocUuid = doc.uuid;
      prompts.value.segments.set[promptIndex].referenceUuid = nextSegment.uuid;

      let categoryPrompt = "";
      if (categories.value.length) categoryPrompt = `\n\nEvaluate this content against the following categories:\n\n  ${categories.value.map(category => JSON.stringify(category)).join(',\n')} \n\n`;

      prompts.value.segments.set[promptIndex].adaptedPrompt = `Summarize the following file contents:\n\n For reference, the content comes from a file with this info: ${JSON.stringify(doc.original)} ${categoryPrompt} \n\nHere are the contents to analyze:\n\n ${nextSegment.textContent}`;

      nextTick(() => {
        prompts.value.segments.set[promptIndex].trigger = !prompts.value.segments.set[promptIndex].trigger;
      })

      //Check for the next file
      segmentsPendingProcessChecked(doc);

    }

  }
  catch (error) {
    console.log(error)
  }


}

function segmentsPendingSaveChecked(doc) {
  let checkedSegments = doc._segments.filter((segment) => { return segment._checked });
  createSegments(selectedKnowledgeSet.value.uuid, checkedSegments);
}



//Interact


function triageWithReferences() {
  //Perform both evaluations simultaneously
  //Step 1 Triage
  triageInProgress.value = true;
  prompts.value.triage.promptType = 'triage';
  prompts.value.triage.persona = checkAssignment('triage').persona;
  prompts.value.triage.messageHistory = [{ role: "system", content: prompts.value.triage.persona.basePrompt }];

  //Triage requires categories to perform is work
  categories.value.forEach((category, index) => {
    prompts.value.triage.messageHistory.push({
      role: "system", content: `Here is Category ${index + 1} which you will use in your analysis:\n\n${JSON.stringify(category)}`
    })
  })

  prompts.value.triage.messageHistory.push({ role: "user", content: `Evaluate the following content to generate name, description, keywords, and categories in the prescribed format:\n${prompts.value.questions.prompt}` })

  //Step 2 References
  // referenceInProgress.value = true;
  // prompts.value.reference.promptType = 'reference';
  // prompts.value.reference.persona = checkAssignment('reference').persona;
  // prompts.value.reference.messageHistory = [];

  // //Reference attaches just the names, descriptions, keywords, categories of all documents, segments, and mappings as references to evaluate against
  // //There also needs to be a cutoff here, if someone has a significant number of files. If its TMI, then perhaps drop descriptions?
  // const getNestedValue = (obj, path) => {
  //   return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  // };

  // const createMapper = (props) => (item) => props.reduce((acc, prop) => {
  //   let value = prop.includes('.') ? getNestedValue(item, prop) : item[prop];
  //   if (prop === 'uuid' && typeof value === 'string') {
  //     value = value.slice(0, 8);
  //   }
  //   return { ...acc, [prop]: value };
  // }, {});

  // let documentMapper = createMapper(['uuid', 'name.en', 'description.en', 'original', 'keywords', 'textLength']);
  // let triageMapper = createMapper(['uuid', 'name.en', 'description.en', 'keywords', 'textLength']);

  // let documentReferences = documents.value.map(documentMapper);
  // let segmentReferences = segments.value.map(triageMapper);
  // // let mappingReferences = mappings.value.map(triageMapper);

  // documentReferences.forEach(doc => {
  //   prompts.value.reference.messageHistory.push({ role: "system", content: `Here is a document you will consider in your analysis:\n\n${JSON.stringify(doc)}` });
  // });

  // segmentReferences.forEach(segment => {
  //   prompts.value.reference.messageHistory.push({ role: "system", content: `Here is a segment of a document you will consider in your analysis:\n\n${JSON.stringify(segment)}` });
  // });

  // //Make the base prompt the last system prompt in the chain, as it seems to get ignored at the beginning.
  // prompts.value.reference.messageHistory.push({ role: "system", content: prompts.value.reference.persona.basePrompt });

  // prompts.value.reference.messageHistory.push({ role: "user", content: `Evaluate the following prompt against this reference material and provide an ordered list of scores and uuids :\n\n${prompts.value.questions.prompt}\n\n Here is the reference documents ${JSON.stringify(documentReferences)}\n\nAnd here are reference segments:\n\n${JSON.stringify(segmentReferences)}` });

  // nextTick(() => {
  //   prompts.value.triage.trigger = !prompts.value.triage.trigger;
  //   prompts.value.reference.trigger = !prompts.value.reference.trigger;
  // });

  nextTick(() => {
    prompts.value.triage.trigger = !prompts.value.triage.trigger;
  });

  //triage
  //reference  
}




function selectReferences() {

  //Step 2 References
  referenceInProgress.value = true;
  prompts.value.reference.promptType = 'reference';
  prompts.value.reference.persona = checkAssignment('reference').persona;
  prompts.value.reference.messageHistory = [];

  //Reference attaches just the names, descriptions, keywords, categories of all documents, segments, and mappings as references to evaluate against
  //There also needs to be a cutoff here, if someone has a significant number of files. If its TMI, then perhaps drop descriptions?
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  };

  const createMapper = (props) => (item) => props.reduce((acc, prop) => {
    let value = prop.includes('.') ? getNestedValue(item, prop) : item[prop];
    if (prop === 'uuid' && typeof value === 'string') {
      value = value.slice(0, 8);
    }
    return { ...acc, [prop]: value };
  }, {});

  let documentMapper = createMapper(['uuid', 'name.en', 'description.en', 'original', 'keywords']);
  let triageMapper = createMapper(['uuid', 'name.en', 'description.en', 'keywords']);

  let documentReferences = documents.value.map(documentMapper);
  let segmentReferences = segments.value.map(triageMapper);
  // let mappingReferences = mappings.value.map(triageMapper);

  documentReferences.forEach(doc => {
    prompts.value.reference.messageHistory.push({ role: "system", content: `Here is a document you will consider in your analysis:\n\n${JSON.stringify(doc)}` });
  });

  segmentReferences.forEach(segment => {
    prompts.value.reference.messageHistory.push({ role: "system", content: `Here is a segment of a document you will consider in your analysis:\n\n${JSON.stringify(segment)}` });
  });

  //Make the base prompt the last system prompt in the chain, as it seems to get ignored at the beginning.
  prompts.value.reference.messageHistory.push({ role: "system", content: prompts.value.reference.persona.basePrompt });
  prompts.value.reference.messageHistory.push({ role: "user", content: `Evaluate the following prompt against this reference material and provide an ordered list of scores and uuids :\n\n${prompts.value.questions.prompt}\n\n Here is the reference documents ${JSON.stringify(documentReferences)}\n\nAnd here are reference segments:\n\n${JSON.stringify(segmentReferences)}` });

  nextTick(() => {
    prompts.value.reference.trigger = !prompts.value.reference.trigger;
  });


}



// function questionWithReferences() {
//   questionInProgress.value = true;
//   prompts.value.question.promptType = 'question';
//   prompts.value.question.persona = checkAssignment('writer').persona;

//   //Build a short message history to contain the information
//   //The system/user prompt likely out performs attaching the docs to the user prompt alone
//   prompts.value.question.messageHistory = [{ role: "system", content: prompts.value.question.persona.basePrompt }];
//   let docsPrompt = "In your analysis, utilize and prioritize these textual files and segments in any answer you provide over general knowledge or other reference data:\n ";
//   let referencePrompt = generateDocumentsAndSegmentsPrompt(docsPrompt, false);
//   if (referencePrompt.count) {
//     //Single system prompt with all files included    
//     // prompts.value.question.messageHistory.push({ role: "system", content: referencePrompt.prompt });

//     //Separate system prompts with each file a separate system prompt
//     for (const prompt of referencePrompt.prompts) { prompts.value.question.messageHistory.push({ role: "system", content: JSON.stringify(prompt) }); }
//   }
//   prompts.value.question.messageHistory.push({ role: "user", content: `Prepare a response for the following question: \n\n ${prompts.value.question.prompt}` })

//   //Trigger the questio after the persona has been set using nextTick
//   nextTick(() => {
//     prompts.value.question.trigger = !prompts.value.question.trigger;
//   });
// }

function questionsWithReferences() {
  questionsInProgress.value = true;
  prompts.value.questions.set = [];

  for (var a = 0; a < settings.value.questions; a++) {
    prompts.value.questions.set.push(createPrompt({ sessionId: uuidv4(), promptType: "questions", persona: checkAssignment('writer').persona, messageHistory: [], message: null, trigger: false }));
    prompts.value.questions.set[a].messageHistory = [{ role: "system", content: prompts.value.questions.set[a].persona.basePrompt }];
    let docsPrompt = "In your analysis, utilize and prioritize these textual files and segments in any answer you provide over general knowledge or other reference data:\n ";
    let referencePrompt = generateDocumentsAndSegmentsPrompt(docsPrompt, false);
    if (referencePrompt.count) {
      for (const prompt of referencePrompt.prompts) { prompts.value.questions.set[a].messageHistory.push({ role: "system", content: JSON.stringify(prompt) }); }
    }
    prompts.value.questions.set[a].messageHistory.push({ role: "user", content: `Prepare a response for the following question: \n\n ${prompts.value.questions.prompt}` })
  }

  nextTick(() => {
    for (var a = 0; a < settings.value.questions; a++) {
      prompts.value.questions.set[a].trigger = !prompts.value.questions.set[a].trigger;
    }
  });


}

function selectAllAnswers() {
  for (const q of prompts.value.questions.set) {
    q._checked = true;
  }
}

function mergeSelectedAnswers() {
  answerInProgress.value = true;

  if (prompts.value.questions.set.length == 1) {
    //Don't regenerate, just keep
    prompts.value.answer.message = prompts.value.questions.set[0].message
  }
  else {
    prompts.value.answer.promptType == 'answer';
    prompts.value.answer.persona = checkAssignment('writer').persona;
    let combinedAnswerPrompt = "Combine and edit together the following draft answers, carefully preserving all the factual details of each answer but integrating it together into one comprehensive, and long form answer as required. Be as complete as possible:\n\n";
    for (var a = 0; a < prompts.value.questions.set.length; a++) {
      combinedAnswerPrompt += prompts.value.questions.set[a].message;
    }
    prompts.value.answer.messageHistory = [{ role: "system", content: prompts.value.answer.persona.basePrompt }];
    prompts.value.answer.messageHistory.push({ role: "user", content: combinedAnswerPrompt });
  }

  nextTick(() => {
    prompts.value.answer.trigger = !prompts.value.answer.trigger;
  });


}


function auditWithReferences() {
  auditInProgress.value = true;
  prompts.value.audit.promptType = 'audit';
  prompts.value.audit.persona = checkAssignment('auditor').persona;
  // prompts.value.audit.message = null;
  prompts.value.audit.json = null;

  //Build a short message history to contain the information
  //The system/user prompt likely out performs attaching the docs to the user prompt alone
  prompts.value.audit.messageHistory = [{ role: "system", content: prompts.value.audit.persona.basePrompt }];

  let docsPrompt = "Here are the source materials that were used in the audit analysis:\n ";
  let referencePrompt = generateDocumentsAndSegmentsPrompt(docsPrompt, false);

  if (referencePrompt.count) {
    //Single system prompt with all files included    
    // prompts.value.audit.messageHistory.push({ role: "system", content: referencePrompt.prompt });

    //Separate system prompts with each file a separate system prompt
    for (const prompt of referencePrompt.prompts) { prompts.value.audit.messageHistory.push({ role: "system", content: JSON.stringify(prompt) }); }
  }


  prompts.value.audit.messageHistory.push({ role: "user", content: `Evaluate the following analysis against the source material and prepare an analysis on your findings: \n\n Here is the analysis that you are to audit against the source materials: \n\n ${prompts.value.answer.message}` })

  //Trigger the questio after the persona has been set using nextTick
  nextTick(() => {
    prompts.value.audit.trigger = !prompts.value.audit.trigger;
  });
}


// function auditWithReferences() {
//   auditInProgress.value = true;
//   prompts.value.audit.json = null;
//   prompts.value.audit.promptType = 'audit';
//   prompts.value.audit.persona = checkAssignment('auditor').persona;
//   let checkedDocuments = documentsFiltered.value ? documentsFiltered.value.filter((doc) => { return doc._checked }) : [];
//   let checkedSegments = segmentsFiltered.value ? segmentsFiltered.value.filter((segment) => { return segment._checked }) : [];
//   let contentDocumentsPrompt = "";
//   let contentSegmentsPrompt = "";
//   if (checkedDocuments?.length) {
//     contentDocumentsPrompt += `Source documents:\n  ${checkedDocuments.map(file => JSON.stringify(file.textContent)).join(',\n')}`
//   }
//   if (checkedSegments?.length) {
//     contentSegmentsPrompt += `Source textual segments:\n  ${checkedSegments.map(file => JSON.stringify(file.textContent)).join(',\n')}`
//   }

//   prompts.value.audit.adaptedPrompt = `Evaluate the following analysis against the source material and prepare an analysis on your findings: \n\n Here is the analysis: ${prompts.value.question.message} \n\n Here are the source materials that were used in the analysis:\n ${contentDocumentsPrompt}  \n\n ${contentSegmentsPrompt}`
//   nextTick(() => {
//     prompts.value.audit.trigger = !prompts.value.audit.trigger;
//   })

//   console.log("Attempting to trigger audit", prompts.value.audit)
// }


function chatModeToggle() {
  if (isChatMode.value) {
    //Set the Persona, if not set
    if (!prompts?.value?.chat?.persona) prompts.value.chat.persona = checkAssignment('writer').persona;

    //Reset / setup the chat messageHistory
    if (prompts?.value?.chat?.messageHistory?.length == 0) {
      prompts.value.chat.messageHistory = [{ role: "system", content: prompts.value.chat.persona.basePrompt }];
    }

  }

}

function chatModeTrigger() {
  // Generate the reference prompt
  let referencePrompt = generateDocumentsAndSegmentsPrompt('Here are references to consider in your answers', false);
  let messageHistory = prompts?.value?.chat?.messageHistory;

  // Update the message history based on the reference prompt count
  if (referencePrompt.count) {
    if (messageHistory && messageHistory.length > 0) {
      // Insert or update at position 1
      if (messageHistory.length === 1 || messageHistory[1]?.role !== 'system') {
        // If there's only one message or the second is not a system message, insert the system message at position 1
        messageHistory.splice(1, 0, { role: "system", content: referencePrompt.prompt });
      } else {
        // Update the second message if it's already a system message
        messageHistory[1].content = referencePrompt.prompt;
      }
    }
  } else {
    // If referencePrompt.count is zero and the second message is a system message, remove it
    if (messageHistory?.length > 1 && messageHistory[1]?.role === 'system') {
      messageHistory.splice(1, 1);
    }
  }

  // Update the message history with base prompt and user input
  prompts.value.chat.messageHistory.push({
    role: "user",
    content: chatPrompt.value
  });

  // Trigger a chat update and clear the chat prompt
  prompts.value.chat.trigger = !prompts.value.chat.trigger;
  nextTick(() => {
    chatPrompt.value = "";
  });
}

function generateDocumentsAndSegmentsPrompt(docsPrompt, useHtml = false) {
  const checkedDocuments = documentsFiltered.value
    ? documentsFiltered.value
      .filter(doc => doc._checked)
      .map(doc => ({
        name: doc.name,
        description: doc.description,
        citationFileInformation: doc.original,
        contents: useHtml ? doc.htmlContent : doc.textContent
      }))
    : [];

  const checkedSegments = segmentsFiltered.value
    ? segmentsFiltered.value
      .filter(seg => seg._checked)
      .map(seg => ({
        name: seg.name,
        description: seg.description,
        contents: useHtml ? seg.htmlContent : seg.textContent
      }))
    : [];

  let contentDocumentsPrompt = "";
  let contentSegmentsPrompt = "";

  // Attach the docs prompts
  if (checkedDocuments.length) {
    contentDocumentsPrompt += `${docsPrompt}:\n${checkedDocuments.map(doc => JSON.stringify(doc)).join(',\n')}`;
  }
  if (checkedSegments.length) {
    contentSegmentsPrompt += `${docsPrompt}:\n${checkedSegments.map(seg => JSON.stringify(seg)).join(',\n')}`;
  }

  return {
    count: checkedDocuments.length + checkedSegments.length, prompt: contentDocumentsPrompt + "\n\n" + contentSegmentsPrompt,
    prompts: checkedDocuments.concat(checkedSegments)
  };
}




function messagePartial(val, prompt) {
  if (prompt?.messageHistory?.length) {
    if (prompt.messageHistory[prompt.messageHistory.length - 1].role == 'user') {
      prompt.messageHistory.push({ role: "system", content: val.message })
    }
    if (prompt.messageHistory[prompt.messageHistory.length - 1].role == 'system' && val.message.length) {
      prompt.messageHistory[prompt.messageHistory.length - 1].content = val.message;
    }
  }
}

function messageComplete(val, prompt) {
  if (prompt?.messageHistory?.length) {
    if (prompt.messageHistory[prompt.messageHistory.length - 1].role == 'system') {
      prompt.messageHistory[prompt.messageHistory.length - 1].content = val.message;
    }
  }

}

function messageError(val, prompt) {
  notify({ group: "failure", title: "Error", text: "Error with prompt. You may be using too many tokens or the service is down. Try again" }, 4000) // 4s
}


function chatClear() {
  prompts.value.chat.messageHistory = prompts.value.chat.messageHistory.slice(0, 1);
}

function chatCopy() {
  let lastMessage = prompts.value.chat.messageHistory[prompts.value.chat.messageHistory.length - 1]
  if (lastMessage.role == 'system')
    prompts.value.answer.message = lastMessage.content;
  isChatMode.value = false;
}

function updateScore(category, score) {
  interactionScore.value[category] = score;
}


function saveArtifacts() {
  let draftArtifact = JSON.parse(JSON.stringify(newArtifact.value));

  let checkedDocuments = documentsFiltered.value ? documentsFiltered.value.filter((doc) => { return doc._checked }) : [];
  let checkedSegments = segmentsFiltered.value ? segmentsFiltered.value.filter((segment) => { return segment._checked }) : [];

  draftArtifact.uuid = uuidv4();
  draftArtifact.name.en = "New Artifact: " + new Date();
  draftArtifact.name.fr = "New Artifact: " + new Date();
  draftArtifact.description.fr = "New Description: " + new Date();
  draftArtifact.description.fr = "New Description: " + new Date();

  //If chat mode
  draftArtifact.chatMessageHistory = prompts.value.chat.messageHistory;

  //Capture the triage information
  draftArtifact.triageText = prompts.value.triage.message;
  draftArtifact.triageJson = prompts.value.triage.json;
  draftArtifact.referenceText = prompts.value.reference.message;
  draftArtifact.referenceJson = prompts.value.reference.json;

  //Capture the prompt and the generated messages
  draftArtifact.prompt = prompts.value.questions.prompt;
  draftArtifact.messages = prompts.value.questions.set.map((set) => { return set.message });
  draftArtifact.finalText.en = prompts.value.answer.message;

  //Capture the Audit
  draftArtifact.auditText = prompts.value.audit.message;
  draftArtifact.auditJson = prompts.value.audit.json;

  //Capture the user feedback
  draftArtifact.completeness = interactionScore.value.completeness;
  draftArtifact.accuracy = interactionScore.value.accuracy;
  draftArtifact.tone = interactionScore.value.tone;
  draftArtifact.overall = interactionScore.value.overall;
  draftArtifact.comments = interactionScore.value.comments;

  //Capture the personas used and the documents checked
  draftArtifact.personaUuids = wrappAssignments.value.map((wA) => { return wA.persona.uuid })
  draftArtifact.documentUuids = checkedDocuments.map((doc) => { return doc.uuid })
  draftArtifact.segmentUuids = checkedSegments.map((segment) => { return segment.uuid })

  createArtifacts(selectedKnowledgeSet.value.uuid, [draftArtifact]);
}

function selectSavedArtifact(index) {
  let draftArtifact = artifacts.value[index];
  // console.log(index)
  if (draftArtifact) {

    prompts.value.chat.messageHistory = draftArtifact.chatMessageHistory;
    if (draftArtifact.messageHistory?.length) prompts.value.chat.messageHistory = draftArtifact.MessageHistory; //old version of schema

    prompts.value.triage.message = draftArtifact.triageText;
    prompts.value.triage.json = draftArtifact.triageJson;
    prompts.value.reference.message = draftArtifact.referenceText;
    prompts.value.reference.json = draftArtifact.referenceJson;

    prompts.value.questions.prompt = draftArtifact.prompt;

    if (draftArtifact?.messages?.length) {
      prompts.value.questions.set = [];
      for (const message of draftArtifact.messages) {
        prompts.value.questions.set.push({ message: message })
      }
    }
    prompts.value.answer.message = draftArtifact.finalText.en + "\n\n" + draftArtifact.finalText.fr;

    prompts.value.audit.message = draftArtifact.auditText;
    prompts.value.audit.json = draftArtifact.auditJson;

    interactionScore.value.completeness = draftArtifact.completeness;
    interactionScore.value.accuracy = draftArtifact.accuracy;
    interactionScore.value.tone = draftArtifact.tone;
    interactionScore.value.overall = draftArtifact.overall;
    interactionScore.value.comments = draftArtifact.comments;

    //Recheck the artifacts
    documents.value.forEach((doc) => {
      doc._checked = draftArtifact.documentUuids.includes(doc.uuid);
    });

    segments.value.forEach((segment) => {
      segment._checked = draftArtifact.segmentUuids.includes(segment.uuid);
    });

    activeTab.value = 6;
  }

}

function eventUpdateSegment(segment) {
  updateSegments(selectedKnowledgeSet.value.uuid, [segment])
}
const calculateSizeOfChecked = computed(() => {
  let docsContentLength = documentsChecked.value.reduce((acc, item) => acc + item.textContent.length, 0);
  let segsCheckedLength = segmentsChecked.value.reduce((acc, item) => acc + item.textContent.length, 0);

  let totalLength = docsContentLength + segsCheckedLength;
  let formattedLength = totalLength.toLocaleString();

  let percentage = (totalLength / 400000) * 100;
  let formattedPercentage = percentage.toFixed(2) + '%';

  return { totalLength, formattedLength, formattedPercentage };
});


</script>