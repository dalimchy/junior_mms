var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
const mongoose = require('mongoose');
var session = require('express-session');
var _ = require('lodash');
var fs = require('file-system');
var ejs = require('ejs');


//DB config
const db = require('./config/keys').mongoURI;
const secret = require('./config/keys').secret;
//Mongo DB connection
mongoose.connect(db, {
    useNewUrlParser: true
  }).then(()=>{
    console.log("DB connected");
  }).catch((err)=>{
    console.log("DB Error",err);
  });


var dashboard = require('./routes/dashboard');
var login = require('./routes/login');
var register = require('./routes/register');
var logout = require('./routes/logout');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(session({
    secret: secret,
    resave: false,
    saveUninitialized: true
  }));

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', dashboard);
app.use('/login', login);
app.use('/register', register);
app.use('/logout', logout);

/// catch 404 and forwarding to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

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
