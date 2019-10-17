// useful for local development
// parse and configure the env variables
const path = require('path');

require('../../utils/env').config(path.resolve(__dirname, '../../env.yml'));

// Server
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
const server = require('http').createServer(app);

// Config
const port = process.env.ANALYTICS_API_PORT;
server.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Analytics API server running at localhost:${port}`);
});

// the URL path on which thi sever will respond
const apiPath = process.env.ANALYTICS_API_PATH || '';

/**
 * Get all the required metrics as a REST api
 */
app.get(`/${apiPath}`, require('./api'));

/**
 * Get all the required metrics as needed for a pie-chart graphic
 */
app.get(`/${apiPath}/graph`, require('./api-graph'));

// https://dev.to/bnevilleoneill/build-your-own-web-analytics-dashboard-with-node-js-327b?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email
