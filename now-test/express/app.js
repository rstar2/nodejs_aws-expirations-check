const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

// Note: if this express app is started from Now.sh then the routing is also done by Now.sh
// In this case ots better to let Now.sh handle all the routing and there to be specific lambdas
// for each specific route, BUT if for some reason we want there to be ONLY ONE lambda that is handled
// by express in the routing is done here then if there's a route-path for this lambda in now.json
// then it should be attached to all routes here
// now.json :
// "routes": [
//     {"src": "/ex/(.*)", "dest": "/express/app.js"},
//  ]
// so the "/ex" path should be set in NOW_API_EXPRESS_PATH environment
const path = process.env.NOW_API_EXPRESS_PATH || '';
app.use(`${path}/bands`, require('./routes/bands'));

app.use('/', (req, res) => res.end('Hello from Express'));

module.exports = app;

// for local development, e.g when not deployed to Now.sh
if (!process.env.NOW_REGION) {
    app.listen(5000, () => {
    // eslint-disable-next-line no-console
        console.log('Server running at localhost:5000');
    });
}
