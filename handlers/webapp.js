const serverless = require('serverless-http');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.AWS_STAGE;
const app = require('../webapp/app')(stage);

// simple usage
// exports.handler = serverless(app);


// this allows more control -like transforming the generated 'request' (IncomingMessage)
// Cache
let handler;
exports.handler = (event, context, callback) => {
    // console.log('Event:');
    // console.dir(event);

    if (!handler) {
        handler = serverless(app, {
            request: (request, event, context) => {
                // this should be already authorized handler, so just attach the authorized user id
                if (event.requestContext.authorizer) {
                    request.user = event.requestContext.authorizer.principalId
                }
            },
        });
    }
    
    return handler(event, context, callback);
};
