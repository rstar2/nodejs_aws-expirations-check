// construct the VUE_APP_API_URL from the available env variables
// set in with 'VUE_APP_' prefix so that it will be accessible in the client
// for example: console.log(process.env.VUE_APP_API_URL);

// load the global env.yml file
// require('../../utils/env').config(
//     require('path').resolve(__dirname, '../../env.yml')
// );
// let apiServerHost,
//     apiServerPort = process.env.ANALYTICS_API_PORT,
//     apiPath = process.env.ANALYTICS_API_PATH;

// if (process.env.NODE_ENV === 'production') {
//     // TODO: set the real server host when known
//     apiServerHost = 'localhost';
// } else {
//     apiServerHost = 'localhost';
// }

// process.env.VUE_APP_API_URL = `${apiServerHost}${
//     apiServerPort !== 80 && apiServerPort != 433 ? `:${apiServerPort}` : ''
// }/${apiPath}`;

// if this client app and the api are deployed with Now
process.env.VUE_APP_API_URL = 'api';

module.exports = {};
