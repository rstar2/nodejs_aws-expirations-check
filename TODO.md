# For the Webapp client
1. ~~Use VueMaterial~~

2. ~~Build the app with webpack~~
	- ~~move DialogAdd to a separate Vue component~~
	- ~~use npm packages and not CDN~~
	- ~~deploy in AWS only the distribution build~~

3. Add authorization(register/login/logout/auth)
	- ~~using custom authorizers and JWT tokens~~ (no need for logout)
		- https://cloudly.tech/blog/serverless-authorizers-1/
		- https://medium.freecodecamp.org/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-ff657ab2f5a5
		- https://blog.usejournal.com/sessionless-authentication-withe-jwts-with-node-express-passport-js-69b059e4b22c
		- check '@websanova/vue-auth' VueJS package
	- using AWS IAM/Cognito
		- https://cloudly.tech/blog/serverless-authorizers-2/
		- https://serverless-stack.com/chapters/create-a-cognito-user-pool.html
		- https://www.tonytruong.net/serverless-framework-authentication-and-logging-with-aws-cognito/

4. ~~Add 'update' item functionality~~


## For the CLI tool
1. Finish the 'cli.js' to request the API-function directly with HTTP requests (using the 'request' module) 
