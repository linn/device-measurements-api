"use strict";

var builder = require('xmlbuilder');
var _ = require('underscore');

module.exports.build = function build(konfigDevice) {
    var root = builder.create('Device');
    root.attribute('xmlns:xsi', 'http://www.w3.org/2001/XMLSchema-instance');
    root.attribute('xmlns:xsd', 'http://www.w3.org/2001/XMLSchema');

    root.ele('SerialNumber', konfigDevice.serialNumber);
    var components = root.ele('Components');

    _.forEach(konfigDevice.components, function (component) {
        var element = components.ele('Component');
        element.ele('ComponentName', component.componentName);
        var measurements = element.ele('Measurements');
        _.forEach(component.measurements, function (measurement) {
            var measurementElement = measurements.ele('Measurement', { 'xsi:type': measurement.type });
            measurementElement.ele('Name', measurement.name);
            measurementElement.ele('MeasuredOn', measurement.measuredOn);
            measurementElement.ele('SourceName', measurement.sourceName);
            measurementElement.ele('SourceVersion', measurement.sourceVersion);
            switch (measurement.type) {
                case 'file':
                    measurementElement.ele('FileType', measurement.fileType);
                    var filesElement = measurementElement.ele('Files');
                    _.forEach(measurement.files, function(link) {
                        filesElement.ele('Link', { Href: link.href, Rel: link.filename });
                    });
                    break;
                case 'value':
                    measurementElement.ele('Value', measurement.value);
                    var metadataElement = measurementElement.ele('Metadata');
                    _.forEach(_.keys(measurement.metadata), function (key) {
                        var metadatumElement = metadataElement.ele('Metadatum');
                        metadatumElement.ele('Key', key);
                        metadatumElement.ele('Value', measurement.metadata[key]);
                    });
                    break;
            }
        });
    });

    root.ele('LastUpdate', konfigDevice.lastUpdate);

    return root.end({ pretty: true });
};