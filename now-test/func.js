module.exports = async (req, res) => {
    const { body, } = req;
    res.end(`Serverless Function ${JSON.stringify(body)}, you just parsed the request body!`);
};
