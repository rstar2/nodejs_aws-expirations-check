# For the Webapp client
1. ~~Use VueMaterial~~

2. ~~Build the app with webpack~~
	- ~~move DialogAdd to a separate Vue component~~
	- ~~use npm packages and not CDN~~
	- ~~deploy in AWS only the distribution build~~

3. ~~Add authorization(register/login/logout/auth)~~
	- ~~using custom authorizers and JWT tokens~~ (no need for logout)
		- https://cloudly.tech/blog/serverless-authorizers-1/
		- https://medium.freecodecamp.org/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-ff657ab2f5a5
		- https://blog.usejournal.com/sessionless-authentication-withe-jwts-with-node-express-passport-js-69b059e4b22c
		- check '@websanova/vue-auth' VueJS package
	- ~~when JWT token expires and is not validated in the authorizer when Webapp client calls authorized API ('invoke/api')
		then it should be invalidated in the Webapp client
		(proper Unauthorized 403 error has to come to the client, not just 500)~~

4. ~~Add 'update' item functionality~~

5. ~~Add 'active' item functionality - e.g. skip inactive items when checked for expiration~~

6. Allow updating the "expiration" window time-frame

## For the CLI tool
1. Finish the 'cli.js' to request the API-function directly with HTTP requests (using the 'request' module) 
