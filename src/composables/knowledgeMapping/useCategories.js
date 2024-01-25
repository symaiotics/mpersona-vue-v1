import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let categories = ref(null); //From the database
let selectedCategory = ref(null) //the actively selected persona

//This is a single category
//We save an array of these
const defaultCategory = {
    name: { en: '', fr: '' },
    description: { en: '', fr: '' },
    context: { en: '', fr: '' }
};

const newCategory = ref({ ...defaultCategory });

// by convention, composable function names start with "use"
export function useCategories() {

    const resetCategory = () => {
        Object.assign(newCategory.value, defaultCategory);
    };

    const addNewCategory = () => {
        resetCategory();
        selectedCategory.value = newCategory.value;

    };

    async function getCategories(knowledgeSetUuid) {
        try {
            let params = { params: { knowledgeSetUuid } }
            var response = await configuredAxios.get(env.API_URL + '/categories', params);
            categories.value = response.data.payload;
            console.log("Loaded Category", categories.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createCategories(knowledgeSetUuid, categories) {
        try {
            if (!Array.isArray(categories)) categories = [categories]
            var params = { knowledgeSetUuid, categories }
            var response = await configuredAxios.post(env.API_URL + '/categories', params);
            console.log("Created Category(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Category(s) created successfully" }, 4000) // 4s
            getCategories(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Category. Try again" }, 4000) // 4s

        }
    }


    async function updateCategories(knowledgeSetUuid, categories) {
        try {
            if (!Array.isArray(categories)) categories = [categories]
            var params = { knowledgeSetUuid, categories }
            var response = await configuredAxios.patch(env.API_URL + '/categories', params);
            console.log("Updated Category(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Category(s) updated successfully" }, 4000) // 4s
            getCategories(knowledgeSetUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating Category. Try again" }, 4000) // 4s

        }
    }

    async function deleteCategories(knowledgeSetUuid, categoryUuids) {
        try {
            var params = { knowledgeSetUuid, categoryUuids }
            var response = await configuredAxios.post(env.API_URL + '/categories/delete', params);
            console.log("Deleted Category(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Category(s) deleted successfully" }, 4000) // 4s
            getCategories(knowledgeSetUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Category(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultCategory,
        newCategory,
        categories,
        selectedCategory,

        addNewCategory,
        resetCategory,

        getCategories,
        createCategories,
        updateCategories,
        deleteCategories

    }
}