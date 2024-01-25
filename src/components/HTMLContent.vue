<template>

<h2>{{ title }}</h2>
<div class="w-full" v-html="html">

    </div>
</template>

<script setup>

const props = defineProps({
    title: { type: String, default: "Results" },
    html: { type: String, default: "<h2>Hello</h2>" }
});

</script>

