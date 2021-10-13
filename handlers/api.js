const apiLambdaSecret = process.env.AWS_LAMBDAS_SECRET;

const db = require('../lib/db-items');

const { capitalize, } = require('../utils/string');
const { createResponse, } = require('../utils/http');

const MAP_METHODS = {
    GET: ['list',],
    POST: ['add', 'delete', 'update',],
};

// eslint-disable-next-line
module.exports.handler = async (event, context) => {
    // console.log('Event:');
    // console.dir(event);

    console.time('Invoking API Lambda took');

    let action, data;

    // check if this function is not invoked from another "authorized" function
    // here the secret has more meaning of an identified for such event, not as authorization-secret/token
    // as anyway AWS will allow only functions that has IAM permissions to invoke this one
    if (event.secret && event.secret === apiLambdaSecret) {
        console.log('Invoking Lambda from another authorized Lambda');
        // this is event from another function
        action = event.action;
        
        // object
        data = event.data;
        
        // string
        data.user = event.user;
        // there should be 'user' in data always
    } else {
        // this is normal API HTTP Gateway event
        const user = event.requestContext.identity.cognitoIdentityId;
        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${user}`);

        // strip the '/api/' from the full path '/api/xxx'
        action = event.path.substring('/api/'.length);

        if (
            !MAP_METHODS[event.httpMethod] ||
            -1 === MAP_METHODS[event.httpMethod].indexOf(action)
        ) {
            throw new Error(
                `Unsupported API gateway with HTTP method ${event.httpMethod} and path ${event.path}`
            );
        }

        // assume it's JSON ("application/json")
        data = event.body && JSON.parse(event.body);

        // set the user who is executing this api
        data.user = user;
    }

    // there should be 'user' in data always -  this is the authenticated user
    if (!data.user) {
        return createResponse(500, { error: `Not authorized API action: ${action}`, });
    }

    try {
        const responseBody = await doAction(action, data);

        console.timeEnd('Invoking API Lambda took');
        return createResponse(200, responseBody);
    } catch (error) {
        console.error('error', error);
        console.timeEnd('Invoking API Lambda took');
        return createResponse(500, { error: '' + error, });
    }
};

/**
 *
 * @param {String} action
 * @param {Object} data
 * @return {Promise<Object>}
 */
const doAction = async (action, data) => {
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
