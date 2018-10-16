const AWS = require('aws-sdk');

const apiFunction = process.env.AWS_LAMBDA_API;

// AWS Lambda service
const lambda = new AWS.Lambda();

module.exports = (app) => {

    // this is a single SPA webapp
    app.get('/test', (req, res) => {

        lambda.invoke({
            FunctionName: apiFunction,
            InvocationType: 'Event',
            Payload: JSON.stringify({}),
        }).promise()
        .then(data => console.dir(data))
        .catch(error => console.error(error));

        Promise.resolve({ x: 1, })
            .then(data => res.status(200).send(JSON.stringify(data)))
            .catch(error => res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}`, })));
    });

};
