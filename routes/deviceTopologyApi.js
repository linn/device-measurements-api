"use strict";

const _ = require('underscore');
const factories = require('./factories');
const topologyRepository = require('../repositories/deviceTopologiesRepository');

const logger = require('../logger');

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