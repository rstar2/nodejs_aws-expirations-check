const dynamodb_TableName = process.env.AWS_DYNAMODB_ITEMS;

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

const uuid = require('uuid');

/**
 * @param {String} [user] 
 */
const dbList = async ({user,} = {}) => {
    const params = {
        TableName: dynamodb_TableName,
        // The maximum number of items to evaluate (not necessarily the number of matching items).
        // If DynamoDB processes the number of items up to the limit while processing the results,
        // it stops the operation and returns the matching values up to that point
        Limit: 1000,
    };

    if (user) {
        const filterByUser = {
            FilterExpression: '#user = :u',
            ExpressionAttributeNames: {
                '#user': 'user',
            },
            ExpressionAttributeValues: {
                ':u': user,
            },
        };
        Object.assign(params, filterByUser);
    }
    return dynamodbUtils.exec('scan', params);
};

const dbAdd = async ({user, name, expiresAt, daysBefore = 7, enabled = true}) => {
    const Item = {
        id: uuid.v1(),
        name,
        user,
        expiresAt,
        daysBefore,
        createdAt: Date.now(),
        enabled,
    };
    const params = {
        TableName: dynamodb_TableName,
        Item,
    };

    return dynamodbUtils.exec('put', params)
        // return the newly added item
        .then(() => ({ Item, }));
};

const dbDelete = async ({id}) => {
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

const dbUpdate = async ({id, name, expiresAt, daysBefore = 7, enabled = true}) => {
    // currently all Item's data is obligatory, otherwise the DynamoDB 'UpdateExpression' will fail
    // if not enough 'ExpressionAttributeValues' values are provided
    const Item = {
        id: id,
        name: name,
        expiresAt: expiresAt,
        daysBefore: daysBefore,
        enabled: enabled,
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
        UpdateExpression: 'set #name=:n, expiresAt=:ex, daysBefore=:db, createdAt=:c, enabled=:en',
        ExpressionAttributeNames: {
            '#name': 'name',
        },
        ExpressionAttributeValues: {
            ':n': Item.name,
            ':ex': Item.expiresAt,
            ':db': Item.daysBefore,
            ':c': Item.createdAt,
            ':en': Item.enabled,
        },
        // ReturnValues: 'UPDATED_NEW',
    };
    return dynamodbUtils.exec('update', params)
        // return the updated item
        .then(() => ({ Item, }));
};


module.exports = {
    dbList,
    dbAdd,
    dbDelete,
    dbUpdate,
};
