"use strict";
const chai = require("chai");
/*jshint -W079 */
const expect = chai.expect;
const assert = chai.assert;

const expressTesting = require('./expressTesting');
const sut = require('../../routes/factories/index');

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
});