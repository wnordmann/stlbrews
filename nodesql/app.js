var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');
var checkin = require('./routes/checkin');
var duesPaid = require('./routes/duesPaid');
var friendship = require('./routes/friendship');
var mysql = require("mysql");

var app = express();


//Database connection
app.use(function(req, res, next){
	res.locals.mysql = mysql.createConnection({
    host     : 'stlbrews.c648gpljcst8.us-east-1.rds.amazonaws.com',
    user     : 'willie',
    password : 'oSNHvZQ26zsd',
    database : 'stlbrews'
	});
	res.locals.mysql.connect();
	next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/api/v1/users', users);
app.use('/api/v1/checkin', checkin);
app.use('/api/v1/duespaid', duesPaid);
app.use('/api/v1/friendship', friendship);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
