/* eslint-disable no-console */
const { getData, } = require('./lib/gAnalytics');

module.exports = (req, res) => {
    const { metrics, startDate, endDate, } = req.query;

    console.log(
        `Requested metrics: ${metrics}; start-date: ${startDate}; end-date: ${endDate}`
    );

    Promise.all(
        getData(metrics ? metrics.split(',') : metrics, startDate, endDate)
    )
        .then(data => {
            // flatten list of objects into one object
            const body = {};
            Object.values(data).forEach(value => {
                Object.keys(value).forEach(key => {
                    body[key] = value[key];
                });
            });
            res.send({ data: body, });
        })
        .catch(err => {
            console.log('Error:');
            console.log(err);
            res.status(500).json({
                error: 'Error getting a metric',
                message: `${err}`,
            });
        });
}
