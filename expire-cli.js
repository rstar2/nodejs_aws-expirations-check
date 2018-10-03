
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
}

if (!action) {
	return exit('No action specified');
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
			return exit(`Missing '--name' argument for the 'add' action.`);
		}
		if (!expiresAt) {
			return exit(`Missing '--expire' argument for the 'add' action.`);
		}
		expiresAt = new Date(expiresAt).getTime();
		event.httpMethod = 'POST';
		event.body = JSON.stringify({ name, expiresAt, });
		break;
	case 'delete':
		if (!id) {
			return exit(`Missing '--id' argument for the 'delete' action.`);
		}
		event.httpMethod = 'POST';
		event.body = JSON.stringify({ id, });
		break;
	default:
		return exit(`No valid action ${action}`);
}
if (isLocal) {
	// this will load the necessary ENV variables from env.yml
	const fs = require('fs');
	const yaml = require('js-yaml');
	const parsedEnvYaml = yaml.load(fs.readFileSync('./env.yml'));

	let env;
	if (parsedEnvYaml) {
		const stage = process.env.NODE_ENV || 'dev';
		env = parsedEnvYaml[stage] || parsedEnvYaml['default'];
	}
	if (env) {
		env.AWS_REGION = env.AWS_REGION || 'eu-central-1';
		Object.keys(env).forEach((key) => process.env[key] = process.env[key] || env[key]);
	}

	const handler = require('./handler')[func];
	handler(event, null, (error, response) => {
		if (error) {
			console.error('Finished with error', error);
			return;
		}
		
		console.log('Finished successfully', response);
	});
} else {
	const request = require('request');
	console.error('Not ready yet');
}

