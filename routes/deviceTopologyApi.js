"use strict";

const _ = require('underscore');
const factories = require('./factories');
const topologyRepository = require('../repositories/deviceTopologiesRepository');

const spaceContentType = 'application/vnd.linn.space-configuration+json; version=1';
const spacePlusContentType = 'application/vnd.linn.space-plus-configuration+json; version=1';
const unsupportedContentType = 'application/vnd.linn.unsupported-configuration+json; version=1';
const userRequestedContentType = 'application/vnd.linn.user-requested-configuration+json; version=1';

const logger = require('../logger');

const acceptableMediaTypes = [
    userRequestedContentType
];

function selectTopology(topologies) {
    return _.chain(topologies)
        .sortBy('dateStamp')
        .last()
        .value();
}

function negotiate(req, res, model) {
    if (req.header('Accept') === 'application/json' || req.accepts(acceptableMediaTypes) === model.mediaType) {
        switch (model.mediaType) {
            case userRequestedContentType:
                res.set('Content-Type', userRequestedContentType);
                res.json(factories.toUserRequestedResource(model));
                res.status(200);
                break;
            default:
                res.sendStatus(406);
        }
    } else {
        res.sendStatus(406);
    }
}

exports.post = function addDeviceTopology(req, res, next) {
    var model = factories.createModel(req);
    if (!model) {
        var error = new Error('Could not create model from request');
        error.status = 400;
        next(error);
    } else {
        topologyRepository.addOrReplace(model, function (err) {
            if (err) {
                logger.error('Error Saving Model' + JSON.stringify(model));
                next(err);
            } else {
                res.sendStatus(201);
            }
        });
    }
};

exports.get = function getLatestDeviceTopology(req, res, next) {
    topologyRepository.filterBySerialNumber(req.params.serialNumber, function (err, data) {
        if (err) {
            next(err);
        } else if (!data || data.length === 0) {
            var error = new Error('Could not find device');
            error.status = 404;
            next(error);
        } else {
            negotiate(req, res, selectTopology(data));
        }
    });
};