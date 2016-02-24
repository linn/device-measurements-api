"use strict";

var deviceRepository = require('./repositories/cloudDeviceRepository');
var productDescriptorRepository = require('./repositories/cloudProductDescriptorRepository');
var deviceCombiner = require('./deviceCombiner');
var productDescriptorMatcher = require('./productDescriptorMatcher');

var _ = require('underscore');

var async = require('async');

function selectProductDescriptor(productDescriptors, serialNumber, callback) {
    var results = _.filter(productDescriptors, productDescriptorMatcher(serialNumber));
    if (results.length === 1){
        callback(null, results[0] );
    } else if (results.length === 0) {
        callback(null, undefined);
    } else {
        async.map(results, function(result, iterCallback){
            deviceRepository.findBy(result.id, serialNumber, iterCallback);
        }, function(err, asyncResults) {
            if (asyncResults.length === 0){
                callback(null, results[0]);
            } else {
                var validResults = _.pluck(_.filter(asyncResults, function (ar){
                    if (ar) { return true;}
                }),'productDescriptorId');
                var goodResults = _.filter(results, function (result){
                    return validResults.indexOf(result.id) > -1;
                });
                if (goodResults.length > 0){
                    callback(null, goodResults[0]);
                } else {
                    callback(null, results[0]);
                }
            }
        });
    }
}

module.exports.create = function create(vendor, productType, serialNumber, callback) {
    async.waterfall([
        function getProductDescriptor(iterCallback) {
            productDescriptorRepository.filterBy(vendor, productType, iterCallback);
        },
        function filterProductDescriptors(results, iterCallback) {
            selectProductDescriptor(results, serialNumber, function(err, result) {
                if (err) {
                    iterCallback(err);
                } else if (!result) {
                    var error = new Error("Failed to find Product Descriptor");
                    error.status = 404;
                    iterCallback(error);
                } else {
                    iterCallback(null, result);
                }
            });
        },
        function getDeviceMeasurements(productDescriptor, iterCallback) {
            deviceRepository.findBy(productDescriptor.id, serialNumber, function(err, results) {
                if (err) {
                    iterCallback(err);
                } else if (!results) {
                    iterCallback(null, {
                        cloudProductDescriptor: productDescriptor,
                        cloudDevice: { serialNumber: serialNumber }
                    });
                } else {
                    iterCallback(null, {
                        cloudProductDescriptor: productDescriptor,
                        cloudDevice: results
                    });
                }
            });
        }, function combineProductDescriptorAndDevice(results, iterCallback) {
            deviceCombiner.combine(results.cloudDevice, results.cloudProductDescriptor, iterCallback);
        }
    ], callback);
};