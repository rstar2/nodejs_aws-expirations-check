const path = require('path');

const express = require('express');
const handlebars = require('express-handlebars');

const hbs = handlebars.create({
    defaultLayout: false,   // no layout by default
    extname: '.hbs',
});

/**
 * Factory method
 * @return {Express.Application}}
 */
module.exports = (stage) => {
    const app = express();
    // the root folder for the template views
    app.set('views', path.join(__dirname, 'views'));
    // Register `hbs` as our view engine using its bound `engine()` function.
    app.engine('hbs', hbs.engine);
    // use the Handlebars engine
    app.set('view engine', 'hbs');

    // for debug purpose
    // app.use((req, res, next) => {
    //     console.log(req);
    //     next();
    // });

    // from Express 4.16 they are back in the core
    app.use(express.urlencoded({ extended: false, }));
    app.use(express.json());

    app.use('/public', express.static(path.join(__dirname, 'public')));

    // it's best the service-worker to be on root level as then it can control the page
    // if it's served form public/js/service-worker.js that it will control pages with scope 'public/js'
    // but in this case the app's url is the main "/" url (e.g. where the index.html (index.hbs) is)
    // https://stackoverflow.com/questions/56338747/navigator-serviceworker-ready-not-fireing-when-sw-placed-in-subfolder
    // https://stackoverflow.com/questions/29874068/navigator-serviceworker-is-never-ready
    app.use('/service-worker.js', express.static(path.join(__dirname, 'public/js/service-worker.js')));

    // set the stage as global local template variable (e.g. accessible in all routes)
    // if (process.env.IS_OFFLINE === 'true') {
    //     // if we test it locally with
    //     // $ sls offline start
    //     app.locals['context-path'] = '';
    // } else {
    app.locals['context-path'] = stage ? '/' + stage : '';
    // }

    app.locals['ga-id'] = process.env.GOOGLE_ANALYTICS_ID;
    
    // for debug purpose
    app.use((req, res, next) => {
        console.log('Requested', req.path);
        next();
    });

    // configure routes
    const apiRouter = express.Router();
    require('./routes/api')(apiRouter);
    app.use('/invoke/api', apiRouter);

    const webPushRouter = express.Router();
    require('./routes/web-push')(webPushRouter);
    app.use('/invoke/webpush', webPushRouter);

    const authRouter = express.Router();
    require('./routes/auth')(authRouter);
    app.use('/auth', authRouter);

    const viewsRouter = express.Router();
    require('./routes/views')(viewsRouter);
    app.use('/', viewsRouter);

    return app;
};
