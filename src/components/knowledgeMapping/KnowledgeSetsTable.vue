<template>

    {{ knowledgeSets }}


</template>
  
<script setup>
import { ref, watch } from 'vue';
import { useLexicon } from '@/composables/useLexicon.js'
import { useKnowledgeSets } from '@/composables/knowledgeMapping/useKnowledgeSets.js'
const { L_ } = useLexicon()
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

function add() {
    addNewKnowledgeSet();
}


</script>