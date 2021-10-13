const AWS = require('aws-sdk');

const webpushFunction = process.env.AWS_LAMBDA_WEBPUSH;
const webpushFunctionSecret = process.env.AWS_LAMBDAS_SECRET;

// AWS Lambda service
const lambda = new AWS.Lambda();

const createEventPayload = ({ user, action, data, }) => {
    return {
        secret: webpushFunctionSecret,
        user,
        action,
        data,
    };
};

const webPush = (req, res) => {
    const action = req.path.substring(1);
    const data = req.body;
    const user = req.user;

    const event = createEventPayload({ user, action, data, });

    console.log('Invoking the WebPushAPI Lambda', event);
    // invoke the api Lambda function
    lambda.invoke({
        FunctionName: webpushFunction,
        // InvocationType: 'RequestResponse', // this is default anyway
        Payload: JSON.stringify(event),
    }).promise()
        .then(data => {
            if (data.StatusCode !== 200) throw new Error('Invoking WebPushAPI Lambda failed');
            return data;
        })
        .then(data => data.Payload)
        .then(data => JSON.parse(data))
        .then(data => {
            const { statusCode, body, } = data;

            console.log('Received response from WebPushAPI Lambda - response', body);
            // console.dir(data);

            if (statusCode !== 200) {
                // if the other lambda fails then the error will be in the body,
                // not as a failed invoking-promise.
                // If the invoking promise fails this means failing to "invoke" the other lambda
                // (like no permissions, etc... , not that the other lambda responded with error)

                // the error will be here in the body as JSON encoded string
                throw new Error((body.error && JSON.parse(body.error).message) || 'General WebPushAPI error');
            }

            // the returned body should be boolean
            res.send({success: body});
        })
        .catch(error => {
            console.error(error);
            res.status(500).send({ error: `Something went wrong: ${error.message}`, });
        });
};

module.exports = (app) => {
    app.post('/register', webPush);
};
