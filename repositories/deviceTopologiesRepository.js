"use strict";

let config = require('../config');
let Repository = require('repository-dynamodb');
let repository = new Repository(config.devicesTopologyTableName, "dsSerialNumber");

repository.filterBySerialNumber = function loadCloudDeviceTopologiesByProductSerialNumberFromDynamoDb(serialNumber, callback) {
    var params = {
        TableName: config.devicesTopologyTableName,
        KeyConditions : [
            this.docClient.Condition("dsSerialNumber", "EQ", serialNumber)
        ]
    };
    this.docClient.query(params, function(err, results) {
        if (err) {
            callback(err);
        } else {
            callback(null, results.Items);
        }
    });
};

module.exports = repository;