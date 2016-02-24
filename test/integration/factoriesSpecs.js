"use strict";
var chai = require("chai");
/*jshint -W079 */
var expect = chai.expect;
var assert = chai.assert;

var expressTesting = require('./expressTesting');
var sut = require('../../routes/factories/index');

describe('Factories', function () {
    describe('When unknown Content-Type used in request', function () {
        var model;
        beforeEach(function () {
            var req = expressTesting.generateRequestStub('application/vnd.linn.exakt-configuration+json; version=1', {
                serialNumber: '12345'
            }, { dsSerialNumber: '12345' });
            model = sut.createModel(req);
        });
        it('Should return a null model', function () {
            expect(model).to.be.null;
        });
    });
    describe('When creating User Request model from request', function () {
        describe('With valid data', function () {
            var model, incomingConfiguration, beforeRequestTime;
            beforeEach(function () {
                beforeRequestTime = new Date().toISOString();
                incomingConfiguration = require('../data/incomingUserRequestedConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.user-requested-configuration+json; version=1', {
                    serialNumber: '12345'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should set mediaType', function () {
                expect(model.mediaType).to.be.eql('application/vnd.linn.user-requested-configuration+json; version=1');
            });
            it('Should set date', function () {
                var afterRequestTime = new Date().toISOString();
                assert(model.dateStamp >= beforeRequestTime && model.dateStamp <= afterRequestTime, 'should be within start and end time');
            });
            it('Should set dsSerialNumber', function () {
                expect(model.dsSerialNumber).to.be.eql(incomingConfiguration.dsSerialNumber);
            });
            it('Should set dsFirmwareVersion', function () {
                expect(model.dsFirmwareVersion).to.be.eql(incomingConfiguration.dsFirmwareVersion);
            });
            it('Should set userSubmission', function () {
                expect(model.userSubmission).to.be.eql(incomingConfiguration.userSubmission);
            });
        });
        describe('With mismatched serial numbers', function () {
            var model;
            beforeEach(function () {
                var incomingConfiguration = require('../data/incomingUserRequestedConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.user-requested-configuration+json; version=1', {
                    serialNumber: '12347'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should return a null model', function () {
                expect(model).to.be.null;
            });
        });
    });
    describe('When creating Unsupported model from request', function () {
        describe('With valid data', function () {
            var model, incomingConfiguration, beforeRequestTime;
            beforeEach(function () {
                beforeRequestTime = new Date().toISOString();
                incomingConfiguration = require('../data/incomingSpaceConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.unsupported-configuration+json; version=1', {
                    serialNumber: '12345'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should set mediaType', function () {
                expect(model.mediaType).to.be.eql('application/vnd.linn.unsupported-configuration+json; version=1');
            });
            it('Should set date', function () {
                var afterRequestTime = new Date().toISOString();
                assert(model.dateStamp >= beforeRequestTime && model.dateStamp <= afterRequestTime, 'should be within start and end time');
            });
            it('Should set dsSerialNumber', function () {
                expect(model.dsSerialNumber).to.be.eql(incomingConfiguration.dsSerialNumber);
            });
            it('Should set dsFirmwareVersion', function () {
                expect(model.dsFirmwareVersion).to.be.eql(incomingConfiguration.dsFirmwareVersion);
            });
            it('Should set speakerVendor', function () {
                expect(model.speakerVendor).to.be.eql(incomingConfiguration.speakerVendor);
            });
            it('Should set speakerType', function () {
                expect(model.speakerType).to.be.eql(incomingConfiguration.speakerType);
            });
        });
        describe('With mismatched serial numbers', function () {
            var model;
            beforeEach(function () {
                var incomingConfiguration = require('../data/incomingSpaceConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-configuration+json; version=1', {
                    serialNumber: '12347'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should return a null model', function () {
                expect(model).to.be.null;
            });
        });
    });
    describe('When creating SPACE model from request', function () {
        describe('With valid data', function () {
            var model, incomingConfiguration, beforeRequestTime;
            beforeEach(function () {
                beforeRequestTime = new Date().toISOString();
                incomingConfiguration = require('../data/incomingSpaceConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-configuration+json; version=1', {
                    serialNumber: '12345'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should set mediaType', function () {
                expect(model.mediaType).to.be.eql('application/vnd.linn.space-configuration+json; version=1');
            });
            it('Should set date', function () {
                var afterRequestTime = new Date().toISOString();
                assert(model.dateStamp >= beforeRequestTime && model.dateStamp <= afterRequestTime, 'should be within start and end time');
            });
            it('Should set dsSerialNumber', function () {
                expect(model.dsSerialNumber).to.be.eql(incomingConfiguration.dsSerialNumber);
            });
            it('Should set dsFirmwareVersion', function () {
                expect(model.dsFirmwareVersion).to.be.eql(incomingConfiguration.dsFirmwareVersion);
            });
            it('Should set speakerVendor', function () {
                expect(model.speakerVendor).to.be.eql(incomingConfiguration.speakerVendor);
            });
            it('Should set speakerType', function () {
                expect(model.speakerType).to.be.eql(incomingConfiguration.speakerType);
            });
        });
        describe('With mismatched serial numbers', function () {
            var model;
            beforeEach(function () {
                var incomingConfiguration = require('../data/incomingSpaceConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-configuration+json; version=1', {
                    serialNumber: '12347'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should return a null model', function () {
                expect(model).to.be.null;
            });
        });
    });
    describe('When creating SPACE+ model from request', function () {
        describe('With valid data', function () {
            var model, incomingConfiguration, beforeRequestTime;
            beforeEach(function () {
                beforeRequestTime = new Date().toISOString();
                incomingConfiguration = require('../data/incomingSpacePlusConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-plus-configuration+json; version=1', {
                    serialNumber: '12345'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should set mediaType', function () {
                expect(model.mediaType).to.be.eql('application/vnd.linn.space-plus-configuration+json; version=1');
            });
            it('Should set date', function () {
                var afterRequestTime = new Date().toISOString();
                assert(model.dateStamp >= beforeRequestTime && model.dateStamp <= afterRequestTime, 'should be within start and end time');
            });
            it('Should set dsSerialNumber', function () {
                expect(model.dsSerialNumber).to.be.eql(incomingConfiguration.dsSerialNumber);
            });
            it('Should set dsFirmwareVersion', function () {
                expect(model.dsFirmwareVersion).to.be.eql(incomingConfiguration.dsFirmwareVersion);
            });
            it('Should set exaktDevices', function () {
                expect(model.exaktDevices).to.be.eql(incomingConfiguration.exaktDevices);
            });
        });
        describe('With mismatched serial numbers', function () {
            var model;
            beforeEach(function () {
                var incomingConfiguration = require('../data/incomingSpacePlusConfiguration.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-plus-configuration+json; version=1', {
                    serialNumber: '12347'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should return a null model', function () {
                expect(model).to.be.null;
            });
        });
        describe('With a missing exakt box serial number', function () {
            var model, incomingConfiguration, beforeRequestTime;
            beforeEach(function () {
                beforeRequestTime = new Date().toISOString();
                incomingConfiguration = require('../data/incomingSpacePlusConfigurationMissingExaktBoxSerial.json');
                var req = expressTesting.generateRequestStub('application/vnd.linn.space-plus-configuration+json; version=1', {
                    serialNumber: '12345'
                }, incomingConfiguration);
                model = sut.createModel(req);
            });
            it('Should set date', function () {
                var afterRequestTime = new Date().toISOString();
                assert(model.dateStamp >= beforeRequestTime && model.dateStamp <= afterRequestTime, 'should be within start and end time');
            });
            it('Should set dsSerialNumber', function () {
                expect(model.dsSerialNumber).to.be.eql(incomingConfiguration.dsSerialNumber);
            });
            it('Should set dsFirmwareVersion', function () {
                expect(model.dsFirmwareVersion).to.be.eql(incomingConfiguration.dsFirmwareVersion);
            });
            it('Should set exaktDevices as empty array', function () {
                expect(model.exaktDevices).to.be.eql([]);
            });
        });
    });
});