import env from "@/env.js"
import { ref, computed } from 'vue'
// import axios from "axios";
import configuredAxios from "@/utils/axios.js"
import { notify } from "notiwind"

let newUser = ref({
    username: null,
    password: null,
    password2: null,
    email: null,
    useCase: null,
    notes: null,
})

let responseMessage = ref(null);

let resetPassword = ref({
    resetToken: null,
    password: null,
    password2: null,
})

let accountInfo = ref({});

// by convention, composable function names start with "use"
export function useAccounts() {

    function clearToken() {
        tokenSet.value = false;
        localStorage.removeItem('token')
        localStorage.removeItem('tokenDecoded')
    }


    function resetNewUser() {
        newUser.value =
        {
            username: null,
            password: null,
            password2: null,
            email: null,
            useCase: null,
            notes: null,
        }
    }


    function resetResetPassword() {
        resetPassword.value =
        {
            resetToken: null,
            password: null,
            password2: null,
        }
    }


    async function getOwnAccountInfo() {   
        return new Promise(async (resolve, reject) => {

        try {
            let results = await configuredAxios.get('/accounts/own/info');
            accountInfo.value = results.data.payload;
            resolve(true);
        }
        catch (error) {
            notify({ group: "failure", title: "Error", text: "Error loading your account info. Please login again." }, 4000) // 4s
            console.log("Error", error);
            reject(error);
        }
    });

    }


    function mailingList(emailAddress) {

        return new Promise(async (resolve, reject) => {

            try {
                var params = {emailAddress};
                await configuredAxios.post('/accounts/mailingList', params);
                notify({ group: "success", title: "Success", text: "Welcome! You've joined the mailing list for future updates." }, 4000) // 4s
            }
            catch (error) {
                notify({ group: "failure", title: "Error", text: "Error joining the mailing list. Please try again" }, 4000) // 4s
                console.log("Error", error)
                reject(error);

            }
        })
    }


    function newAccount() {

        return new Promise(async (resolve, reject) => {

            try {
                var params = newUser.value;
                // console.log("Params", params)
                var response = await configuredAxios.post('/accounts', params);
                responseMessage.value = response.data.payload;
                notify({ group: "success", title: "Success", text: "Account created successfully" }, 4000) // 4s
                resolve(responseMessage.value);
                //TODO enhance to receive the code as well
                // console.log("Loaded Personas", personas.value)
            }
            catch (error) {
                notify({ group: "failure", title: "Error", text: "Error creating your account. Check your username and passwords and try again." }, 4000) // 4s
                console.log("Error", error)
                reject(error);

            }
        })
    }


    function login(username, password) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = { username, password };
                var response = await configuredAxios.post('/accounts/login', params);
                console.log("Login Response", response)
                resolve(response.data.payload);
            }
            catch (error) {
                console.log("Error", error)
                reject(error);

            }
        })

    }
    function logout() {

    }

    function sendPasswordResetRequest(email) {
        //Create a password reset token
        //Send it to the email address
    }

    function attemptPasswordReset(token) {
        //Submit the new passwords
    }

    // expose managed state as return value
    return {
        newUser,
        resetPassword,
        accountInfo,

        mailingList,
        resetNewUser,
        resetResetPassword,
        newAccount,
        login,
        logout,
        sendPasswordResetRequest,
        attemptPasswordReset,

        getOwnAccountInfo

    }
}