const jwt = require('../utils/jwt')(process.env.JWT_SECRET);

module.exports = (app) => {

    // https://medium.freecodecamp.org/a-crash-course-on-securing-serverless-apis-with-json-web-tokens-ff657ab2f5a5
    
    app.post('/register', (req, res) => {
        // res.render('index');
    });

    app.post('/login', (req, res) => {
        // res.render('index');
    });
};
