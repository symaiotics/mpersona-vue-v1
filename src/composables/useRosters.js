import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

import { useTokens } from '@/composables/useTokens.js'
const { tokenDecoded } = useTokens();

let rosters = ref(null)
let selectedRoster = ref(null) //the actively selected persona

const defaultRoster = {
    name: null,
    description: { en: null, fr: null },
    url: null,
    personas: [],
    personaUuids: [],
    createdBy: 'public',
};

const newRoster = ref({ ...defaultRoster });

// by convention, composable function names start with "use"
export function useRosters() {

    const resetRoster = () => {
        Object.assign(newRoster.value, defaultRoster);
    };

    const addNewRoster = () => {
        resetRoster();
        selectedRoster.value = null;        
    };

    async function getRosters() {
        try {
            var response = await configuredAxios.get(env.API_URL + '/rosters');
            rosters.value = response.data.payload;
            //TODO enhance to receive the code as well
            console.log("Loaded Rosters", rosters.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }


    async function getRosterFromUuid(uuid) {
        try {
            var params = {params:{ rosterUuid:uuid }};
            var response = await configuredAxios.get(env.API_URL + '/rosters/uuid', params);
            selectedRoster.value = response.data.payload;
            console.log("Selected Roster", selectedRoster.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }    

    async function createRosters(newRosters) {
        try {
            if (!Array.isArray(newRosters)) newRosters = [newRosters]
            var params = { rosters: newRosters }
            var response = await configuredAxios.post(env.API_URL + '/rosters', params);
            console.log("Saved Rosters", response)
            notify({ group: "success", title: "Success", text: "Roster created successfully" }, 4000) // 4s
            getRosters();

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Roster. Try again" }, 4000) // 4s

        }
    }

    async function updateRosters(updateArr) {
        try {
            if (!Array.isArray(updateArr)) updateArr = [updateArr]
            var params = { rosters: updateArr }
            var response = await configuredAxios.post(env.API_URL + '/rosters/update', params);
            console.log(response.data.payload)
            // currentPersona.value = response;    
            notify({ group: "success", title: "Success", text: "Roster(s) updated successfully" }, 4000) // 4s
            getRosters();
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error updating Roster(s). Try again" }, 4000) // 4s

        }
    }

    
    function addLink(rosterUuid, rosterLink, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { rosterUuid, rosterLink, linkType }
                var response = await configuredAxios.post(env.API_URL + '/rosters/addLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function getLinkDetails(link) {
        return new Promise(async (resolve, reject) => {
            try {
                console.log("Getting Roster details", link)
                var params = { link: link }
                var response = await configuredAxios.post(env.API_URL + '/rosters/linkDetails', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function acceptLink(link) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { link: link }
                var response = await configuredAxios.post(env.API_URL + '/rosters/acceptLink', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

 


    // expose managed state as return value
    return {
        defaultRoster,
        rosters,
        selectedRoster,
        newRoster,

        addNewRoster,
        resetRoster,
        getRosters,
        getRosterFromUuid,
        createRosters,
        updateRosters,
        addLink,
        getLinkDetails,
        acceptLink,
       

    }
}