const createResponse = (statusCode, body) => {
    // let numbers, string, booleans be passed as they are and stringify only Objects like {asd: "asd"}
    if (typeof body === 'object' )
        body = JSON.stringify(body);
    return {
        statusCode,
        body,
    };
};

exports.createResponse = createResponse;
