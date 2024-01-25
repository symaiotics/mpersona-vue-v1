<template>
    <div class="p-2">
        <div class="flex items-center mb-2">
            <input type="checkbox" v-model="checkboxes.allContent" class="mr-1 checkbox-large" @change="checkAllContent" />
            <label class="label-style">All Content</label>
        </div>
        <div class="flex items-center mb-2">
            <input type="checkbox" v-model="checkboxes.allArtifacts" class="mr-1 checkbox-large"
                @change="() => checkOthers('allArtifacts')" />
            <label class="label-style">All Artifacts</label>
        </div>
        <div class="flex items-center mb-2">
            <input type="checkbox" v-model="checkboxes.json" class="mr-1 checkbox-large"
                @change="() => checkOthers('json')" />
            <label class="label-style">JSON</label>
        </div>
        <div class="flex items-center mb-2">
            <input type="checkbox" v-model="checkboxes.code" class="mr-1 checkbox-large"
                @change="() => checkOthers('code')" />
            <label class="label-style">Code</label>
        </div>
    </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';



const emit = defineEmits(['update:options']);
const props = defineProps({
    options: {
        type: Object,
        default: () => ({
            allContent: true,
            allArtifacts: true,
            json: true,
            code: true,
        }),
    },
});


const defaultOptions = {
    allContent: true,
    allArtifacts: true,
    json: true,
    code: true,
};

const checkboxes = ref(defaultOptions);

onMounted(() => {
    if (props.options) {
        checkboxes.value = { ...props.options };
    } else {
        checkboxes.value = { ...defaultOptions };
    }
    emit('update:options', { ...checkboxes.value });
});

// Keep only this watcher
watch(checkboxes, (newVal, oldVal) => {
    if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
        emit('update:options', newVal);
    }
});

// const defaultOptions = {
//   allContent: true,
//   allArtifacts: true,
//   json: true,
//   code: true,
// };

// let checkboxes = ref({
//   allContent: true,
//   allArtifacts: true,
//   json: true,
//   code: true,
// });

// onMounted(() => {
// //   if (props.options) {
// //     checkboxes.value = props.options;
// //   } else {
// //     checkboxes.value = defaultOptions ;
// //   }

//   console.log("Mounted", checkboxes.value )
//   emit('update:options', { ...checkboxes.value });
// });



// watch(
//   () => props.options,
//   (newOptions, oldOptions) => {
//     if (JSON.stringify(newOptions) !== JSON.stringify(oldOptions)) {
//       checkboxes.value = { ...newOptions };
//       emit('update:options', { ...newOptions });
//     }
//   },
//   { deep: true, immediate: true }
// );

// // Sending emits
// watch(checkboxes,
//     (newVal, oldVal) => {
//         if (JSON.stringify(newVal) !== JSON.stringify(oldVal)) {
//             emit('update:options', newVal);
//         }
//     }
// );


const checkAllContent = () => {
    if (checkboxes.value.allContent) {
        checkboxes.value.allArtifacts = true;
        checkboxes.value.json = true;
        checkboxes.value.code = true;
    } else {
        checkboxes.value.allArtifacts = false;
        checkboxes.value.json = false;
        checkboxes.value.code = false;
    }
    emit('update:options', checkboxes.value);
};

const checkOthers = (source) => {
    if (source === 'allArtifacts') {
        if (checkboxes.value.allArtifacts) {
            checkboxes.value.json = true;
            checkboxes.value.code = true;
        } else {
            checkboxes.value.json = false;
            checkboxes.value.code = false;
        }
    } else if (source === 'json' || source === 'code') {
        if (!checkboxes.value.json || !checkboxes.value.code) {
            checkboxes.value.allArtifacts = false;
        } else {
            checkboxes.value.allArtifacts = true;
        }
    }

    if (!checkboxes.value.allArtifacts || !checkboxes.value.json || !checkboxes.value.code) {
        checkboxes.value.allContent = false;
    }

    emit('update:options', checkboxes.value);
};

</script>

    
 
<style scoped>
.checkbox-large {
    width: 20px;
    height: 20px;
}

.label-style {
    margin-left: 0.5rem;
}
</style>