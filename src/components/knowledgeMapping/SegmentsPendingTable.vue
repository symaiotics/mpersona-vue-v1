<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg m-2">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">{{ L_("Select") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Status") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Cursor") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Size") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Preview") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Visual") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Edit") }}</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in props.data" :key="'segment' + index">
          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="py-1 px-6">
              <input type="checkbox" v-model="item._checked"
                class="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                :aria-label="`Select segment ${item?.original?.name}`"
                @change="emitChecked(index, $event.target.checked)">
            </td>
            <td class="min-w-48">
              {{ item._processingStatus }}&nbsp;<span v-if="item._processingStatusNumber">({{ item._processingStatusNumber
              }})</span>
            </td>
            <td class="py-1 px-6">{{ item?.cursorIndex }}</td>
            <td class="py-1 px-6">{{ item.textLength }}</td>
            <td class="py-1 px-6">{{ item?.extract }}...</td>
            <td class="py-1 px-6">
              <div class="relative w-64 h-4 bg-gray-300 dark:bg-gray-600">
                <div :style="segmentStyle(item, index)" class="h-4 bg-blue-400"></div>
              </div>
            </td>
            <td class="py-1 px-6">
              <div class="space-x-2">
                <button @click="emitRemoveEvent(index)"
                  class="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white font-bold p-2 rounded w-auto transition-colors duration-150">
                  <TrashIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
                </button>
              </div>
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
  fullText: String,
  fullHtml: String,
});

const selectedIndex = ref(null);
const emit = defineEmits(['checked', 'edit', 'remove']);

const emitChecked = (index, isChecked) => {
  emit('checked', { index, isChecked });
};

const emitEditEvent = (index) => {
  emit('edit', index);
}

const emitRemoveEvent = (index) => {
  emit('remove', index);
}

function calculateSegmentSize(cursorIndex, index, segmentsLength) {
  

    if (index < segmentsLength) {
      //Not the last segment
      let nextCursor = props.data[index + 1].cursorIndex;
      return nextCursor - cursorIndex;
    }
    else {
      // lastSegment
      return props.fullText.length - cursorIndex;
    }

  
  return 0;
}

function segmentStyle(item, index) {
  const segmentSize = calculateSegmentSize(item?.cursorIndex, index, props.data.length - 1);
  const fullTextLength = props.fullText.length;
  const widthPercent = (segmentSize / fullTextLength) * 100;

  return {
    width: widthPercent + '%',
    position: 'absolute',
    left: ((item.cursorIndex / fullTextLength) * 100) + '%'
  };
}

</script>