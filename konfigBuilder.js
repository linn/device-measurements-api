"use strict";
var _ = require('underscore');

function invertMeasurements(component) {
    var measurements = [];
    _.forEach(_.keys(component.measurements), function (measurementName) {
        if (!_.isEmpty(component.measurements[measurementName].file)) {
            measurements.push(
                _.extend({name: measurementName, type: 'file'}, component.measurements[measurementName].file)
            );
        }
        if (!_.isEmpty(component.measurements[measurementName].value)) {
            measurements.push(
                _.extend({name: measurementName, type: 'value'}, component.measurements[measurementName].value)
            );
        }
    });
    return {
        componentName: component.componentName,
        measurements: measurements
    };
}

module.exports.build = function build(cloudModel) {
    return {
        serialNumber: cloudModel.serialNumber,
        components: _.map(cloudModel.components, invertMeasurements),
        lastUpdate: cloudModel.lastUpdate
    };
};