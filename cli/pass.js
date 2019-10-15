const path = require('path');

const { promisify, } = require('util');

const bcrypt = require('bcryptjs');

// get the first program argument (after node and this script name)
const password = process.argv[2];
if (!password) {
    console.error('No password argument provided');
    process.exit(1);
}

// parse and configure the env variables
require('../utils/env').config(path.resolve(__dirname, '../env.yml'));

promisify(bcrypt.hash)(password, process.env.AUTH_PASSWORD_SALT)
    .then(hashPass => `Generated hash for password '${password}' -> '${hashPass}'`)
    .then(console.log);
