<template>
    <div>
        <div @click="openFileDialog" @dragover.prevent="dragOverHandler" @dragleave="dragLeaveHandler"
            @drop.prevent="dropHandler"
            :class="isDraggingOver ? 'bg-gray-300 dark:bg-gray-700' : 'bg-gray-100 dark:bg-gray-800'"
            class="border p-6 rounded-md transition-colors duration-300 cursor-pointer dark:hover:bg-slate-700 hover:bg-gray-200">
            <input type="file" ref="fileInput" @change="handleFilesChange" multiple hidden accept=".docx">
            <p class="text-center text-gray-500 dark:text-gray-200">
                Drag and drop or click to select your <strong>.docx</strong> files here.
            </p>
        </div>
    </div>
</template>
  
<script setup>
import { ref, defineEmits } from 'vue';
import mammoth from 'mammoth';
import html2canvas from 'html2canvas';
import { v4 as uuidv4 } from 'uuid';

const fileInput = ref(null);
const isDraggingOver = ref(false);
const emit = defineEmits(['processingStarted', 'processingCompleted']);

const openFileDialog = () => {
    fileInput.value.click();
};

const dragOverHandler = () => {
    isDraggingOver.value = true;
};

const dragLeaveHandler = () => {
    isDraggingOver.value = false;
};

const dropHandler = (event) => {
    isDraggingOver.value = false;
    handleFilesChange(event);
};

const handleFilesChange = async (event) => {
    const files = event.dataTransfer ? event.dataTransfer.files : event.target.files;
    const docxFiles = Array.from(files).filter(file => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');

    emit('processingStarted');

    const filePreviews = [];


    for (const file of docxFiles) {
        const fileMetadata = {
            uuid:uuidv4(),
            name: file.name,
            type: file.type,
            size: file.size,
            lastModified: file.lastModified,
            imgSrc: '',
            htmlContent: '',
            selected: false
        };

        try {
            const arrayBuffer = await file.arrayBuffer();
            const result = await mammoth.convertToHtml({ arrayBuffer });
            const html = result.value;
            fileMetadata.htmlContent = html; // Store the original HTML content
            fileMetadata.text = stripHtml(html); // Store the stripped HTML content
            const blob = new Blob([`<html><body>${html}</body></html>`], { type: 'text/html' });
            const blobUrl = URL.createObjectURL(blob);

            const iframe = document.createElement('iframe');
            iframe.style.position = 'absolute';
            iframe.style.width = '8.5in'; // Set width to match 8.5 inches
            iframe.style.height = '11in'; // Set height to match 11 inches
            iframe.style.left = '-10000px'; // Move the iframe off-screen
            iframe.style.top = '-10000px';
            document.body.appendChild(iframe);

            await new Promise((resolve, reject) => {
                iframe.onload = () => {
                    setTimeout(async () => {
                        try {
                            const body = iframe.contentWindow.document.body;
                            body.style.width = '8.5in'; // Set the width of the body
                            body.style.height = '11in'; // Set the height of the body
                            body.style.overflow = 'hidden'; // Hide any overflow
                            const canvas = await html2canvas(body, {
                                width: iframe.offsetWidth,
                                height: iframe.offsetHeight,
                                windowWidth: iframe.contentWindow.document.documentElement.scrollWidth,
                                windowHeight: iframe.contentWindow.document.documentElement.scrollHeight
                            });
                            fileMetadata.imgSrc = canvas.toDataURL('image/png');
                            filePreviews.push(fileMetadata);
                            resolve();
                        } catch (error) {
                            console.error('Error generating image preview:', error);
                            reject(error);
                        } finally {
                            document.body.removeChild(iframe);
                            URL.revokeObjectURL(blobUrl);
                        }
                    }, 500); // Adjust timeout as needed
                };
                iframe.src = blobUrl;
            });
        } catch (error) {
            console.error('Error converting .docx to HTML:', error);
        }
    }

    emit('processingCompleted', filePreviews);
};

function stripHtml(html) {
  const doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || '';
}

</script>

 