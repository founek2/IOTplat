var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
const Jwt = require('./bin/utils/jwt');
const config = require("./config")
mongoose.Promise = require('bluebird');
const apiRoute = require('./routes/api');

console.log("config", config)

//mongoose.connect("mongodb://localhost/IOT");
mongoose.connect(`mongodb://${config.db.userName}:${config.db.password}@${config.db.url}/${config.db.dbName}`,
    { useMongoClient: true }).catch(err => {
        // mongoose connection error will be handled here
        console.error("App starting error:", err.stack);
    });



var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/api/secure', function (req, res, next) {
    const token = req.get('authorization-jwt');

    if (token && token != "null") {
        Jwt.verify(token)
            .then(payload => {
                req.user = payload;
                next();
            })
            .catch(e => res.status(202).send({ status: 'Platnost přihlášení vypršela!' }));
    } else {
        res.status(202).send({ status: 'Neautorizovaný uživatel!' });
    }
});
app.use('/api', apiRoute);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.send()
});

Date.prototype.setTimezoneOffset = function (minutes) {
    var _minutes;
    if (this.timezoneOffset == _minutes) {
        _minutes = this.getTimezoneOffset();
    } else {
        _minutes = this.timezoneOffset;
    }
    if (arguments.length) {
        this.timezoneOffset = minutes;
    } else {
        this.timezoneOffset = minutes = this.getTimezoneOffset();
    }
    return this.setTime(this.getTime() + (_minutes - minutes) * 6e4);
};

module.exports = app;
