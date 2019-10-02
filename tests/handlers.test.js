// set a dummy AWS region
jest.mock('../utils/dynamodb');
jest.mock('../utils/twilio');

const handlerApi = require('../handlers/api').handler;
const handlerCheck = require('../handlers/api').handler;

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

        await handlerCheck(event, context, callback);
    });

    test('api should fail - invalid event', async () => {
        const event = 'event';
        const context = 'context';

        const callback = (error, response) => {
            expect(error).toBeTruthy();
            expect(response).toBeUndefined();
        };

        await handlerApi(event, context, callback);
    });

    xtest('api should pass', async () => {
        const event = 'event';
        const context = 'context';

        const callback = (error, response) => {
            expect(response.statusCode).toEqual(200);
            expect(typeof response.body).toBe('string');
        };

        await handlerApi(event, context, callback);
    });
});



