const AWS = require('aws-sdk');

const apiFunction = process.env.AWS_LAMBDA_API;

// AWS Lambda service
const lambda = new AWS.Lambda();

module.exports = (app) => {

    app.get('/list', (req, res) => {
        // invoke the api Lambda function
        lambda.invoke({
            FunctionName: apiFunction,
            // InvocationType: 'RequestResponse', // this is default anyway
            Payload: JSON.stringify({path: 'list', name: 'rumen'}),
        }).promise()
            .then(data => {
                console.dir(data);
                res.status(200).send(JSON.stringify(data));
            })
            .catch(error => {
                console.error(error);
                res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}`, }))
            });
    });

};
