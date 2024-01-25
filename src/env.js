//env.js loads in the environment variables
const env = {
    SELF: import.meta.env.SELF || import.meta.env.VITE_SELF || "MISSING ENV URL",
    API_URL: import.meta.env.API_URL || import.meta.env.VITE_API_URL || "MISSING ENV URL",
    STORAGE_URL: import.meta.env.STORAGE_URL || import.meta.env.VITE_STORAGE_URL || "MISSING ENV URL",
    WEBSOCKET_URL: import.meta.env.WEBSOCKET_URL || import.meta.env.VITE_WEBSOCKET_URL || "MISSING ENV URL",
};

console.log('Booting with full .env', import.meta.env)

export default env;