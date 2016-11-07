"use strict";

const moment = require('moment');
const _ = require('underscore');

const spaceContentType = 'application/vnd.linn.space-configuration+json; version=1';
const spacePlusContentType = 'application/vnd.linn.space-plus-configuration+json; version=1';
const unsupportedConfigurationContentType = 'application/vnd.linn.unsupported-configuration+json; version=1';
const userRequestedConfigurationContentType = 'application/vnd.linn.user-requested-configuration+json; version=1';

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

function toModelUserSubmission(userSubmission) {
    return {
        speakerVendor: toModelString(userSubmission.speakerVendor),
        speakerType: toModelString(userSubmission.speakerType),
        additionalInformation: toModelString(userSubmission.additionalInformation)
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
        default:
            return null;
    }
};

module.exports.toUserRequestedResource = function toUserRequestedResource(model) {
    return {
        dsSerialNumber: model.dsSerialNumber,
        dsFirmwareVersion: model.dsFirmwareVersion,
        userSubmission: model.userSubmission
    };
}