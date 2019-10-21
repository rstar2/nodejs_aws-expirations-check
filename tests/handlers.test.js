const cloneDeep = require('clone-deep');

// set a dummy AWS region
jest.mock('../utils/dynamodb');
jest.mock('../utils/twilio');

const handlerApi = require('../handlers/api').handler;
const handlerCheck = require('../handlers/check').handler;

describe('Handler suite', () => {
    test('check should pass', async () => {
        //don't mutate the origin mock event
        const event = cloneDeep(require('./mocks/event-schedule.json'));
        const context = 'context';

        const response = await handlerCheck(event, context);
        expect(response).toBeDefined();
        expect(Array.isArray(response.expired)).toBe(true);
        console.log(response.expired);
        
        expect(response.expired.length).toBe(4);
    });

    test('api should fail - invalid event', async () => {
        const event = 'event';
        const context = 'context';

        let response;
        try {
            response = await handlerApi(event, context);
        } catch (error) {
            expect(error).toBeTruthy();
        }
        
        expect(response).toBeUndefined();
    });

    test('api should fail - unauthorized', async () => {
        //don't mutate the origin mock event
        const event = cloneDeep(require('./mocks/event-http-get.json'));
        // the HTTP body should be a valid JSON string (not object as in the JSON mock)
        event.body = JSON.stringify(event.body);
        event.requestContext.identity.cognitoIdentityId = null;
        const context = 'context';

        const response = await handlerApi(event, context);
        expect(response.statusCode).toEqual(500);
        expect(response.body).toBeDefined();
        const { error, } = JSON.parse(response.body);
        expect(error).toContain('Not authorized');
    });

    test('api should pass', async () => {
        //don't mutate the origin mock event
        const event = cloneDeep(require('./mocks/event-http-get.json'));
        // the HTTP body should be a valid JSON string (not object as in the JSON mock)
        event.body = JSON.stringify(event.body);
        const context = 'context';

        const response = await handlerApi(event, context);

        expect(response.statusCode).toEqual(200);
        expect(response.body).toBeTruthy();
    });
});



