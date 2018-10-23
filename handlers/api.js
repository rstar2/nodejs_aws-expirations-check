const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

module.exports.handler = async (event, context, callback) => {
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

const createResponse = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
    };
};

const dbList = async () => {
    const params = {
        TableName: dynamodb_TableName,
        Limit: 1000,
    };
    return dynamodbUtils.exec('scan', params);
};

const dbAdd = async (data) => {
    const Item = {
        id: uuid.v1(),
        name: data.name,
        expiresAt: data.expiresAt,
        createdAt: Date.now(),
    };
    const params = {
        TableName: dynamodb_TableName,
        Item,
    };
    return dynamodbUtils.exec('put', params)
        // return the newly added item
        .then(() => ({ Item, }));
};

const dbDelete = async (data) => {
    const id = data.id;
    const params = {
        TableName: dynamodb_TableName,
        Key: {
            id,
        },
    };
    return dynamodbUtils.exec('delete', params)
        // return the deleted item's id
        .then(() => ({ id, }));
};

const dbUpdate = async (data) => {
    // currently all Item's data is obligatory, otherwise the DynamoDB 'UpdateExpression' will fail
    // if not enough 'ExpressionAttributeValues' values are provided
    const Item = {
        id: data.id,
        name: data.name,
        expiresAt: data.expiresAt,
        createdAt: Date.now(),
    };

    const params = {
        TableName: dynamodb_TableName,
        Key: {
            id: Item.id,
        },

        // NOTE - because 'name' is reserved word (as 'status', 'eval', 'timestamp', 'date' and many more
        // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
        // we'll use ExpressionAttributeNames that maps "#name" (not reserved any more) to "name"
        UpdateExpression: 'set #name=:n, expiresAt=:e, createdAt=:c',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':n': Item.name,
            ':e': Item.expiresAt,
            ':c': Item.createdAt,
        },
        // ReturnValues: 'UPDATED_NEW',
    };
    return dynamodbUtils.exec('update', params)
        // return the updated item
        .then(() => ({ Item, }));
};
