const moment = require('moment');

const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

// initialize a Twilio client to send SMS
const twilioUtils = require('../utils/twilio')(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_SENDER);

const awsSesUtils = require('../utils/aws-ses')(process.env.AWS_SES_SENDER);

const dbAuth = require('../lib/db-auth');
const { dbList, } = require('../lib/db-items');
const { createResponse, } = require('../utils/http');
const dateUtils = require('../utils/date');

/**
 * 
 * @param {String} userId 
 * @param {Item[]} items
 * @return {String}
 */
const notifyUser = async (userId, items, toSend = true) => {
    // get user details
    const db = await dbAuth();
    const user = await db.get(userId);
    console.log(`Notifying user: ${JSON.stringify(user)}`);

    const response = items.reduce((acc, item) => {
        return acc + '\n' + item.name + ' expires/d on ' + moment(item.expiresAt).format('MMM Do YY');
    }, '');
    console.log('Message ', response);

    if (response && toSend) {
        
        try {
            await awsSesUtils.sendSMS(user.email || process.env.AWS_SES_RECEIVER, response);
        } catch (e) {
            console.warn('Failed to send Email with AWS SES Service',e);
        }

        try {
            await twilioUtils.sendSMS(user.phone || process.env.TWILIO_RECEIVER, response);
        } catch (e) {
            console.warn('Failed to send SMS with Twilio Service');
        }
    }
    return response;
};

/**
 * @return {String}
 */
const now = () => moment().format('MMM Do YY');

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
        .filter(Item => Item.enabled !== false) // some items may not have 'enabled' field - assume them as "enabled"
        .filter(Item => dateUtils.isExpiredDay(Item.expiresAt, Item.daysBefore || 7))) || [];

    if (event['detail-type'] === 'Scheduled Event') {
        // if this is Scheduled event - send real SMS

        // separate users and notify each of them separately
        const users = new Map();
        expired.forEach(Item => {
            let items;
            if (!users.has(Item.user)) {
                items = [];
                users.set(Item.user, items);
            } else {
                items = users.get(Item.user);
            }
            items.push(Item);
        });

        response = '';
        users.forEach((/*Item[]*/Items, /*String*/user) => {
            response += notifyUser(user, Items);
        });
    } else if (event.httpMethod) {
        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        console.log(`Authenticated user identity: ${event.requestContext.identity.cognitoIdentityId}`);

        // if this is HTTP request
        response = createResponse(200, {
            checked: `Checked on ${now()}`,
            expired,

            // just to see what AWS sends
            // event,
            // context,
            // env: process.env,
        });
    } else if (event.secret === apiFunctionSecret) {
        // again return a HTTP response
        response = createResponse(200, {
            checked: `Checked on ${now()}`,
            expired,
        });

        expired.forEach(Item => {
            console.log('daysBefore');
            
            dateUtils.isExpiredDay(Item.expiresAt, Item.daysBefore || 7)
            notifyUser(Item.user, [Item,], false);
        });
    }
    
    console.timeEnd('Invoking function check took');
    console.log(`Checked on ${now()} - expired: ${expired.length}`);
    callback(null, response);
};



