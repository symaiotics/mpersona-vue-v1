import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"

// by convention, composable function names start with "use"
export function useShareLinks() {

    function addLink(schema, uuid, link, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { schema, uuid, link, linkType }
                var response = await configuredAxios.post(env.API_URL + '/shareLinks/add', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function getLinkDetails(schema, link) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { params: { schema, link } }
                console.log("Getting Link Details", params)
                var response = await configuredAxios.get(env.API_URL + '/shareLinks/details', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function acceptLink(schema, link) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { schema, link }
                var response = await configuredAxios.post(env.API_URL + '/shareLinks/accept', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }

    function removeLink(schema, uuid, linkType) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { schema, uuid, link, linkType }
                var response = await configuredAxios.post(env.API_URL + '/shareLinks/remove', params);
                resolve(response.data.payload)
            }
            catch (error) {
                reject(error)
            }
        })
    }


    // expose managed state as return value
    return {
        addLink, getLinkDetails, acceptLink, removeLink
    }
}