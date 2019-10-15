// parse and configure the env variables
const path = require('path');

require('../../utils/env').config(path.resolve(__dirname, '../../env.yml'));

// Server
const express = require('express');
const cors = require('cors');

const { getData, } = require('./lib/gAnalytics');

const app = express();
app.use(cors());
const server = require('http').createServer(app);

// Config
const port = process.env.ANALYTICS_API_PORT;
server.listen(port, () => {
    console.log(`Analytics API server running at localhost:${port}`);
});

// the URL path on which thi sever will respond
const apiPath = process.env.ANALYTICS_API_PATH || '';

/**
 * Get all the required metrics as a REST api
 */
app.get(`/${apiPath}`, (req, res) => {
    const { metrics, startDate, endDate, } = req.query;
    
    console.log(`Requested metrics: ${metrics}; start-date: ${startDate}; end-date: ${endDate}`);
    
    Promise.all(getData(metrics ? metrics.split(',') : metrics, startDate, endDate))
        .then((data) => {
        // flatten list of objects into one object
            const body = {};
            Object.values(data).forEach((value) => {
                Object.keys(value).forEach((key) => {
                    body[key] = value[key];
                });
            });
            res.send({ data: body, });
        })
        .catch((err) => {
            console.log('Error:');
            console.log(err);
            res.status(500).json({ error: 'Error getting a metric', message: `${err}`, });
        });
});

/**
 * Get all the required metrics as needed for a pie-chart graphic
 */
app.get(`/${apiPath}/graph`, (req, res) => {
    const { metric, } = req.query;
    console.log(`Requested graph of metric: ${metric}`);
    // 1 week time frame
    let promises = [];
    for (let i = 7; i >= 0; i -= 1) {
        promises.push(getData([metric,], `${i}daysAgo`, `${i}daysAgo`));
    }
    promises = [].concat(...promises);
    Promise.all(promises)
        .then((data) => {
        // flatten list of objects into one object
            const body = {};
            body[metric] = [];
            Object.values(data).forEach((value) => {
                body[metric].push(value[metric.startsWith('ga:') ? metric : `ga:${metric}`]);
            });
            console.log(body);
            res.json({ data: body, });
        })
        .catch((err) => {
            console.log('Error:');
            console.log(err);
            res.status(500).json({ error: 'Error', message: `${err}`, });
        });
});

// https://dev.to/bnevilleoneill/build-your-own-web-analytics-dashboard-with-node-js-327b?utm_source=digest_mailer&utm_medium=email&utm_campaign=digest_email
