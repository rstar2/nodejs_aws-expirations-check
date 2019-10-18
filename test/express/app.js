const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.use('bands', require('./routes/bands'));

module.exports = app;
