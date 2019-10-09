
// treat the "--id=123" as string "123" always, not as number 123
// treat the "--local" as boolean value
const argv = require('minimist')(process.argv.slice(2), { boolean: true, string: ['id',], });

// usage:
const help =
`Usage: 
	cli <action> [--name=XXX] [--expire=YYY] [--id=YYY] [--user=YYY] [--localHttp] [--localInvoke]
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
    cli check --user=XXXXXX --localInvoke
`;
const action = argv._[0];
const isLocalHttp = !!argv['localHttp']; // locally invoke the function handler
const isLocalInvoke = !!argv['localInvoke']; // locally invoke the function handler
const name = argv['name'];
let expiresAt = argv['expire'];
const id = argv['id'];
const user = argv['user'];

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

let event = {};
let func = 'api';
let data, httpMethod;
switch (action) {
    case 'check':
        httpMethod = 'GET';
        func = 'check';
        if (!user) {
            exit('Missing \'--user\' argument for the \'check\' action.');
        }
        data = { user, };
        break;
    case 'list':
        httpMethod = 'GET';
        break;
    case 'add':
        if (!name) {
            exit('Missing \'--name\' argument for the \'add\' action.');
        }
        if (!expiresAt) {
            exit('Missing \'--expire\' argument for the \'add\' action.');
        }
        httpMethod = 'POST';
        data = { name, expiresAt, };
        break;
    case 'delete':
        if (!id) {
            exit('Missing \'--id\' argument for the \'delete\' action.');
        }
        httpMethod = 'POST';
        data = { id, };
        break;
    case 'update':
        if (!id) {
            exit('Missing \'--id\' argument for the \'update\' action.');
        }
        if (!name || !expiresAt) {
            exit('Missing either \'--name\' and/or \'--expire\' argument for the \'update\' action.');
        }

        httpMethod = 'POST';
        data = { id, name, expiresAt, };
        break;
    default:
        exit(`No valid action ${action}`);
}

require('./utils').config('../env.yml');

if (isLocalInvoke) {
    // for direct/local invoke event
    Object.assign(event, {
        // add the "auth"/identification secret/token
        secret: process.env.AWS_LAMBDA_API_SECRET,
        action,
        data,
    });
} else {
    // for fake or real HTTP event request
    Object.assign(event, {
        httpMethod,
        path: '/api/' + action,
        body: data && JSON.stringify(data),
    });
}

if (isLocalInvoke || isLocalHttp) {
    // invoke by sending a "fake" event to another-function event 
    const handler = require(`../handlers/${func}`).handler;
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

