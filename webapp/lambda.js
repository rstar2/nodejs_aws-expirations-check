const serverless = require('serverless-http');

// this is explicitly set in 'serverless.yml' as environment-variable
const stage = process.env.AWS_STAGE;
const app = require('./app')(stage);
exports.handler = serverless(app);
