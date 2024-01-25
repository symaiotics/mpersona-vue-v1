 
export function extractData(text) {
    let codes = [];
    let validJSONs = [];

    try {
        if (text) {
            // Step 1 & 2: Extract code blocks and remove them from the text

            try {
                const parsedTextJSON = JSON.parse(text);
                validJSONs.push(parsedTextJSON);
                return { json: validJSONs, code: codes };  // Return immediately if the whole text is valid JSON
            } catch (e) {
                // If not a valid JSON, proceed with the usual extraction logic
            }

            const textCode = text.match(/```([\s\S]+?)```/g);
            let modifiedText = text;
            if (textCode && textCode.length > 0) {
                textCode.forEach(codeBlock => {
                    const trimmedBlock = codeBlock.trim().substring(3, codeBlock.length - 3);
                    const lines = trimmedBlock.split("\n");
                    const potentialKey = lines[0].trim().toLowerCase();
                    const codeContent = lines.slice(1).join("\n").trim();

                    if (potentialKey === 'json') {
                        try {
                            const parsedJSON = JSON.parse(codeContent);
                            validJSONs.push(parsedJSON);
                        } catch (e) {
                            // Not valid JSON, add to code array
                            codes.push({ key: potentialKey, code: codeContent });
                        }
                    } else {
                        codes.push({ key: potentialKey, code: codeContent });
                    }
                    modifiedText = modifiedText.replace(codeBlock, '');
                });
            }

            // Step 3: Extract JSON objects and arrays from the modified text
            let startIdxObj = modifiedText.indexOf('{');
            let startIdxArr = modifiedText.indexOf('[');

            while (startIdxObj !== -1 || startIdxArr !== -1) {
                let startIdx = startIdxObj !== -1 
                    ? (startIdxArr !== -1 ? Math.min(startIdxObj, startIdxArr) : startIdxObj)
                    : startIdxArr;
                
                let endIdx = startIdx;
                let braceCount = 1;
                const openBrace = modifiedText[startIdx];
                const closeBrace = openBrace === '{' ? '}' : ']';

                while (endIdx < modifiedText.length && braceCount > 0) {
                    endIdx++;
                    if (modifiedText[endIdx] === openBrace) {
                        braceCount++;
                    } else if (modifiedText[endIdx] === closeBrace) {
                        braceCount--;
                    }
                }

                const potentialJSON = modifiedText.substring(startIdx, endIdx + 1);
                try {
                    const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
                    const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
                    const parsed = JSON.parse(replacedString);
                    validJSONs.push(parsed);
                } catch (e) {
                    // Not valid JSON, skip
                }

                startIdxObj = modifiedText.indexOf('{', endIdx + 1);  // Skip past the end of the current JSON object
                startIdxArr = modifiedText.indexOf('[', endIdx + 1);  // Skip past the end of the current JSON array
            }
        }
    } catch (error) {
        return { json: [], code: [] };
    }

    // Step 4: Return the results in a single object
    return { json: validJSONs, code: codes };
}


//Older Prototypes
function extractCode(answer) {
    let codes = [];
    try {
        if (answer) {
            const textCode = answer.match(/```([\s\S]+?)```/g);
            if (textCode && textCode.length > 0) {
                codes = textCode
                    .join(" ")
                    .split("```")
                    .map((code) => code.trim())
                    .filter((code) => code !== "")
                    .map((c) => ({
                        key: c.slice(0, c.indexOf("\n")),
                        code: c.slice(c.indexOf("\n")),
                    }));
            }
            console.log(codes);
        }
        return codes;
    }
    catch (error) {
        return [];
    }
}

function extractJSON(text) {
    const validJSONs = [];

    try {
        if (text) {

            let startIdx = text.indexOf('{');
            while (startIdx !== -1) {
                let endIdx = startIdx;
                let braceCount = 1;

                while (endIdx < text.length && braceCount > 0) {
                    endIdx++;
                    if (text[endIdx] === '{') {
                        braceCount++;
                    } else if (text[endIdx] === '}') {
                        braceCount--;
                    }
                }

                const potentialJSON = text.substring(startIdx, endIdx + 1);
                try {
                    const sanitizedString = potentialJSON.replace(/<br\/?>/g, '').replace(/\n/g, ' ');
                    const replacedString = sanitizedString.replace(/(\s*?{\s*?|\s*?,\s*?)(['"])?([a-zA-Z0-9_]+)(['"])?:/g, '$1"$3":');
                    const parsed = JSON.parse(replacedString);
                    validJSONs.push(parsed);
                } catch (e) {
                    // Not valid JSON, skip
                }

                startIdx = text.indexOf('{', startIdx + 1);
            }
        }

        return validJSONs;
    }

    catch (error) {

        return [];
    }
}
