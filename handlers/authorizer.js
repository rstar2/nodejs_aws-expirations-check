module.exports.handler = (event, context, callback) => {

    // Get Token
    if (typeof event.authorizationToken === 'undefined') {
        console.log('AUTH: No token');
        return callback('Unauthorized');
    }
    
    const split = event.authorizationToken.split('Bearer');
    if (split.length !== 2) {
        console.log('AUTH: no token in Bearer');
        return callback('Unauthorized');
    }
    const token = split[1].trim();

    // with Node8.10 Lambda we can return directly a promise
    // https://aws.amazon.com/blogs/compute/node-js-8-10-runtime-now-available-in-aws-lambda/
    return authorize(token, event.methodArn)
        .then((data => {
            console.log(`Authorized call with token ${token} for ${data.principalId}`);
            return data;
        }))
        .catch(err => {
            console.log(`Unauthorized call for token ${token}`);
            throw err;
        });
};

/**
 * 
 * @param {String} token 
 * @return {Promise} 
 */
const authorize = (token, resource) => {
    return new Promise((resolve, reject) => {


        /*
         * extra custom authorization logic here: OAUTH, JWT ... etc
         * search token in database and check if valid
         * here for demo purpose we will just compare with hardcoded value
         */
        switch (token) {
            case '4674cc54-bd05-11e7-abc4-cec278b6b50a':
                resolve(generatePolicy('user123', EFFECT_ALLOW, resource));
                break;
            case '4674cc54-bd05-11e7-abc4-cec278b6b50b':
                resolve(generatePolicy('user123', EFFECT_DENY, resource));
                break;
            default:
                reject('Unauthorized');
        }
    });

}

const EFFECT_ALLOW = 'Allow';
const EFFECT_DENY = 'Deny';

const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId,
    };

    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke',
                    Effect: effect,
                    Resource: resource,
                },
            ],
        };
        //Object.assign(authResponse, { policyDocument, });
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
};
