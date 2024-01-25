import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();

import { useWebsockets } from '@/composables/useWebsockets.js'
const { sessions, stages} = useWebsockets();

let workStreams = ref(null)
let selectedWorkStream = ref(null) //the actively selected workStream

// by convention, composable function names start with "use"
export function useWorkStreams() {

    async function getWorkStreams() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/workStreams');
            workStreams.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Work Streams", workStreams.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createWorkStreams(newWorkStreams ) {

        return new Promise(async (resolve, reject)=>{
            try {
                if (!Array.isArray(newWorkStreams)) newWorkStreams = [newWorkStreams]
                newWorkStreams.forEach((workStream)=>{
                    workStream.sessions= sessions.value || {};
                    workStream.stages= stages.value || [];
                })
                var params = { workStreams: newWorkStreams }
                console.log("create work streams params", params)
                var response = await configuredAxios.post(env.API_URL + '/workStreams', params);
                console.log(response.data.payload)
                notify({ group: "success", title: "Success", text: "Work Stream(s) created successfully" }, 4000) // 4s
                getWorkStreams();
                resolve(true)
            }
            catch (error) {
                console.log("Error", error)
                notify({ group: "failure", title: "Error", text: "Error creating Work Stream(s). Try again" }, 4000) // 4s
                reject(error)
            }
    
        })
    }


    async function selectWorkStream(workStream ) {
        try {
            console.log("SelectWorkStream", workStream)
            sessions.value = workStream.sessions;
            stages.value = workStream.stages;
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error selecting Work Stream(s). Try again" }, 4000) // 4s
        }
    }

 
    async function updateWorkStreams(updateWorkStreams) {
        try {
            if (!Array.isArray(updateWorkStreams)) updateWorkStreams = [updateWorkStreams]
            var params = { workStreams: updateWorkStreams }
            var response = await configuredAxios.post(env.API_URL + '/workStreams/update', params);
            console.log(response.data.payload)
            notify({ group: "success", title: "Success", text: "Work Stream(s) updated successfully" }, 4000) // 4s
            getWorkStreams();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating Work Stream(s). Try again" }, 4000) // 4s

        }
    }



    // expose managed state as return value
    return {

        workStreams,
        selectedWorkStream,
        getWorkStreams,
        selectWorkStream,
        createWorkStreams,
        updateWorkStreams,

    }
}

