"use strict";

var konfigResourceBuilder = require('../konfigBuilder');
var konfigXmlResourceBuilder = require('../konfigXmlBuilder');

var cloudDeviceFactory = require('../cloudDeviceFactory');

var jsonContentType = 'application/vnd.linn.device-measurements+json; version=4';
var xmlContentType = 'application/vnd.linn.device-measurements+xml; version=4';

var acceptedMediaTypes = [
    jsonContentType,
    xmlContentType,
    'json',
    'text/html'
];

function negotiate(req, res, cloudModel) {
    switch (req.accepts(acceptedMediaTypes)) {
        case 'json':
        case 'text/html':
        case jsonContentType:
            res.set('Content-Type', jsonContentType);
            res.json(konfigResourceBuilder.build(cloudModel));
            res.status(200);
            break;
        case xmlContentType:
            res.set('Content-Type', xmlContentType);
            res.send(konfigXmlResourceBuilder.build(konfigResourceBuilder.build(cloudModel)));
            res.status(200);
            break;
        default:
            res.sendStatus(406);
    }
}

exports.get = function getCloudDevice(req, res, next) {
    var serialNumber;
    if (isNaN(req.params.serialNumber)){
        serialNumber = req.params.serialNumber;
    } else {
        serialNumber = parseInt(req.params.serialNumber, 10).toString();
    }
    cloudDeviceFactory.create(req.params.vendor, req.params.productType, serialNumber, function (err, results) {
        if (err) {
            next(err);
        } else {
            negotiate(req, res, results);
        }
    });
};