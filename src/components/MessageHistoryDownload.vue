<template>
  <button
    @click="download"
    class="btn btn-small m-2 text-white bg-gray-500 hover:bg-teal-400 flex items-center mb-3"
  >
    <ArrowDownTrayIcon
      class="h-6 w-6 text-gray-200 transform hover:scale-105"
    />
    <span class="ml-2"> ({{ props.format.toUpperCase() }})</span>
  </button>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
import { ArrowDownTrayIcon } from "@heroicons/vue/24/solid";

//DOCX File Save Plugins
import { Document, Packer, Paragraph, TextRun, UnderlineType } from 'docx';
import { saveAs } from 'file-saver';
import { marked } from 'marked';

const props = defineProps({
  format: {
    type: String,
    default: "json",
    validator: (value) => ["json", "docx"].includes(value),
  },
  filename: { type: String, default: "mPersonaChat" },
  messageHistory: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["complete", "error"]);

const download = () => {
  if (props.format == "json") downloadJson();
  else downloadDocx();
};

//Download as JSON
const downloadJson = () => {
  try {
    const blob = new Blob([JSON.stringify(props.messageHistory)], {
      type: "application/json",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = props.filename + ".json";
    link.click();
    URL.revokeObjectURL(link.href);
    emit("complete", props.filename);
  } catch (error) {
    console.log(error)
    emit("error", error);
  }
};

//Download as Word
async function downloadDocx() {
  // Create a new document
  try {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: createDocumentBody(props.messageHistory),
        },
      ],
    });

    // Use Packer to generate a Blob from the document
    const blob = await Packer.toBlob(doc);
    // Save the Blob as a DOCX file
    saveAs(blob, props.filename + ".docx");
    emit("complete", props.filename);
  } catch (error) {
    console.log(error)
    emit("error", error);
  }
}

function createDocumentBody(dataArray) {
  return dataArray.map((item) => {
    // Convert markdown to HTML
    const htmlContent = marked(item.content);
    // Convert HTML to plain text, preserving line breaks
    const textLines = htmlContent.split(/<br\s*\/?>/i); // Split the content by HTML <br> tags

    // Create a TextRun for each line, preserving line breaks
    const textRuns = textLines.flatMap((line, index) => {
      // Convert the line from HTML to plain text
      const plainText = line.replace(/<[^>]+>/g, ""); // Remove HTML tags
      // For the last line, no need to add a break
      return index < textLines.length - 1
        ? [new TextRun(plainText), new TextRun({ text: "", break: "line" })]
        : [new TextRun(plainText)];
    });

    // Combine all TextRuns into a single Paragraph
    return new Paragraph({
      children: [
        new TextRun({
          text: `${item.role}: `,
          bold: true,
          size: 24,
        }),
        ...textRuns, // Spread syntax to include all text runs
      ],
    });
  });
}

function htmlToPlainText(html) {
  const tempDivElement = document.createElement("div");
  tempDivElement.innerHTML = html;
  return tempDivElement.textContent || tempDivElement.innerText || "";
}
</script>
