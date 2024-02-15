import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let wrapps = ref([
    {name:{en:"GC Roster",fr:""},description:{en:"A simple Canada branded roster interface",fr:""}, url:"/GCRoster/"},
    {name:{en:"GC Chat",fr:""},description:{en:"A multi-persona chat interface",fr:""}, url:"/GCChat/"},
    {name:{en:"GC Translate",fr:""},description:{en:"A translation tool with custom lexicons and format preservation",fr:""}, url:"/GCTranslate/"},
    {name:{en:"Policy",fr:""},description:{en:"A policy and procedure interpreter with Knowledge Sets",fr:""}, url:"/policy/"},
]);

// by convention, composable function names start with "use"
export function useWrapps() {


    // async function getWrapps() {
    //     try {
    //         var response = await configuredAxios.get(env.API_URL + '/wrapps', );
    //         wrapps.value = response.data.payload;
    //     }
    //     catch (error) {
    //         console.log("Error loading Wrapops", error)
    //     }
    // }



    // expose managed state as return value
    return {
        getWrapps,
        wrapps
    }
}