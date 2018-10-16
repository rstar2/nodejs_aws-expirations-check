
// treat the "--id=123" as string "123" always, not as number 123
// treat the "--local" as boolean value
const argv = require('minimist')(process.argv.slice(2), { boolean: true, string: ['id',], });

// usage:
const help =
    `Usage: 
	expire-cli <action> [--name=XXX] [--expire=YYY] [--id=YYY] [--local]
Note: --local option will invoke the function handler locally, otherwise will request the function public API, e.g. will create real HTTP request
Examples:
	expire-cli list
	expire-cli add --name=XXXX --expire="2 17 2019"
	expire-cli add --name=XXXX --expire="2/17/2019"
	expire-cli add --name=XXXX --expire="2-17-2019"
	expire-cli add --name=XXXX --expire="2019-2-17"
	expire-cli add --name=XXXX --expire="Feb 17, 2019"
	expire-cli delete --id=XXXXX
`;
const action = argv._[0];
const isLocal = !!argv['local']; // locally invoke the function handler
const name = argv['name'];
let expiresAt = argv['expire'];
const id = argv['id'];

const exit = (error, printHelp = true) => {
    console.error(error);
    if (printHelp)
        console.error(help);

    process.exit(1);
};

if (!action) {
    exit('No action specified');
}

let event = {
    path: '/' + action,
};
let func = 'api';
switch (action) {
    case 'check':
        event.httpMethod = 'GET';
        func = 'check';
        break;
    case 'list':
        event.httpMethod = 'GET';
        break;
    case 'add':
        if (!name) {
            exit('Missing \'--name\' argument for the \'add\' action.');
        }
        if (!expiresAt) {
            exit('Missing \'--expire\' argument for the \'add\' action.');
        }
        expiresAt = new Date(expiresAt).getTime();
        event.httpMethod = 'POST';
        event.body = JSON.stringify({ name, expiresAt, });
        break;
    case 'delete':
        if (!id) {
            exit('Missing \'--id\' argument for the \'delete\' action.');
        }
        event.httpMethod = 'POST';
        event.body = JSON.stringify({ id, });
        break;
    default:
        exit(`No valid action ${action}`);
}

if (isLocal) {
    // this will load the necessary ENV variables from env.yml
    const fs = require('fs');
    const yaml = require('js-yaml');
    const parsedEnvYaml = yaml.load(fs.readFileSync('../env.yml'));

    let env = parsedEnvYaml['env'];
    const stage = process.env.NODE_ENV || 'dev';
    const stageEnv = parsedEnvYaml[stage] || parsedEnvYaml['default'];
    env = { ...env, ...stageEnv, }; // destructuring objects will take care if env or stageEnv is null/undefined
    // merge with "real" env variables, eg. if any is already set DO NOT overwrite it
    Object.keys(env).forEach((key) => process.env[key] = process.env[key] || env[key]);

    const handler = require('../handler')[func];
    handler(event, null, (error, response) => {
        if (error) {
            console.error('Finished with error', error);
            return;
        }

        console.log('Finished successfully', response);
    });
} else {
    // TODO: USe HTPP requests
    const request = require('request');
    console.error('Not ready yet');
}

