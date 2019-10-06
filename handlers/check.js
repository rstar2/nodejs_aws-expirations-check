const moment = require('moment');

const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

// initialize a Twilio client to send SMS
const twilioUtils = require('../utils/twilio')(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_SENDER);

const awsSesUtils = require('../utils/aws-ses')(process.env.AWS_SES_SENDER);

const { dbList, } = require('../lib/db-items');
const { createResponse, } = require('../utils/http');
const dateUtils = require('../utils/date');

module.exports.handler = async (event, context, callback) => {
    // console.log("Event:");
    // console.dir(event);

    let response;
    console.time('Invoking function check took');

    const data = await dbList();
    // data of the type { "Items":[...], "Count": 1, "ScannedCount":1 }
    const /*Array*/ list = data.Items;

    // filter those expiring the next 7 days
    const expired = (list && list
        .filter(item => item.enabled !== false) // some items may not have 'enabled' field - assume them as "enabled"
        .filter(item => dateUtils.isExpiredDay(item.expiresAt, item.dayBefore || 7))) || [];

    if (event['detail-type'] === 'Scheduled Event') {
        // if this is Scheduled event - send real SMS
        // const users = new Map();
        // expired.forEach(Item => {
        //     const user = users.get(Item.email)
        // });

        response = expired.reduce((acc, item) => {
            return acc + '\n' + item.name + ' expires/d on ' + moment(item.expiresAt).format('MMM Do YY');
        }, '');

        if (response) {
            console.log('Message ', response);
            try {
                await awsSesUtils.sendSMS(process.env.AWS_SES_RECEIVER, response);
            } catch (e) {
                console.warn('Failed to send Email with AWS SES Service');
            }

            try {
                await twilioUtils.sendSMS(process.env.TWILIO_RECEIVER, response);
            } catch (e) {
                console.warn('Failed to send SMS with Twilio Service');
            }
        }
    } else if (event.httpMethod) {
        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${event.requestContext.identity.cognitoIdentityId}`);

        // if this is HTTP request
        response = createResponse(200, {
            checked: `Checked on ${moment().format('MMM Do YY')}`,
            expired,

            // just to see what AWS sends
            // event,
            // context,
            // env: process.env,
        });
    } else if (event.secret === apiFunctionSecret) {
        // again return a HTTP response
        response = createResponse(200, {
            checked: `Checked on ${moment().format('MMM Do YY')}`,
            expired,
        });
    }
    
    console.timeEnd('Invoking function check took');
    console.log(`Checked on ${Date.now()} : ${moment().format('MMM Do YY')} - expired: ${expired.length}`);
    callback(null, response);
};



