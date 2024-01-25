import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";

let adminCategories = ref(
    [
        {
            code: 0,
            alpha: 'software',
            label: { en: 'Software', fr: "Logiciel" }
        },
        {
            code: 1,
            alpha: 'policy',
            label: { en: 'Policy', fr: "Politique" }
        },
        {
            code: 2,
            alpha: 'technicalWriting',
            label: { en: 'Technical Writing', fr: "Rédaction Technique" }
        },
        {
            code: 3,
            alpha: 'customerSupport',
            label: { en: 'Customer Support', fr: "Service client" }
        },
        {
            code: 4,
            alpha: 'managementConsultant',
            label: { en: 'Management Consultant', fr: "Scientifique des données" }
        },
        {
            code: 5,
            alpha: 'dataScientist',
            label: { en: 'Data Scientist', fr: "Scientifique des données" }
        },
        {
            code: 6,
            alpha: 'hrPay',
            label: { en: 'HR and Pay', fr: "RH et paie" }
        }
    ]
)

let categories = ref(null)
let selectedCategory = ref(null)

// by convention, composable function names start with "use"
export function useCategories() {
    

    async function getCategories() {
        try {
            var response = await axios.get(env.API_URL + '/categories');
            categories.value = response.data.payload;

            //TODO enhance to receive the code as well
            console.log("Loaded Categories", categories.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    // expose managed state as return value
    return {
        adminCategories,
        categories,

        selectedCategory,
        getCategories,

    }
}