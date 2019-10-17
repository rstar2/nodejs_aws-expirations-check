// construct the VUE_APP_API_URL from the available env variables
// set in with 'VUE_APP_' prefix so that it will be accessible in the client
// for example: console.log(process.env.VUE_APP_API_URL);

require("dotenv").config();

// load the global env.yml file
// require('../../utils/env').config(
//     require('path').resolve(__dirname, '../../env.yml')
// );

// these are the
let apiServerPort, apiPath;

if (process.env.NODE_ENV === "production") {
    // these are the real production values as set in the Now.sh deployment (now.json)
    // because both the client and the api are deployed on Now.sh
    apiServerHost = '';
    apiServerPort = 80;
    apiPath = "api";
} else {
    apiServerHost = "http://localhost";
    apiServerPort = process.env.ANALYTICS_API_PORT;
    apiPath = process.env.ANALYTICS_API_PATH;
}

process.env.VUE_APP_API_URL = `${apiServerHost}${
    apiServerPort !== 80 && apiServerPort != 433 ? `:${apiServerPort}` : ""
}/${apiPath}`;

console.log(process.env.ANALYTICS_API_PORT)

module.exports = {};
