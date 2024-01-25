import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios";


// by convention, composable function names start with "use"
export function useExecutor() {
 
    async function actionJson(jsonArray) {
    //Inputs a JSON array
    //Evaluates the type of the array
    //Calls the appropriate service
    //Executues the function
    //Stores that it has been executed so it doesn't refire?
    //Or allow the user to fire it ?

    console.log(typeof jsonArray)
    console.log(jsonArray)

    jsonArray.forEach((item, index, origArray) => {
        switch (true) {
          case item.actionType == 'api':
            apiCall(item);
            break;
          default:
            console.log(`No action taken for #${index}` , item);
        }
      });

    }


    function apiCall(item)
    {
        console.log("Initiating an API call", item)
    }
 
    // expose managed state as return value
    return {
        actionJson
    }
}