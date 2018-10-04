// set a dummy AWS region
jest.mock('../lib/dynamodb-utils');
jest.mock('../lib/twilio-utils');

const handler = require('../handler');

describe('Handler suite', () => {
    test('check should pass', async () => {
        const event = {
            httpMethod: 'GET',
        };
        const context = 'context';

        const callback = (error, response) => {
            expect(response.statusCode).toEqual(200);
            expect(typeof response.body).toBe('string');
        };

        await handler.check(event, context, callback);
    });

    test('api should fail - invalid event', async () => {
        const event = 'event';
        const context = 'context';

        const callback = (error, response) => {
            expect(error).toBeTruthy();
            expect(response).toBeUndefined();
        };

        await handler.api(event, context, callback);
    });

    xtest('api should pass', async () => {
        const event = 'event';
        const context = 'context';

        const callback = (error, response) => {
            expect(response.statusCode).toEqual(200);
            expect(typeof response.body).toBe('string');
        };

        await handler.api(event, context, callback);
    });
});



