import env from "@/env.js"

import { ref, computed } from 'vue';
import { extractData } from '@/utils/extractJsonAndCode.js';
import { v4 as uuidv4 } from 'uuid';

import { useTokens } from '@/composables/useTokens.js';
const { token, tokenDecoded } = useTokens();


let ws = null;
let wsUuid = ref(null);

let pingInterval;
let pongTimeout;
let stages = ref([]); //Manages all the stages within the app. However, this will need to revamped if we enable multiple workstreams
let sessions = ref({}); //Sessions - Does not need a rework, would work across all


// sessions is assumed to be defined elsewhere and is a ref object
// This function will extract data from the session messages
function getExtracts(sessionKey) {
    return extractData(sessions.value[sessionKey]?.completedMessage || sessions.value[sessionKey]?.partialMessage || "");
}

// This computed property will create a content array from the session keys
let sessionsContent = computed(() => {
    // Create an array to hold the session content
    const content = Object.keys(sessions.value).map((key) => {
        // Create an object for each session with the desired properties
        return {
            content: sessions.value[key].completedMessage || sessions.value[key].partialMessage || "",
            label: `${sessions.value[key].stageUuid}${sessions.value[key].stageIndex}${sessions.value[key].socketIndex}`,
            sessionId: key,
            stageUuid: sessions.value[key].stageUuid,
            stageIndex: sessions.value[key].stageIndex,
            socketIndex: sessions.value[key].socketIndex,
            // Call getExtracts directly instead of creating a new computed property
            extracts: getExtracts(key)
        };
    });

    // Return the array of session content
    return content;
});

//Nodes for the stage visualizer
let stageNodes = computed(() => {
    var nodes = [];
    stages.value.forEach((stage, index, origArray) => {
        stage.sockets.forEach((socket, sIndex, sOrigArray) => {
            nodes.push({
                id: socket.sessionId,
                name: "Stage." + (index + 1) + "." + (sIndex + 1),
                stage: index,
                status: sessions?.value?.[socket.sessionId]?.status || "missing",
                personaName: sessions?.value?.[socket.sessionId]?.persona?.name || null,
            })
        })
    })
    return nodes;
})

//Edges for the stage visualizer
let stageEdges = computed(() => {
    var edges = [];
    stages.value.forEach((stage, index, origArray) => {
        let sources = stage.selectedSessionsContent.map((ssc) => { return ssc.sessionId })
        let targets = stage.sockets.map((socket) => { return socket.sessionId })
        if (sources?.length && targets?.length)
            sources.forEach((source) => {
                targets.forEach((target) => {
                    edges.push({ source, target })
                    // console.log("Edges updated", edges)
                })
            })
    })
    return edges;
})

