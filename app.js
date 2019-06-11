const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const config = require('./config/config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

// Middlewares
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger('dev'));

// Importing Index Routes
app.use('/', routes);

// Start Server
let { port } = config;
app.listen(port, () => console.log(`APP running on port ${port}`) );

module.exports = app;
