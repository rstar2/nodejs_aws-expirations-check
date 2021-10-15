const webpushLambdaSecret = process.env.AWS_LAMBDAS_SECRET;

const db = require('../lib/db-web-push');

const { createResponse, } = require('../utils/http');

const MAP_METHODS = {
    POST: ['register', 'unregister',],
};

// eslint-disable-next-line
module.exports.handler = async (event, context) => {
    // console.log('Event:');
    // console.dir(event);

    console.time('Invoking WebPushAPI Lambda took');

    let action, data, user;

    // check if this function is not invoked from another "authorized" function
    // here the secret has more meaning of an identified for such event, not as authorization-secret/token
    // as anyway AWS will allow only functions that has IAM permissions to invoke this one
    if (event.secret && event.secret === webpushLambdaSecret) {
        console.log('Invoking function from another authorized function');
        // this is event from another function
        action = event.action;
        data = event.data;
        user = event.user;
    } else {
        // set the user who is executing this webpush-api
        // this is normal API HTTP Gateway event
        user = event.requestContext.identity.cognitoIdentityId;

        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${user}`);

        // strip the '/webpush/' from the full path '/webpush/xxx'
        action = event.path.substring('/webpush/'.length);

        if (
            !MAP_METHODS[event.httpMethod] ||
            -1 === MAP_METHODS[event.httpMethod].indexOf(action)
        ) {
            throw new Error(
                `Unsupported WebPushAPI gateway with HTTP method ${event.httpMethod} and path ${event.path}`
            );
        }

        // assume it's JSON ("application/json")
        data = event.body && JSON.parse(event.body);
    }

    // there should be 'user' in data always -  this is the authenticated user
    if (!user) {
        return createResponse(500, { error: `Not authorized WebPushAPI action: ${action}`, });
    }

    try {
        const responseBody = await doAction(action, user, data);

        console.timeEnd('Invoking WebPushAPI Lambda took');
        console.timeEnd('Result is:', responseBody);
        return createResponse(200, responseBody);
    } catch (error) {
        console.error('error', error);
        console.timeEnd('Invoking WebPushAPI Lambda took');
        return createResponse(500, { error: '' + error, });
    }
};

/**
 *
 * @param {String} action
 * @param {Object} user
 * @param {Object} subscription
 * @return {Promise<Object>}
 */
const doAction = async (action, user, subscription) => {
    switch (action) {
        case 'register':
            console.log('Add PushSubscription for ', user);
            return db.dbAdd(user, subscription);
        case 'unregister':
            console.log('Delete PushSubscription for ', user);
            return db.dbDelete(user, subscription);
        default:
            throw new Error(`Invalid WebPushAPI action: ${action}`);
    }
};
