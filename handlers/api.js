const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

const { dbList, dbAdd, dbDelete, dbUpdate, } = require('../lib/dynamodb');

const { createResponse, } = require('../utils/http');

module.exports.handler = async (event, context, callback) => {
    console.log("Event:");
    console.dir(event);
    
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
        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${event.requestContext.identity.cognitoIdentityId}`);

        // this is normal API HTTP Gateway event
        switch (event.httpMethod) {
            case 'GET':
                switch (event.path) {
                    case '/list':
                        break;
                    default:
                        return callback(`Unsupported API gateway with HTTP GET path ${event.path}`);
                }
                break;

            // eslint-disable-next-line no-case-declarations
            case 'POST':
                switch (event.path) {
                    case '/add':
                    case '/delete':
                    case '/update':
                        break;
                    default:
                        return callback(`Unsupported API gateway with HTTP POST path ${event.path}`);
                }
                break;
            default:
                return callback(`Unsupported API gateway with HTTP method ${event.httpMethod}`);
        }

        action = event.path.substring(1);
        // assume it's JSON ("application/json")
        data = event.body && JSON.parse(event.body);
    }

    try {
        let responseBody;
        switch (action) {
            case 'list':
                responseBody = await dbList();
                break;
            case 'add':
                responseBody = await dbAdd(data);
                break;
            case 'delete':
                responseBody = await dbDelete(data);
                break;
            case 'update':
                responseBody = await dbUpdate(data);
                break;
            default:
                throw new Error(`Invalid api action: ${action}`);
        }

        console.timeEnd('Invoking function api took');
        callback(null, createResponse(200, responseBody));
    } catch (error) {
        console.timeEnd('Invoking function api took', '- failed');
        callback(null, createResponse(500, { error, }));
    }
};
