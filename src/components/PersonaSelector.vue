<template>
    <VueMultiselect v-if="personas" v-model="localPersonas"
        @update:modelValue="(value) => handlePersonasUpdate(value, props.index)" placeholder="Select Personas" label="name"
        track-by="name" :options="personas" :multiple="true" :option-height="104" :custom-label="customLabel"
        :show-labels="false" />
</template>
  
<script setup>
//Plugins
import { ref, onMounted, computed } from 'vue';
import VueMultiselect from 'vue-multiselect'

//Componenmts
import { usePersonas } from '@/composables/usePersonas.js';

//Composables
const { personas, selectedPersona } = usePersonas();

//Props and Emits
let props = defineProps({
    index: { type: Number, default: 0 },
    selected: { type: Array, default: [] },
    selectedUuids: { type: Array, default: [] },
});
let emit = defineEmits(['personasUpdate']);

// Variables
let localPersonas = ref([]);
const customLabel = (option) => option ? option.name : '';

// Lifecycle Hooks
onMounted(() => {
    // Initially set localPersonas to the selected personas passed in props
    localPersonas.value = props.selected;

    // If selectedUuids were provided, filter the personas based on these UUIDs
    if (props.selectedUuids.length) {
        localPersonas.value = personas.value.filter((persona) => {
            return props.selectedUuids.includes(persona.uuid);
        });
    }

});


//Functions
function handlePersonasUpdate(newValue, index) {
    emit("personasUpdate", { personas: newValue, index: index })
}
</script>
  
