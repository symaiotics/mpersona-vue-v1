
# mPersona - By Symaiotics
mPersona is a Cloud-based and downloadable tool to build and interact with custom personas.
It facilitates much better interaction with Large Language Model services like Open AI's GPT4, Anthropic's Claude 2.1, etc.

## About
mPersona is built in 2 parts, a Vue.js web interface (this package) and a Node.js server side application.

## Configuration
The application also requires environment variables to operate when run locally.
- VITE_API_URL=http://localhost:3000
- VITE_WEBSOCKET_URL=ws://localhost:3000
- VITE_STORAGE_URL=https://[AzureStorageAccount].blob.core.windows.net
When building the Vue project for deployment, replace these variables with real values for your API/Websocket endpoint(s) and your own Azure Storage Account.
GitHub Actions make this easy to implement.


# Application Logic (UI) License
The MIT License (MIT)

Copyright (c) 2023-current Symaiotics Corporation.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run dev
```

### Compiles and minifies for production
```
npm run build
```

