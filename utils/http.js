const createResponse = (statusCode, body) => {
    return {
        statusCode,
        body: JSON.stringify(body),
    };
};

exports.createResponse = createResponse;
