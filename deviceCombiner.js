"use strict";

var _ = require('underscore');
var clone = require('clone');

function mostRecentUpdateDate(components, lastUpdateDate) {
    return _.chain(components)
        .pluck('measurements')
        .map(function convertMeasurementObjectToValuesArray(namedMeasurements) {
            return _.values(namedMeasurements);
        })
        .flatten()
        .map(function extractFileAndValueMeasurementAsArray(measurement) {
            return [
                measurement.file ? measurement.file.measuredOn : void 0,
                measurement.value ? measurement.value.measuredOn : void 0
            ];
        })
        .flatten()
        .push(lastUpdateDate)
        .compact()
        .sortBy()
        .last()
        .value();
}

function mergeMeasurements(deviceComponent, genericComponent) {
    var mergedComponent = clone(deviceComponent);
    _.forEach(_.keys(genericComponent.measurements), function (measurementName) {
        if (!_.has(mergedComponent.measurements, measurementName)) {
            mergedComponent.measurements[measurementName] = genericComponent.measurements[measurementName];
        }
    });
    return mergedComponent;
}

function mergeComponents(genericMeasurements, deviceMeasurements) {
    return _.map(genericMeasurements.components, function (genericComponent) {
        var deviceComponent = _.findWhere(deviceMeasurements.components, {componentName: genericComponent.componentName});
        if (deviceComponent) {
            return mergeMeasurements(deviceComponent, genericComponent);
        }
        return genericComponent;
    });
}

exports.combine = function combineCloudDeviceAndGenericMeasurements(deviceMeasurements, genericMeasurements, callback) {
    var components = mergeComponents(genericMeasurements, deviceMeasurements);
    callback(null, {
        serialNumber: deviceMeasurements.serialNumber,
        components: components,
        lastUpdate: mostRecentUpdateDate(components, deviceMeasurements.lastUpdate)
    });
};