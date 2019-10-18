// construct the VUE_APP_API_URL from the available env variables
// set in with 'VUE_APP_' prefix so that it will be accessible in the client
// for example: console.log(process.env.VUE_APP_API_URL);

// these are the
let apiServerHost, apiServerPort, apiPath;

if (process.env.NODE_ENV === "production") {
    // these are the real production values as set in the Now.sh deployment (now.json)
    // because both the client and the api are deployed on Now.sh
    apiServerHost = "";
    apiServerPort = 80;
    apiPath = "api";
} else {
    // useful for local development
    // parse and configure the env variables
    require("dotenv").config({
        path: require("path").resolve(__dirname, "../.env.local")
    });

    apiServerHost = "http://localhost";
    apiServerPort = process.env.ANALYTICS_API_PORT;
    apiPath = process.env.ANALYTICS_API_PATH;
}

// pass it to the client
process.env.VUE_APP_API_URL = `${apiServerHost}${
    apiServerPort !== 80 && apiServerPort != 433 ? `:${apiServerPort}` : ""
}/${apiPath}`;

module.exports = {};
