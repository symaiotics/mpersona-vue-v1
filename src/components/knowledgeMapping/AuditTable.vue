<template>
  <div class="overflow-x-auto relative shadow-md sm:rounded-lg m-2">
    <table class="font-lato w-full text-md text-left text-gray-700 dark:text-gray-200">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <th scope="col" class="py-3 px-6">{{ L_("#") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Findings") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Risk") }}</th>
          <th scope="col" class="py-3 px-6">{{ L_("Text") }}</th>

        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in props.data" :key="'doc' + index">

          <tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td class="py-1 px-6">{{ index + 1 }} </td>
            <td class="py-1 px-6"> {{ item?.findings?.en ? item?.findings.en : "" }} </td>
            <!--{{ item?.findings?.fr ? " | " + item?.findings.fr : "" }}-->
            <td :class="{
              'bg-green-200 dark:bg-green-700': item?.risk === 'low',
              'bg-yellow-200 dark:bg-yellow-700': item?.risk === 'medium',
              'bg-red-200 dark:bg-red-700': item?.risk === 'high'
            }" class="py-1 px-6">
              {{ item?.risk }}
            </td>
            <td class="py-1 px-6"> {{ item?.text }} </td>

          </tr>
          <tr v-if="item.citationIfApplicable" class="font-bold bg-white border-b dark:bg-gray-800 dark:border-gray-700">
            <td colspan="3" class="py-1 px-6"> {{ L_("Citation") }} </td>
            <td colspan="1" class="py-1 px-6"> {{ item.citationIfApplicable }}</td>
          </tr>
        </template>

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


</script>