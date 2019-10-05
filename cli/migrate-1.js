// set 'user' to all all items in 'my-expirations-check-dev-expirations'

// 874d1d50-d927-11e8-a63b-9bd38c38fe40

// treat the "--user=123" as string "123" always, not as number 123
const argv = require('minimist')(process.argv.slice(2), { number: ['user',], });

// usage:
const help = `Usage: 
	migrate-1 [--user=XXX]
Examples:
    migrate-1 --user=XXXX
`;

const user = argv['user'];

const exit = (error, printHelp = true) => {
    console.error(error);
    if (printHelp) console.error(help);

    process.exit(1);
};

if (!user) {
    exit('No user specified');
}

// parse and config the env variables
require('./utils').config('../env.yml');

const dynamodb_TableName = process.env.AWS_DYNAMODB_ITEMS;

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../utils/dynamodb')(process.env.AWS_REGION);

const dbSetUSer = async (itemId, user) => {
    const params = {
        TableName: dynamodb_TableName,
        Key: {
            id: itemId,
        },

        // NOTE - because 'user' is reserved word (as 'status', 'eval', 'timestamp', 'date' and many more
        // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/ReservedWords.html)
        // we'll use ExpressionAttributeNames that maps "#user" (not reserved any more) to "user"
        UpdateExpression: 'set #user=:u',
        ExpressionAttributeNames: {
            '#user': 'user',
        },
        ExpressionAttributeValues: {
            ':u': user,
        },
        ReturnValues: 'UPDATED_NEW',
    };
    return dynamodbUtils.exec('update', params);
};

const dbGetAll = async () => {
    const params = {
        TableName: dynamodb_TableName,
        ExpressionAttributeNames: { // return just the 'id'
            '#k' : 'id',  // partition key
        }, 
        ProjectionExpression: '#k', 
    };
    return dynamodbUtils.exec('scan', params).then(result => result.Items);
};

dbGetAll().then(/*Array*/Items => {
    console.log(`Update all ${Items.length} items`);
    Items.forEach(({id,}) => dbSetUSer(id, user));
});
