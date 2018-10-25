const { promisify, } = require('util');

const bcrypt = require('bcryptjs');

// get the first program argument (after node and this script name)
const password = process.argv[2];
if (!password) {
    console.error('No password argument provided');
    process.exit(1);
}

const fs = require('fs');
if (fs.existsSync('../env.yml')) {
    const yaml = require('js-yaml');
    const parsedEnvYaml = yaml.load(fs.readFileSync('../env.yml'));
    const env = parsedEnvYaml['env'];
    Object.keys(env).forEach((key) => process.env[key] = process.env[key] || env[key]);
}

promisify(bcrypt.hash)(password, process.env.AUTH_PASSWORD_SALT)
    .then(hashPass => `Generated hash for password '${password}' -> '${hashPass}'`)
    .then(console.log);
