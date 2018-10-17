const AWS = require('aws-sdk');

const apiFunction = process.env.AWS_LAMBDA_API;
const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

// AWS Lambda service
const lambda = new AWS.Lambda();


const createEventPayload = ({ action, data, }) => {
    return {
        secret: apiFunctionSecret,
        action,
        data,
    };
}

module.exports = (app) => {

    const api = (req, res) => {
        const action = req.path.substring(1);
        const data = req.body || undefined;

        const event = createEventPayload({ action, data, });

        // invoke the api Lambda function
        lambda.invoke({
            FunctionName: apiFunction,
            // InvocationType: 'RequestResponse', // this is default anyway
            Payload: JSON.stringify(event),
        }).promise()
            .then(data => {
                console.dir(data);
                res.status(200).send(JSON.stringify(data));
            })
            .catch(error => {
                console.error(error);
                res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}`, }));
            });
    };

    app.get('/list', api);
    app.post(['/add', '/delete',], api);
};
