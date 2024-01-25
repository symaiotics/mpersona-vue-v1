import { ref, onMounted, onUnmounted } from 'vue'

let inputFiles = ref([]);
let readerFiles = ref([]);

// by convention, composable function names start with "use"
export function useReadFiles() {

    async function readFiles(f) {
        return new Promise(async (resolve, reject) => {
            console.log("Commence read file: readFiles")
            try {

                for (var a = 0; a < f.length; a++) {
                    var file = f[a]
                    switch (file.type) {
                        case "text/html":
                            //Parse HTML tags for links to videos
                            console.log("Found text/html, readingTextFiles")
                            await readTextFiles(file)
                            break;
                        case "application/json":
                            //Handle JSON documents which may contain weblinks
                            await readTextFiles(file)
                            break;
                        default:
                    }
                };
                resolve(true)

            }
            catch (error) {
                reject(false)
            }
        });

    }

    function readTextFiles(file) {

        return new Promise((resolve, reject) => {

            const temporaryFileReader = new FileReader();

            temporaryFileReader.onerror = () => {
                temporaryFileReader.abort();
                reject(new DOMException("Problem parsing input file."));
            };

            temporaryFileReader.onload = () => {

                var newFile = {
                    name: file.name,
                    size: file.size,
                    type: file.type,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                }
                newFile.data = temporaryFileReader.result;
                readerFiles.value.push(newFile);
                console.log('New File Read: ', newFile)



                resolve(temporaryFileReader.result);
            };
            temporaryFileReader.readAsText(file);
        });



        // return new Promise((resolve, reject) => {

        //     try {

        //         reader.readAsText(file, "UTF-8");
        //         reader.onload = (evt) => {

        //             resolve(true);
        //         }
        //         reader.onerror = function (evt) {
        //             console.log("Error reading files")
        //             reject(false)
        //         }
        //     }
        //     catch (error) {
        //         console.log("Error readingTextFiles", error)
        //     }
        // })
    }


    // expose managed state as return value
    return {

        inputFiles, //Dragged from input file controller
        readerFiles, //Read asynchronously

        //Functions
        readFiles
    }
}