export function useWebsockets() {

    async function websocketConnection() {
        clearInterval(pingInterval);
        clearTimeout(pongTimeout);

        if (!ws) {
            ws = new WebSocket(env.WEBSOCKET_URL);
            ws.addEventListener('open', handleOpen);
            ws.addEventListener('message', handleMessage);
            ws.addEventListener('close', handleClose);
            ws.addEventListener('error', handleError);
        }
    }

    function handleOpen(event) {
        console.log('WebSocket connection opened:', event);
        pingInterval = setInterval(() => {
            ws.send(JSON.stringify({ type: 'ping' }));
        }, 5000);
    }

    //Reactively handle inbound messages
    function handleMessage(event) {
        try {
            const data = JSON.parse(event.data);

            // If the message contains a uuid, store it in the ref variable
            if (data.uuid) {
                wsUuid.value = data.uuid;
                console.log("Received a Websocket UUID", wsUuid.value)
            }

            if (data.session && sessions.value[data.session]) {
                // Check if the partialMessage ref exists for the session, if not create it
                if (!sessions.value[data.session].partialMessage) {
                    sessions.value[data.session].partialMessage = ref('');
                }

                if (data.type === 'EOM') {
                    sessions.value[data.session].completedMessage = sessions.value[data.session].messages.join('');

                    // Reset the partial message
                    sessions.value[data.session].messages = []; // Reset messages for the session
                    sessions.value[data.session].partialMessage = '';
                    sessions.value[data.session].status = 'complete'
                }
                else if (data.type === 'ERROR') {
                    console.log("Error in LLM response:", data)

                    var errorMessage = "Error: ";
                    // try {
                    //     var parsedError = JSON.parse(data.message);
                    //     errorMessage += parsedError.status + " " + parsedError.statusText;
                    //     if (parsedError.status == 429 || parsedError.status == "429") errorMessage += ". You've submitted too many tokens. Try again in a minute."
                    // }
                    // catch (err) {
                    //     //Not JSON, just leave as error
                    //     //Maybe cancel and try again if an error is received mid stream?
                    // }

                    sessions.value[data.session].status = 'waiting'; //Set a waiting status, to retry once available.
                    sessions.value[data.session].errorMessage = errorMessage + data.message;

                    // Clean up messages to avoid memory bloat
                    sessions.value[data.session].messages = []; // Reset messages for the session
                    sessions.value[data.session].partialMessage = '';
                    sessions.value[data.session].completedMessage = '';

                    // //If all the sessions are waiting, then show the error
                    // let allWaiting = true;
                    // Object.keys(sessions.value).forEach((session)=>{
                    //     if(sessions.value[session].status !== 'waiting') allWaiting = false; 
                    // })
                    // if(allWaiting)
                    // {
                    // }

                    // Reset the partial and completed message
                    // sessions.value[data.session].messages = []; // Reset messages for the session
                    // sessions.value[data.session].partialMessage = '';
                    // sessions.value[data.session].completedMessage = '';
                }

                else {
                    // Update the partial message with the new fragment
                    sessions.value[data.session].messages.push(data.message);
                    sessions.value[data.session].partialMessage += data.message;
                    sessions.value[data.session].status = 'inProgress';

                }
            }
            // Handle other messages
        } catch (error) {
            console.log("Error with websocket message", error);
        }
    }

    function handleClose(event) {
        console.log('WebSocket connection closed:', event);
        wsUuid.value = null;

        clearInterval(pingInterval);
        clearTimeout(pongTimeout);



        // Remove event listeners when the WebSocket closes
        if (ws) {
            ws.removeEventListener('open', handleOpen);
            ws.removeEventListener('message', handleMessage);
            ws.removeEventListener('close', handleClose);
            ws.removeEventListener('error', handleError);
            ws = null;
        }

        setTimeout(() => {
            console.log('Attempting to reconnect...');
            ws = null;
            websocketConnection();
        }, 5000);
    }

    function handleError(event) {
        console.log('WebSocket error:', event);
    }

    function sendToServer(uuid, session, provider, model, temperature, systemPrompt, userPrompt, messageHistory, knowledgeProfileUuids, type) {
        if (ws) {
            let wsSendVars = { token:token.value, uuid, session, provider, model, temperature, systemPrompt, userPrompt, messageHistory, knowledgeProfileUuids, type }
            console.log('Send to Server', wsSendVars)
            ws.send(JSON.stringify(wsSendVars));
        }
    }

    function registerSession(session, stageIndex, stageUuid, socketIndex, persona, callback) {
        sessions.value[session] = { callback, messages: [], status: 'idle', partialMessage: "", completedMessage: "", stageIndex: stageIndex, stageUuid: stageUuid, socketIndex: socketIndex, persona: persona };
    }

    function updateSession(session, stageIndex, stageUuid, socketIndex, callback) {
        sessions.value[session].stageIndex = stageIndex;
        sessions.value[session].stageUuid = stageUuid;
        sessions.value[session].socketIndex = socketIndex;
        console.log("Updated session", sessions.value[session])
    }

    function unregisterSession(session, stageIndex, stageUuid, socketIndex) {
        console.log("Deleted session", session)
        clearSessionData(session)
        delete sessions.value[session];
    }

    function clearSessionData(sessionId) {
        if (sessions.value[sessionId]) {
            sessions.value[sessionId].messages = [];
            sessions.value[sessionId].partialMessage = '';
            sessions.value[sessionId].completedMessage = '';
            // Any other cleanup that is needed for a session
        }
    }

    return {
        wsUuid,
        sessions,
        sessionsContent,
        stages,
        stageNodes,
        stageEdges,

        websocketConnection,
        sendToServer,
        registerSession,
        updateSession,
        unregisterSession,
    };
}

