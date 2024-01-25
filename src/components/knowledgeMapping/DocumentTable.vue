<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg m-2">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">{{ L_("Select") }}</th>
          <th v-if="!simple" scope="col" class="py-3 px-6">{{ L_("Status") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("File Name") }}</th>
          <th v-if="!simple" scope="col" class="py-3 px-6">{{ L_("Name (EN)") }}</th>
          <th v-if="!simple" scope="col" class="py-3 px-6">{{ L_("Name (FR)") }}</th>
          <!-- <th scope="col" class="py-3 px-6">{{ L_("Description") }}</th> -->
          <th scope="col" class="py-3 px-6">{{ L_("Size") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Edit") }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(doc, index) in props.documents" :key="'doc' + doc.uuid">

          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="py-1 px-6">
              <input type="checkbox" :checked="doc._checked"
                class="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :aria-label="`Select document ${doc?.original?.name}`"
                @change="emitChecked(doc.uuid, $event.target.checked)">
            </td>
            <td v-if="!simple" class="min-w-48">
              {{ doc._processingStatus }}&nbsp;<span v-if="doc._processingStatusNumber">({{ doc._processingStatusNumber
              }})</span>
            </td>
            <!-- <td class="py-1 px-6">
            <img v-if="doc.imgSrc" :src="doc.imgSrc" alt="Document Thumbnail" class="w-24 h-24 object-cover">
          </td> -->
            <td class="py-1 px-6">{{ doc?.original?.name }}</td>
            <td v-if="!simple" class="py-1 px-6">{{ doc?.name?.en }} </td>
            <td v-if="!simple" class="py-1 px-6"> {{ doc?.name?.fr }}</td>
            <!-- <td class="py-1 px-6">{{ doc.description.en  }} / {{  doc.description.fr }}</td> -->
            <td class="py-1 px-6">{{ lenInKb(doc, 'htmlContent') }} ({{  lenInKb(doc, 'textContent') }})</td>

            <td class="py-1 px-6">
              <div class="flex space-x-1">

                <button
                  class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  @click="emitEditEvent(index)">
                  {{ L_("Edit") }}
                </button>
                <button
                  class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
                  @click="emitViewEvent(index)">
                  {{ L_("View") }}
                </button>
              </div>

            </td>
          </tr>
          <tr v-if="props.showTags" class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td colSpan="7" class="p-2">
              Tags: <span v-for="tag in doc.tagUuids"
                class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">
                <div v-if="tagLookup(tag)?.name">
                  {{ tagLookup(tag).name?.en ? tagLookup(tag).name?.en : "" }} {{ tagLookup(tag)?.name?.fr ? " |" +
                    tagLookup(tag).name.fr : "" }}
                </div>
              </span>
            </td>
          </tr>
        </template>

      </tbody>
    </table>
  </div>
</template>

  
<script setup>
import { ref } from 'vue';
import { useLexicon } from '@/composables/useLexicon.js';
import { useTags } from '@/composables/knowledgeMapping/useTags.js';
const { L_ } = useLexicon();
const { tagLookup } = useTags();

const props = defineProps({
  documents: Array,
  showTags: { type: Boolean, default: false },
  simple: { type: Boolean, default: false }
});

const selectedIndex = ref(null);
const emit = defineEmits(['checked', 'edit', 'view']);

const emitChecked = (uuid, isChecked) => {
  emit('checked', { uuid, isChecked });
};

const emitEditEvent = (index) => {
  emit('edit', index);
}

const emitViewEvent = (index) => {
  emit('view', index);
}


function lenInKb(doc, type = 'textContent') {
  let length = 0;
  if(type == 'textContent') length = doc.textContent?.length;
  if(type == 'htmlContent') length = doc.htmlContent?.length;
  if (length) return (length / 1000).toFixed(1) + "KB";
  else return "0KB";
}
</script>
