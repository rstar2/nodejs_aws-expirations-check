## For the Webapp Lambda Function
It's used as a GUI for the API Lambda Function,
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
	2. Use serverless-offline plugin. It can be used to test all functions with HTTP events , not just the Webapp one
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


## Securing with IAM (AWS Cognito and etc)
