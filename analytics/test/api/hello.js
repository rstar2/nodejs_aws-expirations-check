module.exports = async (req, res) => {
    const { body, } = req;
    res.end(`Hello ${JSON.stringify(body)}, you just parsed the request body!`);
};
