import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let assignments = ref(null)
let selectedAssignment = ref(null) //the actively selected persona

//This is a single assignment
//We save an array of these
const defaultAssignment = {
    code: null,
    personaUuid: null,
    name: { en: null, fr: null },
};

const newAssignment = ref({ ...defaultAssignment });

// by convention, composable function names start with "use"
export function useAssignments() {

    const resetAssignment = () => {
        Object.assign(newAssignment.value, defaultAssignment);
    };

    const addNewAssignment = () => {
        resetAssignment();
        selectedAssignment.value = newAssignment.value;
    };

    async function getAssignments(wrappUuid, rosterUuid) {
        try {

            let params = { params: { wrappUuid, rosterUuid } }
            var response = await configuredAxios.get(env.API_URL + '/assignments', params);
            assignments.value = response.data.payload;

            console.log("Loaded Assignment", assignments.value)
        }
        catch (error) {
            console.log("Error", error)
        }
    }

    async function createAssignments(wrappUuid, rosterUuid, assignments) {
        try {
            if (!Array.isArray(assignments)) assignments = [assignments]
            var params = { wrappUuid, rosterUuid, assignments }
            var response = await configuredAxios.post(env.API_URL + '/assignments', params);
            console.log("Created Assignment(s)", response.data.payload)
            notify({ group: "success", title: "Success", text: "Assignment(s) created successfully" }, 4000) // 4s
            getAssignments(wrappUuid, rosterUuid);

        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error creating Assignment. Try again" }, 4000) // 4s

        }
    }

    async function deleteAssignments(wrappUuid, rosterUuid, assignmentUuids) {
        try {
            var params = { wrappUuid, rosterUuid, assignmentUuids }
            var response = await configuredAxios.delete(env.API_URL + '/assignments', params);
            console.log("Deleted Assignment(s)", response.data.payload);
            notify({ group: "success", title: "Success", text: "Assignment(s) deleted successfully" }, 4000) // 4s
            getAssignments(wrappUuid, rosterUuid);
        }
        catch (error) {
            console.log("Error", error)
            notify({ group: "failure", title: "Error", text: "Error deleting Assignment(s). Try again" }, 4000) // 4s
        }
    }

    // expose managed state as return value
    return {
        defaultAssignment,
        newAssignment,
        assignments,
        selectedAssignment,

        addNewAssignment,
        resetAssignment,

        getAssignments,
        createAssignments,
        deleteAssignments

    }
}