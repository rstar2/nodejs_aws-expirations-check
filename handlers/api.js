const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

const db = require('../lib/db-items');

const { capitalize, } = require('../utils/string');
const { createResponse, } = require('../utils/http');

const MAP_METHODS = {
    'GET': ['list',],
    'POST': ['add', 'delete', 'update',],
};

module.exports.handler = async (event, context, callback) => {
    // console.log("Event:");
    // console.dir(event);

    console.time('Invoking function api took');

    let action, data;

    // check if this function is not invoked from another "authorized" function
    // here the secret has more meaning of an identified for such event, not as authorization-secret/token
    // as anyway AWS will allow only functions that has IAM permissions to invoke this one
    if (event.secret === apiFunctionSecret) {
        console.log('Invoking function from another authorized function');
        // this is event from another function
        action = event.action;
        data = event.data;
    } else {
        // this is normal API HTTP Gateway event

        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${event.requestContext.identity.cognitoIdentityId}`);

        // strip the '/api/' from the full path '/api/xxx'
        action = event.path.substring('/api/'.length);

        if (!MAP_METHODS[event.httpMethod] || -1 === MAP_METHODS[event.httpMethod].indexOf(action)) {
            return callback(`Unsupported API gateway with HTTP method ${event.httpMethod} and path ${event.path}`);
        }

        // assume it's JSON ("application/json")
        data = event.body && JSON.parse(event.body);
    }

    try {
        const responseBody = await doAction(action, data);

        console.timeEnd('Invoking function api took');
        callback(null, createResponse(200, responseBody));
    } catch (error) {
        console.timeEnd('Invoking function api took', '- failed');
        callback(null, createResponse(500, { error, }));
    }
};

/**
 * 
 * @param {String} action
 * @param {Object} data
 * @return {Promise<String>}
 */
const doAction = (action, data) => {
    switch (action) {
        case 'list':
        case 'add':
        case 'delete':
        case 'update': {
            // 'list -> dbList
            // 'add' -> dbAdd
            // ...
            const dbMethod = 'db' + capitalize(action);
            return db[dbMethod](data);
        }
        default:
            throw new Error(`Invalid api action: ${action}`);
    }
};
