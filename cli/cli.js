
// treat the "--id=123" as string "123" always, not as number 123
// treat the "--local" as boolean value
const argv = require('minimist')(process.argv.slice(2), { boolean: true, string: ['id',], });

// usage:
const help =
    `Usage: 
	cli <action> [--name=XXX] [--expire=YYY] [--id=YYY] [--localHttp] [--localInvoke]
Note:
    --localHttp option will invoke the function handler locally by faking a dummy HTTP event,
    --localInvoke option will invoke the function handler locally by faking a dummy "secret" event,
      otherwise will request the function public API, e.g. will create real HTTP request
Examples:
	cli list
	cli add --name=XXXX --expire="2 17 2019"
	cli add --name=XXXX --expire="2/17/2019"
	cli add --name=XXXX --expire="2-17-2019"
	cli add --name=XXXX --expire="2019-2-17"
	cli add --name=XXXX --expire="Feb 17, 2019"
	cli delete --id=XXXXX
	cli update --id=XXXXX --expire="Feb 17, 2019"
`;
const action = argv._[0];
const isLocalHttp = !!argv['localHttp']; // locally invoke the function handler
const isLocalInvoke = !!argv['localInvoke']; // locally invoke the function handler
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

// convert to Number
if (expiresAt) {
    expiresAt = new Date(expiresAt).getTime();
}

let event = {
    action,
    path: '/' + action,
};
let func = 'api';
let data;
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
        event.httpMethod = 'POST';
        data = { name, expiresAt, };
        break;
    case 'delete':
        if (!id) {
            exit('Missing \'--id\' argument for the \'delete\' action.');
        }
        event.httpMethod = 'POST';
        data = { id, };
        break;
    case 'update':
        if (!id) {
            exit('Missing \'--id\' argument for the \'update\' action.');
        }
        if (!name || !expiresAt) {
            exit('Missing either \'--name\' and/or \'--expire\' argument for the \'update\' action.');
        }

        event.httpMethod = 'POST';
        data = { id, name, expiresAt, };
        break;    
    default:
        exit(`No valid action ${action}`);
}

if (data) {
    Object.assign(event, {
        data,
        body: JSON.stringify(data),
    });
}

if (isLocalInvoke || isLocalHttp) {
    // invoke by sending "fake" another-function event  or  "fake" HTTP event 

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

    if (isLocalInvoke) {
        // add the "auth"/identification secret/token
        Object.assign(event, {
            secret: process.env.AWS_LAMBDA_API_SECRET,
        });
    }
    handler(event, null, (error, response) => {
        if (error) {
            console.error('Finished with error', error);
            return;
        }

        console.log('Finished successfully', response);
    });
} else {
    // TODO: Use real HTTP requests
    const request = require('request');
    console.error('Not implemented yet');
}

