const app = require('./app');
const server = require('http').createServer(app);

// Config
server.listen(5000, () => {
    // eslint-disable-next-line no-console
    console.log('Server running at localhost:5000');
});
