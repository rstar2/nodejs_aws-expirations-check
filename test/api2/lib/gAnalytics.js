// Config
const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL;
const privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY; // RSA private key (in PEM format with the new lines) as exported by Google API policy
const viewId = process.env.GOOGLE_ANALYTICS_VIEW_ID;
const scopes = ['https://www.googleapis.com/auth/analytics.readonly',];

// API's
const { google, } = require('googleapis');
const analytics = google.analytics('v3');
const jwt = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes,
});

async function randomTimeout() {
    // Math.trunc((random 0-1) * 1000),
    // example:
    //   0,553453535 * 1000 = 553,453535
    //   Math.trunc(553,453535) = 553
    //   So random 0-1 sec

    // setTimeout has a special Symbol that generates setTimeout as Promise
    return setTimeout[Object.getOwnPropertySymbols(setTimeout)[0]](
        Math.trunc(1000 * Math.random())
    );
}

async function getMetric(metric, startDate, endDate) {
    await randomTimeout();

    const result = await analytics.data.ga.get({
        auth: jwt,
        ids: `ga:${viewId}`,
        'start-date': startDate,
        'end-date': endDate,
        metrics: metric,
    });
    const res = {};
    res[metric] = {
        value: parseInt(result.data.totalsForAllResults[metric], 10),
        start: startDate,
        end: endDate,
    };
    return res;
}

/**
 * Normalize metrics name
 *
 * @param {String} metric
 * @return {String}
 */
function normalizeMetric(metric) {
    let cleanMetric = metric;
    if (!cleanMetric.startsWith('ga:')) {
        cleanMetric = `ga:${cleanMetric}`;
    }
    return cleanMetric;
}

/**
 * Get all the specified metrics
 *
 * @param {String} metrics
 * @param {String} startDate
 * @param {String} endDate
 * @return {Promise[]}
 */
function getData(
    metrics = ['ga:users',],
    startDate = '30daysAgo',
    endDate = 'today'
) {
    // ensure all metrics have ga:
    const results = [];
    for (let i = 0; i < metrics.length; i += 1) {
        const metric = normalizeMetric(metrics[i]);
        results.push(getMetric(metric, startDate, endDate));
    }
    return results;
}

module.exports = { getData, };
