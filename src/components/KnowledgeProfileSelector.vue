<template>
    <VueMultiselect v-if="knowledgeProfiles" v-model="localKnowledgeProfiles"
        @update:modelValue="(value) => handleKnowledgeProfilesUpdate(value, props.index)"
        placeholder="Select a Knowledge Profile" label="name" track-by="name" :options="knowledgeProfiles" :multiple="true"
        :option-height="104" :custom-label="customLabel" :show-labels="false" />
</template>
  
<script setup>
//Plugins
import { ref, onMounted, computed } from 'vue';
import VueMultiselect from 'vue-multiselect'

//Componenmts
import { useKnowledgeProfiles } from '@/composables/useKnowledgeProfiles.js';

//Composables
const { knowledgeProfiles, selectedKnowledgeProfile } = useKnowledgeProfiles();

//Props and Emits
let props = defineProps({ index: { type: Number, default: 0 }, selected:{type: Array, default:[]} })
let emit = defineEmits(['knowledgeProfilesUpdate']);

//Variables
let localKnowledgeProfiles = ref([])
const customLabel = (option) => option ? option.name : '';

//Lifecycle Hooks
onMounted(()=>{
 localKnowledgeProfiles.value = props.selected;
})

//Functions
function handleKnowledgeProfilesUpdate(newValue, index) {
    emit("knowledgeProfilesUpdate", { knowledgeProfiles: newValue, index: index })
}
</script>
  
