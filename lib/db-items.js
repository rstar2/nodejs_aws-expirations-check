const dynamodb_TableName = process.env.AWS_DYNAMODB_ITEMS;

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

const uuid = require('uuid');

const dbList = async () => {
    const params = {
        TableName: dynamodb_TableName,
        // The maximum number of items to evaluate (not necessarily the number of matching items).
        // If DynamoDB processes the number of items up to the limit while processing the results,
        // it stops the operation and returns the matching values up to that point
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
        enabled: data.enabled !== false,
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
        enabled: data.enabled !== false,
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


module.exports = {
    dbList,
    dbAdd,
    dbDelete,
    dbUpdate,
};
