import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let accountCount = ref(0);
let personaCount = ref(0);
let nodeVersion = ref(null);

// by convention, composable function names start with "use"
export function useStats() {


    async function getStats() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/stats', );
            nodeVersion.value = response.data.payload.version;
            console.log("Loaded Stats")
        }
        catch (error) {
            console.log("Error", error)
        }
    }



    // expose managed state as return value
    return {
        accountCount,
        personaCount,
        nodeVersion,
        getStats,
    }
}