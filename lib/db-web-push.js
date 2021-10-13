const dynamodb_TableName = process.env.AWS_DYNAMODB_AUTH;

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

/**
 * @param {string} id
 * @return {Promise<PushSubscription[]>} always valid
 */
const dbList = async (id) => {
    const params = {
        Key: {
            id,
        },
        TableName: dynamodb_TableName,
    };
    return dynamodbUtils.exec('get', params)
        // returned data is { Item }
        // .then(data => console.dir(data) || data)
        .then(({ Item, }) => Item)
        .then(({ subscriptions, }) => subscriptions)
        .then(parseSubscriptions);
};

/**
 * @param {string} id
 * @param {PushSubscription} subscription
 * @return {Promise<boolean>}
 */
const dbAdd = async (id, subscription) => {
    const params = {
        Key: {
            id,
        },
        TableName: dynamodb_TableName,
    };
    return dynamodbUtils.exec('get', params)
        .then(({ Item, }) => Item)
        .then((Item) => {
            let {subscriptions} = Item;

            subscriptions = parseSubscriptions(subscriptions);

            // check if the subscription is not already saved
            if (subscriptions.some(aSubscription => aSubscription.endpoint === subscription.endpoint))
                return false;

            // add the new subscription
            subscriptions.push(subscription);
            
            return update(id, subscriptions);
        });
};

/**
 * @param {string} id
 * @param {PushSubscription} subscription
 * @return {Promise<boolean>}
 */
const dbDelete = async (id, subscription) => {
    const params = {
        Key: {
            id,
        },
        TableName: dynamodb_TableName,
    };
    return dynamodbUtils.exec('get', params)
        .then(({ Item, }) => Item)
        .then((Item) => {
            let {subscriptions} = Item;

            subscriptions = parseSubscriptions(subscriptions);
            // no subscriptions yet then do nothing
            if (subscriptions.length)
                return false;

            const lengthBefore = subscriptions.length;

            // remove if already available
            subscriptions = subscriptions.filter(aSubscription => aSubscription.endpoint !== subscription.endpoint);
            const lengthAfter = subscriptions.length;

            // if no change then do nothing
            if (lengthBefore === lengthAfter)
                return false;

            // pass the updated Subscriptions
            return update(id, subscriptions.join(', '));
        });
};

/**
 * 
 * @param {string} id 
 * @param {PushSubscription[]} subscriptions 
 * @return {Promise<true>}
 */
const update = (id, subscriptions) => {
    // pass the updated Subscriptions again as a string
    subscriptions = subscriptions
        .map(aSubscription => JSON.stringify(aSubscription))
        .join(', ');
    const params = {
        Key: {
            id,
        },
        UpdateExpression: 'set subscriptions = :subscriptions',
        ExpressionAttributeValues:{
            ':subscriptions': subscriptions
        },
        ReturnValues:'UPDATED_NEW',
        TableName: dynamodb_TableName,
    };

    return dynamodbUtils.exec('update', params)
        .then(() => true);
};

/**
 * 
 * @param {string} subscriptions
 * @return {PushSubscription[]} always valid
 */
const parseSubscriptions = (subscriptions) => {
    if (!subscriptions) {
        // empty subscriptions
        subscriptions = [];
    } else {
        // make it string[] array
        subscriptions = subscriptions.split(', ');
    }

    // map it to PushSubscription[] array
    return subscriptions.map(subscriptionStr => JSON.parse(subscriptionStr));
};

module.exports = {
    dbList,
    dbAdd,
    dbDelete,
};
