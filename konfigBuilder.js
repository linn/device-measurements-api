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
    const componentVersion = _.reduce(measurements, (accum, m) => Math.max(accum, parseInt(m.version) || 0), 0);
    return {
        componentName: component.componentName,
        measurements: measurements,
        componentVersion
    };
}

module.exports.build = function build(cloudModel) {
    return {
        serialNumber: cloudModel.serialNumber,
        components: _.map(cloudModel.components, invertMeasurements),
        lastUpdate: cloudModel.lastUpdate
    };
};