// Note if deployed with 'now' and builder '@now/node'
// 1. it will automatically call 'npm i' if there's package-json file
// 2. all other js file are in the deployment but just not exposed as Serverless functions

// import npm module
const { format, } = require('date-fns');

// import local module
const add = require('./module');


module.exports = async (req, res) => {
    const { body, } = req;
    const { x, y,} = body;
    res.end(`API Serverless Function ${JSON.stringify(body)}, ${add(x, y)}, ${format(new Date(2014, 1, 11), 'yyyy-MM-dd')}!`);
};
