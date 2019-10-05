const fs = require('fs');
const yaml = require('js-yaml');
    
/**
 * Common configuration code, parse the 'env.yml' file and set its fields as environment variables
 * @param {String} envFile
 */
module.exports.config = (envFile = 'env.yml') => {
    // this will load the necessary ENV variables from env.yml
    const parsedEnvYaml = yaml.load(fs.readFileSync(envFile));

    let env = parsedEnvYaml['env'];
    const stage = process.env.NODE_ENV || 'dev';
    const stageEnv = parsedEnvYaml[stage] || parsedEnvYaml['default'];
    env = { ...env, ...stageEnv, }; // destructuring objects will take care if env or stageEnv is null/undefined
    // merge with "real" env variables, eg. if any is already set DO NOT overwrite it
    Object.keys(env).forEach((key) => process.env[key] = process.env[key] || env[key]);

    // TODO: get from the serverless.yml so then it's defined in only one place
    if (!process.env.AWS_DYNAMODB_ITEMS) {
        process.env.AWS_DYNAMODB_ITEMS = `my-expirations-check-${stage}-expirations`;
    }
};
