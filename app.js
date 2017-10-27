var express = require('express');
var app = express();
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var moment = require('moment');
var fs = require('fs');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({secret:"jjjj",resave:false,saveUninitialized:true}));

var routes = require('./routes/index');
var users = require('./routes/users');
var home = require('./routes/home');
var reg = require('./routes/reg');
var regh= require('./routes/regh');
var you = require('./routes/you');
var me = require('./routes/me');
var plan= require('./routes/plan');
/*var login = require('./iwork/login');*/
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


var mongoose = require("mongoose");
var multer = require("multer");
var schema = require('./Schemas/user_schema.js');

app.use(logger('dev'));

app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node', express.static(__dirname + '/node_modules'));
app.use(multipartMiddleware);


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
//app.set('view engine', 'ejs');

app.use('/', routes);
app.use('/users', users);

app.use('/reg', reg);
app.use('/host', regh);
app.use('/home', home);
app.use('/planatrip', plan);
/*app.use('/you', you);
 app.use('/me', me);*/



// catch 404 and forward to error handler)
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




module.exports = app;
