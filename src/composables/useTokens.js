import { ref } from 'vue'

let tokenSet = ref(false);
let token = ref(null);
let tokenDecoded = ref(null);

export function useTokens() {
    function recallTokens() {
        const t = localStorage.getItem('token');
        const tD = localStorage.getItem('tokenDecoded');
        if (t) {
            token.value = t;
            tokenSet.value = true;
        }
        if (tD) {
            try {
                tokenDecoded.value = JSON.parse(tD);
            } catch (error) {
                console.error("Failed to parse tokenDecoded from localStorage:", error);
                // Reset the tokenDecoded value if there's an error parsing
                tokenDecoded.value = null;
            }
        }
        // Set tokenSet based on the presence of both token and tokenDecoded
        tokenSet.value = !!token.value && !!tokenDecoded.value;
    }

    function setTokens(t, tD) {
        try {
            localStorage.setItem('token', t);
            // Ensure tD is an object before stringifying
            localStorage.setItem('tokenDecoded', JSON.stringify(tD));
            token.value = t;
            tokenDecoded.value = tD; // tD should be an object
            tokenSet.value = true;
        } catch (error) {
            console.error("Failed to set tokens in localStorage:", error);
            // Handle the error appropriately
        }
    }

    function unsetTokens() {
        localStorage.removeItem('token');
        localStorage.removeItem('tokenDecoded');
        token.value = null;
        tokenDecoded.value = null;
        tokenSet.value = false;
    }

    // Call recallTokens on composable initialization to retrieve any existing tokens
    recallTokens();

    return {
        tokenSet, token, tokenDecoded, recallTokens, setTokens, unsetTokens
    }
}