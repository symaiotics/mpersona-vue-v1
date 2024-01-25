<template>
  <template v-if="props?.personas">
    <div :class="alignmentClasses">
      <div class="flex flex-col">
        <div v-for="(persona, index) in props.personas" :key="persona.uuid" class="mb-4">
          <img @click="selectPersona(persona)" :class="{ 'border-4 border-blue-500': isSelectedPersona(persona, index) }"
            class="object-cover w-full rounded-lg md:h-24 md:w-24" :src="persona.url" :alt="persona.name" />
        </div>
      </div>
    </div>
  </template>
</template>
<script setup>
import { computed, ref } from 'vue';
import defaultImage from "../images/persona1.png";

const props = defineProps({
  personas: { type: Array, default: [] },
  selectedPersonaIndex: { type: Number, default: 0 },
  alignment: { type: String, default: 'left' }
});

const emit = defineEmits(['selectPersona']);

let selectedPersona = ref(null);
let selectedPersonaIndex = computed(() => { return props.selectedPersonaIndex })

function selectPersona(persona) {
  selectedPersona.value = persona;
  emit('selectPersona', persona);
}

function isSelectedPersona(persona, index) {
  return (selectedPersonaIndex.value == index);
}

const alignmentClasses = computed(() => ({
  flex: true,
  'flex-col': true,
  'items-center': props.alignment === 'center',
}));

const textAlignmentClasses = computed(() => ({
  'text-center': props.alignment === 'center',
  'pl-3': props.alignment !== 'center',
  'pr-2': props.alignment !== 'center',
  'pt-3': props.alignment !== 'center',
  'leading-normal': true,
}));

</script>
  