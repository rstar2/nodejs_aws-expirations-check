module.exports.handler = (event, context, callback) => {

    // Get Token
    if (typeof event.authorizationToken === 'undefined') {
        console.log('AUTH: No token');
        callback('Unauthorized');
    }

    const split = event.authorizationToken.split('Bearer');
    if (split.length !== 2) {
        console.log('AUTH: no token in Bearer');
        callback('Unauthorized');
    }
    const token = split[1].trim();


    /*
     * extra custom authorization logic here: OAUTH, JWT ... etc
     * search token in database and check if valid
     * here for demo purpose we will just compare with hardcoded value
     */
    switch (token.toLowerCase()) {
        case '4674cc54-bd05-11e7-abc4-cec278b6b50a':
            callback(null, generatePolicy('user123', 'Allow', event.methodArn));
            break;
        case '4674cc54-bd05-11e7-abc4-cec278b6b50b':
            callback(null, generatePolicy('user123', 'Deny', event.methodArn));
            break;
        default:
            callback('Unauthorized');
    }

};

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
