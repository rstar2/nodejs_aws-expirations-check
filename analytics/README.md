# client

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


# Deployment to Now.sh

Install now and now-dotenv ```npm i -g now now-dotenv```
Create a 'now.json' file with builders for the client (the Vue app) and the API serverless functions
The tricky part is to pass the environment variables to the API serverless functions,
as I want them to be also defined in a '.env'  file.
So the '.env.local' file is used for local development - for both the VueApp and a local express-server for the API.
The '.env.prop' will be used for production and because Now requires the env variables to be defined in the now.json file
and even better to be using Now secrets

```json
"env": {
  "GOOGLE_ANALYTICS_CLIENT_EMAIL": "something secret"
}
```

 so for this use a helper package 'now-dotenv' which syncs a given env file (using dotenv) and merges them in the 'now.json'.

```now-dotenv sync --env ./.env.prod``` - this will create the parsed envs as Now secrets and reference them:

.env.prod :
```
GOOGLE_ANALYTICS_CLIENT_EMAIL=something secret
```

now.json :

```json
"env": {
  "GOOGLE_ANALYTICS_CLIENT_EMAIL": "@run-aws-expirations-check-analytics-google-analytics_client_email"
}
```

and 'run-aws-expirations-check-analytics-google-analytics_client_email' will be a Now secret
