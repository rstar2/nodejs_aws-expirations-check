const serverless = require('serverless-http');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.AWS_STAGE;
const app = require('../webapp/app')(stage);

// exports.handler = serverless(app);
exports.handler = (event, context, callback) => {
    console.log("Event:");
    console.dir(event);

    return serverless(app)(event, context, callback);
};
