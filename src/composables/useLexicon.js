import env from "@/env.js"
import { ref } from "vue";
import configuredAxios from "@/utils/axios.js"

const lng = ref('en');
const lngs = ref(['en', 'fr'])

const formLng = ref('en');
const formLngs = ref(['en', 'fr', 'bilingual'])

let lexicon = ref([]);
let lexiconLoaded = ref(false);
let pendingLexicon = ref([]);

export function useLexicon() {
    async function getLexicon() {
        try {
            const response = await configuredAxios.get(`${env.API_URL}/lexicon`);
            lexicon.value = response.data.payload;
            lexiconLoaded.value = true;
            console.log("Lexicon", lexicon.value)
        } catch (error) {
            console.error("Could not load lexicon", error);
            throw error;
        }
    }

    function L_(term) {
        if (lexiconLoaded.value && lng.value) {
            var lIndex = lexicon.value.findIndex((word) => { return word && word.code && word.code.toLowerCase() == term.toLowerCase() })
            if (lIndex > -1) {

                //Is the correct language available? If so, return it.
                if (lexicon.value[lIndex].word[lng.value]) {
                    return lexicon.value[lIndex].word[lng.value];
                }

                //Requested language not available? Try english.
                else {
                    if (lexicon.value[lIndex].word.en) //default to english
                    {
                        return lexicon.value[lIndex].word.en; //  return '~' + lexicon[lIndex].word.en + '~';
                    }

                    //English isn't available either? Return the first alternately available key
                    else {
                        var keys = Object.keys(lexicon.value[lIndex].word);
                        if (keys && keys.length) {
                            let result = lexicon.value[lIndex].word[keys[0]]
                            if (result) return lexicon.value[lIndex].word[keys[0]]
                            else return '!' + term + '!';
                        }
                        else return '!' + term + '!';

                    }
                }
            }

            //Cannot find the word in the lexicon
            else {
                addWordToPending(term);
                return '~' + term + '~';
            }
        }

        //lexicon hasn't been loaded yet, just return the term
        else {
            addWordToPending(term);
            return term;//'?' + term + '?';  
        }
    }

    function addWordToPending(code) {
        //Add items to the pending word list
        //Check to see if the word is pending OR in the actual lexicon
        //Don't add it if it is in either location
        if (code && code.length && lng) {
            var lIndex = lexicon.value.findIndex((w) => { return w.code == code })
            var pIndex = pendingLexicon.value.findIndex((pendingTerm) => { return pendingTerm.code == code })
            if (pIndex == -1 && lIndex == -1) {
                var newWord = {
                    code: code,
                    dirty: true,
                    word: { 'en': null, 'fr': null },
                    started: false
                };
                newWord.word[lng.value] = code;
                pendingLexicon.value.push(newWord)
            }
        }

        if (lexiconLoaded.value && pendingLexicon.value.length) {
            deduplicatePending();
            addPendingToLexicon();
        }
    }

    function deduplicatePending() {

        //Remove any pending items in the lexicon
        for (var a = pendingLexicon.value.length - 1; a >= 0; a--) {
            var pIndex = lexicon.value.findIndex((w) => { return w.code == pendingLexicon.value[a].code })
            if (pIndex > -1) {
                pendingLexicon.value.splice(a, 1);
            }
        }

        pendingLexicon.value.filter((v, i, a) => a.findIndex(t => (t.code === v.code)) === i)
    }


    async function addPendingToLexicon() {
        try {
            for (const pendingWord of pendingLexicon.value) {
                if (!pendingWord.started) {
                    pendingWord.started = true;
                    await configuredAxios.post(`${env.API_URL}/lexicon`, { words: [pendingWord] });
                }
            }
            // await getLexicon();
        } catch (error) {
            console.error("addPendingToLexicon error", error);
        }
    }

    async function saveEditedWords(words) {
        const saveWords = words.filter(word => word.dirty);
        try {
            await configuredAxios.post(`${env.API_URL}/lexicon`, { words: saveWords, saveAll: true });
            // await getLexicon();
        } catch (error) {
            throw error;
        }
    }

    async function deleteWord(word) {
        try {
            await configuredAxios.delete(`${env.API_URL}/lexicon`, { data: { word: word } });
            lexicon.value = lexicon.value.filter(item => item.id !== word.id);
        } catch (error) {
            throw error;
        }
    }

    function setLng(newLng) {
        lng.value = newLng;
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('lng', newLng);
        }
    }

    function getLng() {
        if (typeof localStorage !== 'undefined') {
            const storedLng = localStorage.getItem('lng');
            if (storedLng) {
                lng.value = storedLng;
            }
        }
        return lng.value;
    }

    function toggleLng() {
        const newLng = lng.value === 'en' ? 'fr' : 'en';
        setLng(newLng);
    }

    function cycleFormLng() {

    }


    return {
        lng,
        lngs,
        formLng,
        formLngs,
        lexicon,
        lexiconLoaded,
        pendingLexicon,

        L_,
        getLexicon,
        saveEditedWords,
        deleteWord,
        getLng,
        setLng,
        toggleLng,
        cycleFormLng,
    };
}

