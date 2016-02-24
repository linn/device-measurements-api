"use strict";

let config = require('../config');
let Repository = require('repository-dynamodb');
let repository = new Repository(config.awsRegion, config.devicesTableName, 'productDescriptorId', 'serialNumber');

module.exports = repository;