'use strict';

const moment = require('moment');
const uuid = require('uuid');

// initialize a DynamoDB client for the specific region
const dynamodbUtils = require('../lib/dynamodb-utils')(process.env.AWS_REGION);
const dynamodb_TableName = 'my-expirations-check-dev-expirations';

const dateUtils = require('../lib/date-utils');

// initialize a Twilio client to send SMS
const twilioUtils = require('../lib/twilio-utils')(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_SENDER);

const awsSesUtils = require('../lib/aws-ses-utils')(process.env.AWS_SES_SENDER);

module.exports.handler = async (event, context, callback) => {
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



