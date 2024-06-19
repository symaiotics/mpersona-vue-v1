<template class="bg-white dark:bg-gray-800">
  <div class="w-full h-20">
    <Header />
  </div>
</template>
<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch, watchEffect } from "vue";

const mammoth = require("mammoth");
const { JSDOM } = require("jsdom");
const nlp = require("compromise");

let resultsOfStep1 = ref({
  fileName: "Consumer Packaging and Labelling Act.docx",
  summary:
    "This document contains the Consumer Packaging and Labelling Act, which regulates the packaging, labelling, sale, importation, and advertising of prepackaged and other specified products. It addresses prohibitions on misleading labels and advertising, standardization of containers, enforcement, offences, and powers to make regulations, ensuring consumer protection and fair practice in the marketplace.",
  headerTerms: [
    "Short Title",
    "Interpretation",
    "Application of Act",
    "Prohibitions",
    "Labels",
    "Standardization of Containers",
    "Research and Studies",
    "Enforcement",
    "Obstruction and false statements",
    "Seizure",
    "Application to extend period of detention",
    "Forfeiture on consent",
    "Regulations",
    "Publication of Proposed Regulations",
    "Offences and Punishment",
    "RELATED PROVISIONS",
  ],
});

/*1

Allow the user to upload as many word files as like
Identify the headers and the structure of the document.
Split the document using the locations that match that where it is a header.
Use the NPM to find further headers to split
Split the contents
View the splits
Vectorize the split contents
save them as segments
Search the segment vectors and return the matching vectorized semgnets
Attach them to the query
Read back the location where it came from. 

Apply the structure headings as a hierarchy. See what the sub element falls within the main element. 





*/
</script>
