/* eslint-disable no-console */

const { getData, } = require('./lib/gAnalytics');

module.exports = (req, res) => {
    const { metric, } = req.query;
    console.log(`Requested graph of metric: ${metric}`);
    // 1 week time frame
    let promises = [];
    for (let i = 7; i >= 0; i -= 1) {
        promises.push(getData([metric,], `${i}daysAgo`, `${i}daysAgo`));
    }
    promises = [].concat(...promises);
    Promise.all(promises)
        .then(data => {
            // flatten list of objects into one object
            const body = {};
            body[metric] = [];
            Object.values(data).forEach(value => {
                body[metric].push(
                    value[metric.startsWith('ga:') ? metric : `ga:${metric}`]
                );
            });
            console.log(body);
            res.json({ data: body, });
        })
        .catch(err => {
            console.log('Error:');
            console.log(err);
            res.status(500).json({ error: 'Error', message: `${err}`, });
        });
}
