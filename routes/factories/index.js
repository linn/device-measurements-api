"use strict";
var moment = require('moment');
var _ = require('underscore');

var spaceContentType = 'application/vnd.linn.space-configuration+json; version=1';
var spacePlusContentType = 'application/vnd.linn.space-plus-configuration+json; version=1';
var unsupportedConfigurationContentType = 'application/vnd.linn.unsupported-configuration+json; version=1';
var userRequestedConfigurationContentType = 'application/vnd.linn.user-requested-configuration+json; version=1';

function validSpaceConfiguration(req) {
    return req.params.serialNumber === req.body.dsSerialNumber;
}

function validSpacePlusConfiguration(req) {
    return req.params.serialNumber === req.body.dsSerialNumber;
}

function validUnsupportedConfiguration(req) {
    return req.params.serialNumber === req.body.dsSerialNumber;
}

function validUserRequestedConfiguration(req) {
    return req.params.serialNumber === req.body.dsSerialNumber;
}

function string2literal(value) {
    var maps = {
        "null": null,
        "": null
    };
    return ((value in maps) ? maps[value] : value);
}

function toModelString(value) {
    return string2literal(String(value));
}

function createUnsupportedConfigurationModel(req) {
    if (!validUnsupportedConfiguration(req)) {
        return null;
    }
    var postDate = new Date();
    return {
        mediaType: unsupportedConfigurationContentType,
        dateStamp: postDate.toISOString(),
        dsSerialNumber: toModelString(req.body.dsSerialNumber),
        dsFirmwareVersion: toModelString(req.body.dsFirmwareVersion),
        speakerVendor: toModelString(req.body.speakerVendor),
        speakerType: toModelString(req.body.speakerType)
    };
}

function createSpaceModel(req) {
    if (!validSpaceConfiguration(req)) {
        return null;
    }
    var postDate = new Date();
    return {
        mediaType: spaceContentType,
        dateStamp: postDate.toISOString(),
        dsSerialNumber: toModelString(req.body.dsSerialNumber),
        dsFirmwareVersion: toModelString(req.body.dsFirmwareVersion),
        speakerVendor: toModelString(req.body.speakerVendor),
        speakerType: toModelString(req.body.speakerType)
    };
}

function toModelSpeaker(speaker) {
    return {
        speakerSerialNumber: toModelString(speaker.speakerSerialNumber),
        speakerVendor: toModelString(speaker.speakerVendor),
        speakerType: toModelString(speaker.speakerType),
        speakerChannel: toModelString(speaker.speakerChannel)
    };
}

function toModelExaktDevice(device) {
    if (device.exaktSerialNumber) {
        return {
            exaktSerialNumber: toModelString(device.exaktSerialNumber),
            exaktConfiguration: _.map(device.exaktConfiguration, toModelString),
            speakers: _.map(device.speakers, toModelSpeaker)
        };
    } else {
        return null;
    }
}

function toModelUserSubmission(userSubmission) {
    return {
        speakerVendor: toModelString(userSubmission.speakerVendor),
        speakerType: toModelString(userSubmission.speakerType),
        additionalInformation: toModelString(userSubmission.additionalInformation)
    };
}

function createSpacePlusModel(req) {
    if (!validSpacePlusConfiguration(req)) {
        return null;
    }
    var postDate = new Date();
    return {
        mediaType: spacePlusContentType,
        dateStamp: postDate.toISOString(),
        dsSerialNumber: toModelString(req.body.dsSerialNumber),
        dsFirmwareVersion: toModelString(req.body.dsFirmwareVersion),
        exaktDevices: _.chain(req.body.exaktDevices).map(toModelExaktDevice).compact().value()
    };
}

function createUserRequestedConfigurationModel(req) {
    if (!validUserRequestedConfiguration(req)) {
        return null;
    }
    var postDate = new Date();
    return {
        mediaType: userRequestedConfigurationContentType,
        dateStamp: postDate.toISOString(),
        dsSerialNumber: toModelString(req.body.dsSerialNumber),
        dsFirmwareVersion: toModelString(req.body.dsFirmwareVersion),
        userSubmission: toModelUserSubmission(req.body.userSubmission)
    };
}

module.exports.createModel = function createModel(req) {
    switch(req.header('Content-Type')) {
        case userRequestedConfigurationContentType:
            return createUserRequestedConfigurationModel(req);
        case unsupportedConfigurationContentType:
            return createUnsupportedConfigurationModel(req);
        case spaceContentType:
            return createSpaceModel(req);
        case spacePlusContentType:
            return createSpacePlusModel(req);
        default:
            return null;
    }
};

module.exports.toUnsupportedResource = function toUnsupportedResource(model) {
    return {
        dsSerialNumber: model.dsSerialNumber,
        dsFirmwareVersion: model.dsFirmwareVersion,
        speakerVendor: model.speakerVendor,
        speakerType: model.speakerType
    };
};

module.exports.toSpaceResource = function toSpaceResource(model) {
    return {
        dsSerialNumber: model.dsSerialNumber,
        dsFirmwareVersion: model.dsFirmwareVersion,
        speakerVendor: model.speakerVendor,
        speakerType: model.speakerType
    };
};

module.exports.toSpacePlusResource = function toSpacePlusResource(model) {
    return {
        dsSerialNumber: model.dsSerialNumber,
        dsFirmwareVersion: model.dsFirmwareVersion,
        exaktDevices: model.exaktDevices
    };
};

module.exports.toUserRequestedResource = function toUserRequestedResource(model) {
    return {
        dsSerialNumber: model.dsSerialNumber,
        dsFirmwareVersion: model.dsFirmwareVersion,
        userSubmission: model.userSubmission
    };
}