# TODOs

## For the Webapp client

- ~~Use Vuetify~~

- ~~Build the app with webpack~~
  - ~~move DialogAdd to a separate Vue component~~
  - ~~use npm packages and not CDN~~
  - ~~deploy in AWS only the distribution build~~

- ~~Add authorization(register/login/logout/auth)~~
  - ~~using custom authorizers and JWT tokens~~ (no need for logout)
    - [https://cloudly.tech/blog/serverless-authorizers-1/]
    - [https://medium.freecodecamp.org/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-ff657ab2f5a5]
    - [https://blog.usejournal.com/sessionless-authentication-withe-jwts-with-node-express-passport-js-69b059e4b22c]
    - ~~when JWT token expires and is not validated in the authorizer when Webapp client calls authorized API ('invoke/api') then it should be invalidated in the Webapp client (proper Unauthorized 403 error has to come to the client, not just 500)~~

- ~~Add 'update' item functionality~~
- ~~Add 'active' item functionality - e.g. skip inactive items when checked for expiration~~
- ~~Update Vuetify to version 2~~

- ~~Allow different users~~
  - ~~Should have different expiration lists~~
  - ~~Should have different notification email~~

- ~~Allow different "daysBefore" for each expired item

- ~~Confirmation on Delete~~

- ~~Better Vuetify-DatePicker handling~~

- ~~Make it a PWA with PushNotifications support~~

- Use @vue/cli (with PWA, Vuetify plugins), maybe also Vite for faster development

- Implement client bundle splitting in chunks and thus caching - no need to always stream the JS/CSS/IMAGES if they are not changed
- Host static files in S3
- ? Use ApplicationLoadBalancer (ALB) for triggering the Lambda functions

## For the CLI tool

- Finish the 'cli.js' to request the API-function directly with HTTP requests (using the 'request/axios/node-fetch' module)

# Bugs

## Backend

- ~~New items are not added with the 'user' field~~
- The image icons (like those from the manifest.json) are not served as binary. With ```sls offline``` it's working properly but in the AWS cloud not - something is still missing, maybe something in "API Gateway" config
	> In the webapp.js Lambda the serverless-http is already configured with ```binary: ['image/*']```, which works in ```sls offline``` but not when deployed to AWS.

## Client

- ~~The 'Enabled' checkbox in the the table is not centered~~
- ~~When on mobile the rows are not visually good (offset-ed a little) when the name is on more lines~~
	> Use the $vuetify.breakpoint.xsOnly breakpoint to set specific style to the table in this case
