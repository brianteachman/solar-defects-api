let express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRoute = require('./server/routes/index');
var apiRoutes = require('./server/routes/v1/api');

var app = express();
app.set('port', process.env.PORT || 3001);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'static')));

app.use('/', indexRoute);
app.use('/v1', apiRoutes);


module.exports = app;
