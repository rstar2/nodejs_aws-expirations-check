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
};

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
            if (data.StatusCode !== 200) throw new Error('Invoking lambda API function failed');
            return data;
        })
        .then(data => data.Payload)    
        .then(data => JSON.parse(data))    
        .then(data => {
            console.log("Received response from lambda API")

            const { statusCode, body, } = data;

            if (statusCode !== 200) {
                // if the other lambda fails then the error will be in the body,
                // not as a failed invoking-promise.
                // If the invoking promise fails this means failing to "invoke" the other lambda
                // (like no permissions, etc... , not that the other lambda responded with error)

                // the error will be here in the body as JSon encoded string
                throw new Error((body.error && JSON.parse(body.error).message) || 'General API error');
            }

            // the data.body is actually a JSON encoded String so no need to do again JSON.stringify(body)
            res.status(200).send(body);
        })
        .catch(error => {
            console.error(error);
            res.status(500).send(JSON.stringify({ error: `Something went wrong: ${error.message}`, }));
        });
};

module.exports = (app) => {
    // use the same middleware for all API request
    app.get('/list', api);
    app.post(['/add', '/delete',], api);
};
