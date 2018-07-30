const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
// const session = require('express-session');
// const auth = require('./config/auth');
const routes = require('./routes/index');
const config = require('./config/config');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.png')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

////////////////////////SESSION///////////////////////
// app.use(session({
//     secret: "wdw3%Sefdgb#3rgyE!",
//     resave: false,
// 	saveUninitialized: false }));

// app.use(auth.initialize());
// app.use(auth.session());

// app.use(function(req, res, next) {
// 	res.locals.user = req.user;
// 	next();
// });

app.use('/', routes);

app.set('port', process.env.PORT || config.port);

const server = app.listen(app.get('port'), () => {
  console.log(`Express running → PORT ${server.address().port}`);
});

module.exports = app;
