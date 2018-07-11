var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Jwt = require('./bin/utils/jwt');

//mongoose.connect("mongodb://localhost/IOT");
mongoose
     .connect('mongodb://localhost/IOT')
     .then(() => {
          console.log('connected to mongoDB');
     })
     .catch(err => {
          // mongoose connection error will be handled here
          console.error('App starting error:', err.stack);
          //process.exit(1);
     });

var index = require('./routes/index');
var users = require('./routes/users');
const registerSensorRoute = require('./routes/registerSensor');
const saveSensorDataRoute = require('./routes/saveSensorData');
const updateSensorDataRoute = require('./routes/updateSensorData');
const showGraphRoute = require('./routes/showGraph');
const apiRoute = require('./routes/api');

var app = express();

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
app.use('/users', users);
app.use('/registerSensor', registerSensorRoute);
app.use('/saveSensorData', saveSensorDataRoute);
app.use('/updateSensorData', updateSensorDataRoute);
app.use('/showGraph', showGraphRoute);
app.use('/api/secure', function(req, res, next) {
     const token = req.get('authorization-jwt');
     if (token) {
          Jwt.verify(token)
               .then(payload => {
                    req.user = payload;
                    next();
               })
               .catch(e => res.send({ status: 'Platnost přihlášení vypršela!' }));
     } else {
          res.send({ status: 'Neautorizovaný uživatel!' });
     }
});
app.use('/api', apiRoute);

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
