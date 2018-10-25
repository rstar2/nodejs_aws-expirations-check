const id = process.argv[2];
if (!id) {
    console.error('No id argument provided');
    process.exit(1);
}

const fs = require('fs');
if (fs.existsSync('../env.yml')) {
    const yaml = require('js-yaml');
    const parsedEnvYaml = yaml.load(fs.readFileSync('../env.yml'));
    const env = parsedEnvYaml['env'];
    Object.keys(env).forEach((key) => process.env[key] = process.env[key] || env[key]);
}

const jwt = require('../utils/jwt')(process.env.AUTH_JWT_SECRET);
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
