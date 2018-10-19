'use strict';

const moment = require('moment');
const uuid = require('uuid');

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('./lib/dynamodb-utils')(process.env.AWS_REGION);
const dynamodb_TableName = 'my-expirations-check-dev-expirations';

const dateUtils = require('./lib/date-utils');

// initialize a Twilio client to send SMS
const twilioUtils = require('./lib/twilio-utils')(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_SENDER);

const awsSesUtils = require('./lib/aws-ses-utils')(process.env.AWS_SES_SENDER);

module.exports.check = async (event, context, callback) => {
    let response;
    console.time('Invoking function check took');

    const data = await dbList();
    // data of the type { "Items":[...], "Count": 1, "ScannedCount":1 }
    const list = data.Items;

    // filter those expiring the next 7 days
    let expired = (list && list.filter(item => dateUtils.isExpiredDay(item.expiresAt, 7))) || [];

    if (event['detail-type'] === 'Scheduled Event') {
        // if this is Scheduled event - send real SMS
        const message = expired.reduce((acc, item) => {
            return acc + '\n' + item.name + ' expires/d on ' + moment(item.expiresAt).format('MMM Do YY');
        }, '');

        if (message) {
            console.log('Message ', message);
            try {
                await awsSesUtils.sendSMS(process.env.AWS_SES_RECEIVER, message);
            } catch (e) {
                console.warn('Failed to send Email with AWS SES Service');
            }

            try {
                await twilioUtils.sendSMS(process.env.TWILIO_RECEIVER, message);
            } catch (e) {
                console.warn('Failed to send SMS with Twilio Service');
            }
        }
    } else if (event.httpMethod) {
        // if this is HTTP request
        response = createResponse(200, {
            checked: `Checked on ${moment().format('MMM Do YY')}`,
            expired,

            // just to see what AWS sends
            // event,
            // context,
            // env: process.env,
        });
    }
    console.timeEnd('Invoking function check took');
    console.log(`Checked on ${Date.now()} : ${moment().format('MMM Do YY')} - expired: ${expired.length}`);
    callback(null, response);
};


const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

module.exports.api = async (event, context, callback) => {
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
