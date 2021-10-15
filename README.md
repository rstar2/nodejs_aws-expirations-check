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

	```bash
	$ cd webapp
	$ npm run dev (or npm run build)
	```

2. To test locally - two ways

	1. Start the local Express app instance 'app-local.js' with

		```bash
		$ cd webapp
		$ node app-local
		```

	2. Use serverless-offline plugin. It can be used to test all functions with HTTP events, not just the Webapp one

		```bash
		$ sls offline start
		```

		This assumes the webapp client-JS-bundle is prebuild

3. To develop

Start the dev scripts for the server and for the webapp client building, e.g.

```bash
npm run sls:dev
```

and

```bash
npm run client:dev
```

## Deploy to AWS

```bash
$ sls deploy
```

## Use of the CLI

```bash
$ node cli update --localHttp --id=ab18a7a0-5839-11e8-a4ce-a5f3659aa8fd --expire="Feb 17, 2019"
```

## Securing with custom authorizer

Currently there's a bug in serverless-offline plugin that don't add the AWS_REGION environment variable to the authorizer handler.
To fix locally until there's official fix: https://github.com/dherault/serverless-offline/pull/491
Add in _serverless-offline/src/createAuthScheme.js_:

```js
Object.assign(
            process.env,
            { AWS_REGION: serverless.service.provider.region });
        handler = functionHelper.createHandler(funOptions, options);
```

instead of just

```js
        handler = functionHelper.createHandler(funOptions, options);
```

## Securing with IAM (AWS Cognito and etc)

## Implementing WebPush

Generate VAPID keys from https://web-push-codelab.glitch.me/

{"endpoint":"https://fcm.googleapis.com/fcm/send/e12xvK-vvl8:APA91bEjBZ9LK0_tQLe6LMgpAFWlgH7ywEjnkgY2ZUaqZGJiaUi1I5tKXNo7lk6Eol-2R7EZBGMk2_QnoDSyhmUezCdDQChSMg1JJc2UESO0CwDOvHjUfZjkIMl8VbhBx9V-XD0tCkiR","expirationTime":null,"keys":{"p256dh":"BOKbC14xD8QkVy5IL3yil19eKDGXqiYeMf4OqSu6MStFLxxrcOWA5ePudnkutVF1c3K-Hk71g5mg93d4wJ0VzFE","auth":"ZrTxsyab-sTRVbHom-3Wgg"}}

{"endpoint":"https://fcm.googleapis.com/fcm/send/cC1uRN4aN18:APA91bHQpMO3ZsICaCmE8dAcIvqKUKF5TmgnmkYkkjWZXjR9l2X60VAxLLN0r8PLwiplCdIjrC1Dn-ILi5IYvIsyuLWseSHjLKcHry-_WnMn48WYEP06-paAWem_JmBJyXeY6vYtFfCG","expirationTime":null,"keys":{"p256dh":"BM5gpGUiiUI7nc_M3YOwzzdFkSWACp8P6XJsyKI90ttMzGX4PNtL5pyNb_F7igdm_lv5hm8cExVj2z6hOqecUz8","auth":"OwzeGqcvw5_Q0rSTlEuXjA"}}
