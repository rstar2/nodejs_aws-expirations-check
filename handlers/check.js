const moment = require('moment');

const apiFunctionSecret = process.env.AWS_LAMBDA_API_SECRET;

// initialize a Twilio client to send SMS
const twilioUtils = require('../utils/twilio')(process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN, process.env.TWILIO_SENDER);

const awsSesUtils = require('../utils/aws-ses')(process.env.AWS_SES_SENDER);


const webPush = require('../utils/web-push');

const dbAuth = require('../lib/db-auth');
const { dbList, } = require('../lib/db-items');
const { createResponse, } = require('../utils/http');
const dateUtils = require('../utils/date');

/**
 * 
 * @param {String} userId 
 * @param {Item[]} items
 * @return {Promise<String>}
 */
const notifyUser = async (userId, items, toSend = true, webUrl = null) => {
    // get user details
    const db = await dbAuth();
    const user = await db.get(userId);
    console.log(`Notifying user: ${JSON.stringify(user, ['id', 'email', 'name',])}`);

    const response = items.reduce((acc, item) => {
        return acc + '\n' + item.name + ' expires/d on ' + moment(item.expiresAt).format('MMM Do YY');
    }, '');
    console.log('Message ', response);

    if (response && toSend) {
        console.log('Send SMS and email');
        try {
            const email = webUrl ? 
                `${response}
            --------------
            Edit on: ${webUrl}` :
                response;
            await awsSesUtils.sendEmail(user.email || process.env.AWS_SES_RECEIVER, email);
            console.info('Sent Email with AWS SES Service');
        } catch (e) {
            console.warn('Failed to send Email with AWS SES Service',e);
        }

        try {
            await twilioUtils.sendSMS(user.phone || process.env.TWILIO_RECEIVER, response);
            console.info('Sent SMS with Twilio Service');
        } catch (e) {
            console.warn('Failed to send SMS with Twilio Service');
        }

        try {
            await webPush.sendNotification(user, response);
        } catch (err) {
            console.warn('Failed to send PushNotification');
        }
    }
    return response;
};

/**
 * @return {String}
 */
const now = () => moment().format('MMM Do YY');

module.exports.handler = async (event, context) => {
    // console.log("Event:");
    // console.dir(event);

    // natively provided by AWS
    const region = process.env.AWS_REGION;
    // custom env variable set in serverless.yml
    const stage = process.env.AWS_STAGE;
    // TODO: get the REST API id
    // const { promisify, } = require('util');
    // const AWS = require('aws-sdk');
    // const awsApigateway = new AWS.APIGateway({apiVersion: '2015-07-09',});
    // const getRestApis = promisify(awsApigateway.getRestApis.bind(awsApigateway));
    // const restAPis = await getRestApis();
    // console.dir(restAPis);
    const restApiId = '8i00jlvjlj';
    // https://8i00jlvjlj.execute-api.eu-west-1.amazonaws.com/dev
    // https://<restApiId>.execute-api.<awsRegion>.amazonaws.com/<stageName>
    const webUrl = `https://${restApiId}.execute-api.${region}.amazonaws.com/${stage}/`;

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

        // for testing purposes there's a Test Scheduled Event with this 'test' field set
        const isTest = !!event.test;

        const promises = [];
        users.forEach((/*Item[]*/Items, /*String*/user) => {
            promises.push(notifyUser(user, Items, !isTest, webUrl));
        });
        await Promise.all(promises);
        response = {
            checked: `Checked on ${now()}`,
            expired,
        };
    } else if (event.httpMethod) {
        // TODO: Not used and tested yet
        // this Lambda with HTTP gateway is secured with 'authorizer: aws_iam'
        const user = event.requestContext.identity.cognitoIdentityId;
        console.log(`Authenticated user identity: ${user}`);

        // if this is HTTP request
        response = createResponse(200, {
            checked: `Checked on ${now()}`,
            expired,
        });
    } else if (event.secret === apiFunctionSecret) {
        // again return a HTTP response
        response = createResponse(200, {
            checked: `Checked on ${now()}`,
            expired,
        });

        // check if we have to filter by single user
        const user = event.data.user;
        const toSend = event.data.send === true;
        await Promise.all(expired
            .filter(Item =>!user || user === Item.user)
            .map(Item => {
                // just trace the results
                return notifyUser(Item.user, [Item,], toSend, webUrl);
            }));
    }
    
    console.timeEnd('Invoking function check took');
    console.log(`Checked on ${now()} - expired: ${expired.length}`);
    
    return response;
};



