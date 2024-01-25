<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg m-2">
    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">{{ L_("Select") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Name (EN)") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Name (FR)") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Edit") }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.data" :key="'doc' + index"
          class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td class="py-1 px-6">
            <input type="checkbox" v-model="item._checked"
              class="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
              :aria-label="`Select tag ${item?.name.en} |  ${item?.name.fr}`"
              @change="emitChecked(index, $event.target.checked)">
          </td>
          <td class="py-1 px-6">{{ item?.name?.en }} </td>
          <td class="py-1 px-6"> {{ item?.name?.fr }}</td>

          <td class="py-1 px-6">
            <button
              class="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 text-center dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-800"
              @click="emitEditEvent(index)">
              {{ L_("Edit") }}
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

  
<script setup>
import { ref } from 'vue';
import { useLexicon } from '@/composables/useLexicon.js';
const { L_ } = useLexicon();

const props = defineProps({
  data: Array
});

const selectedIndex = ref(null);
const emit = defineEmits(['checked', 'edit']);

const emitChecked = (index, isChecked) => {
  emit('checked', { index, isChecked });
};

const emitEditEvent = (index) => {
  emit('edit', index);

}
 
</script>