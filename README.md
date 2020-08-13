# Expirations check app

Built with technologies:

- Serverless (specifically AWS, including Lambda, DynamoDb, SES, Cognito)

- Node.js - all AWS Lambda functions

- WebApp/API made with Express, and Handlebars (and again Node.js and AWS-SDK)

- WebApp is made with Vue.js, bundled with Webpack

- Has GoogleAnalytics support, as well as custom webview for its results (the ./analytics folder)

- Has CLI functionalities (for API interactions, JWT generation, database migrations)

- Has Flutter app (one as simple Web wrapper, another one with native widgets)

## For the Webapp Lambda Function

It's used as a GUI for the API Lambda Function:

1. First build the client code (implemented with VueJS and Webpack)

	```
	$ cd webapp
	$ npm run dev (or npm run build)
	```

2. To test locally

	1. Start the local Express app instance 'app-local.js' with

		```
		$ cd webapp
		$ node app-local
		```

	2. Use serverless-offline plugin. It can be used to test all functions with HTTP events, not just the Webapp one

		```
		$ sls offline start
		```

## Deploy to AWS

```
$ sls deploy
```

## Use of the CLI

```
$ node cli update --localHttp --id=ab18a7a0-5839-11e8-a4ce-a5f3659aa8fd --expire="Feb 17, 2019"
```


## Securing with custom authorizer

Currently there's a bug in serverless-offline plugin that don't add the AWS_REGION environment variable to the authorizer handler.
To fix locally until there's official fix: https://github.com/dherault/serverless-offline/pull/491
Add in _serverless-offline/src/createAuthScheme.js_:
```
Object.assign(
            process.env,
            { AWS_REGION: serverless.service.provider.region });
        handler = functionHelper.createHandler(funOptions, options);
```
instead of just
```
        handler = functionHelper.createHandler(funOptions, options);
```

## Securing with IAM (AWS Cognito and etc)
