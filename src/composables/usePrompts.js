import env from "@/env.js"
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";

import { useModels } from '@/composables/useModels.js'
const { adminModels, selectedModel } = useModels()

var temperature = ref(0.5)
var promptResponse = ref("")
var promptResponseCode = ref(null)
let ws = null;
let wsUuid = ref(null);

let pingInterval;
let pongTimeout;


// by convention, composable function names start with "use"
export function usePrompts() {

    async function websocketConnection() {

        clearInterval(pingInterval);
        clearTimeout(pongTimeout);

        ws = new WebSocket(env.WEBSOCKET_URL);

        // Set up an event listener for when the connection is opened
        ws.addEventListener('open', (event) => {
            console.log('WebSocket connection opened:', event);

            pingInterval = setInterval(() => {
                ws.send('ping');
            }, 5000);

        });

        // Set up an event listener for when a message is received from the server
        ws.addEventListener('message', (event) => {
            // console.log('Message received from server:', event.data);

            try {
                const data = JSON.parse(event.data);

                if (data.uuid) {
                    // Store the client ID received from the server
                    console.log("WS UUID Received", data.uuid)
                    wsUuid.value = data.uuid;
                }
                else if (data.fragment) {
                    // console.log('data.fragment', data.fragment)
                    promptResponse.value += data.fragment.toString();
                    promptResponse.value = promptResponse.value.replaceAll('\n', "<br/>")
                }
                else {
                    console.log('.')
                }




            }
            catch (error) {
                console.log("Error with websocket message", error)
            }

        });

        // Set up an event listener for when the connection is closed
        ws.addEventListener('close', (event) => {
            console.log('WebSocket connection closed:', event);

            // Clear the Ping interval and Pong timeout
            clearInterval(pingInterval);
            clearTimeout(pongTimeout);

            // Optionally: set up logic to attempt reconnection
            setTimeout(() => {
                console.log('Attempting to reconnect...');
                ws = new WebSocket(env.WEBSOCKET_URL);
            }, 500);  // Attempt to reconnect after 5 seconds

        });

        // Set up an event listener for errors
        ws.addEventListener('error', (event) => {
            console.log('WebSocket error:', event);
        });

    }


    async function promptOpenAI(model, userPrompt, systemPrompt) {
        return new Promise(async (resolve, reject) => {
            try {
                var params = {
                    wsUuid: wsUuid.value,
                    model: selectedModel.value.model,
                    userPrompt: userPrompt,
                    systemPrompt: systemPrompt,
                    // model: adminModels.value[selectedModel.value].model,
                    temperature: temperature.value
                }

                console.log(params)
                // console.log("params", params)
                var response = await axios.post(env.API_URL + '/prompts', params);

                // console.log(response)
                promptResponse.value = response.data.payload.text;
                promptResponse.value = promptResponse.value.replaceAll('\n', "<br/>")
                promptResponseCode.value = response.data.payload.code;

                if (promptResponseCode.value.length) {

                    for (var a = 0; a < promptResponseCode.value.length; a++) {
                        // console.log(a, promptResponseCode.value[a].code)
                        promptResponseCode.value[a].code = promptResponseCode.value[a].code.replaceAll('\n', "<br/>");
                    }
                }

                //TODO enhance to receive the code as well
                console.log(promptResponse.value)
            }
            catch (error) {
                console.log("Error", error)
            }

        }
        )

    }

    // expose managed state as return value
    return {
        promptResponse,
        promptResponseCode,

        promptOpenAI,
        websocketConnection
    }
}