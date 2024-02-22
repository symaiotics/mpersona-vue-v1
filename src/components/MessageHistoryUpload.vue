<template>
  <button
    @click="upload"
    class="btn btn-small text-white bg-cyan-700 hover:bg-cyan-400 flex items-center mb-3"
  >
    <ArrowUpTrayIcon class="h-6 w-6 text-gray-200 transform hover:scale-105" />
    <span class="ml-2">({{ props.format.toUpperCase() }})</span>
  </button>
  <input type="file" ref="fileInput" @change="handleFiles" hidden />
</template>

<script setup>
import { ref } from "vue";
import { ArrowUpTrayIcon } from "@heroicons/vue/24/solid";

const props = defineProps({
  format: {
    type: String,
    default: "json",
    validator: (value) => ["json", "docx"].includes(value),
  },
});
const emit = defineEmits(["complete", "error"]);
const fileInput = ref(null);

const upload = () => {
  if (fileInput.value) {
    fileInput.value.click(); // Trigger the file input click event
  }
};

const handleFiles = (event) => {
  const files = event.target.files;
  if (files.length === 0) {
    return;
  }

  const file = files[0];
  if (props.format === "json" && file.type === "application/json") {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        const array = Array.isArray(json) ? json : [json]; // Convert to array if not already
        emit("complete", array); // Emit the array to the parent
      } catch (error) {
        emit("error", error); // Emit an error if JSON parsing fails
      }
    };
    reader.onerror = (error) => {
      emit("error", error); // Emit an error if reading the file fails
    };
    reader.readAsText(file); // Read the file as text
  } else {
    emit("error", new Error("Unsupported file format")); // Emit an error for unsupported formats
  }
};
</script>