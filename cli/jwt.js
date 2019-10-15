const path = require('path');

const id = process.argv[2];
if (!id) {
    console.error('No id argument provided');
    process.exit(1);
}

// parse and configure the env variables
require('../utils/env').config('../env.yml');

const jwt = require(path.resolve(__dirname, '../env.yml'))(process.env.AUTH_JWT_SECRET);
const main = async () => {
    let token;
    await jwt.sign(id)
        .then(t => token = t && t)
        .then(token => `Generated JWT for id '${id}' -> '${token}'`)
        .then(console.log);

    await jwt.verify(token)
        .then(id => `Verified JWT token '${token}' -> '${id}'`)
        .then(console.log);
};

main();
