"use strict";

var express = require('express');
var path = require('path');
var requestLogger = require('morgan');
var bodyParser = require('body-parser');

var log = require('./logger');
var config = require('./config');
var deviceMeasurementsApi = require('./routes/deviceMeasurementsApi');
var deviceTopologyApi = require('./routes/deviceTopologyApi');

var pingApi = require('./routes/pingApi');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));

app.use(requestLogger(config.requestLoggerFormat, { stream: log.stream }));

app.use(bodyParser.json({
    limit: '50mb',
    type: ['+json', 'json']
}));
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/device-measurements/:vendor/:productType/:serialNumber', deviceMeasurementsApi.get);

app.get('/devices/:serialNumber/topology', deviceTopologyApi.get);
app.post('/devices/:serialNumber/topology', deviceTopologyApi.post);

app.get('/ping', pingApi.ping);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    if (!err.status || err.status >= 500) {
        log.error(err);
    }
    res.status(err.status || 500);
    if (!req.accepts('html')) {
        res.json({
            message: err.message,
            error: config.showStackTraceOnError ? err : {}
        });
    } else {
        res.render('error', {
            message: err.message,
            error: config.showStackTraceOnError ? err : {}
        });
    }
});

module.exports = app;
