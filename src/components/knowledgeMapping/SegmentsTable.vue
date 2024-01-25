<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg m-2">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">{{ L_("Select") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Source Name") }}(EN)</th>
          <th scope="col" class="py-3 px-6">{{ L_("Source Name") }}(FR)</th>
          <th scope="col" class="py-3 px-6">{{ L_("Name") }}(EN)</th>
          <th scope="col" class="py-3 px-6">{{ L_("Name") }}(FR)</th>
          <th scope="col" class="py-3 px-6">{{ L_("Size") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Edit") }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in props.data" :key="'segment' + item.uuid">
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="py-1 px-6">
              <input type="checkbox" :checked="item._checked"
                class="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :aria-label="`Select segment ${item?.original?.name}`"
                @change="emitChecked(item.uuid, $event.target.checked)">
            </td>

            <td class="py-1 px-6">{{ item?.documentName?.en }}</td>
            <td class="py-1 px-6">{{ item?.documentName?.fr }}</td>
            <td class="py-1 px-6">{{ item?.name?.en }}</td>
            <td class="py-1 px-6">{{ item?.name?.fr }}</td>
            <td class="py-1 px-6">{{ lenInKb(item) }}</td>
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
              Tags: <span v-for="tag in item.tagUuids"
                class="inline-block bg-gray-200 dark:bg-gray-700 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 dark:text-gray-200 mr-2 mb-2">

                <div v-if="tagLookup(tag)?.name">
                  {{ tagLookup(tag).name?.en ? tagLookup(tag).name?.en : "" }} {{ tagLookup(tag)?.name?.fr ? " |" +
                    tagLookup(tag).name.fr : "" }}
                  <!-- {{ tagLookup(tag).name.fr }} -->
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
import { TrashIcon } from '@heroicons/vue/24/solid'

const { L_ } = useLexicon();
const { tagLookup } = useTags();
const props = defineProps({
  data: Array,
  showTags: { type: Boolean, default: false }

});

const selectedIndex = ref(null);
const emit = defineEmits(['checked', 'edit', 'remove', 'view']);

const emitChecked = (uuid, isChecked) => {
  emit('checked', { uuid, isChecked });
};

const emitEditEvent = (index) => {
  emit('edit', index);
}

const emitViewEvent = (index) => {
  emit('view', index);
}

const emitRemoveEvent = (index) => {
  emit('remove', index);
}


function lenInKb(doc) {
  let length = doc.htmlContent?.length || doc.textContent?.length;
  if (length) return (length / 1000).toFixed(1) + "KB"
}


</script>