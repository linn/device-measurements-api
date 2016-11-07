"use strict";
const proxyquire = require('proxyquire');
const expressTesting = require('./expressTesting');

const chai = require("chai");
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
/*jshint -W079 */
const expect = chai.expect;
chai.use(sinonChai);

describe('Device Topology Api', function () {
    var sut, loadCallbackArgs, repositoryStub;
    beforeEach(function() {
        loadCallbackArgs = [];
        repositoryStub = {
            filterBySerialNumber: sinon.spy(function filterBySerialNumberStub(id, callback) { callback.apply(null, loadCallbackArgs); }),
            addOrReplace: sinon.spy(function addOrReplaceStub(item, callback) { callback.apply(null); })
        };
        proxyquire.noCallThru();
        sut = proxyquire('../../routes/deviceTopologyApi', {
            '../repositories/deviceTopologiesRepository': repositoryStub
        });
    });
    describe('When posting a user requested configuration', function () {
        var req, res, next, incomingSpaceConfiguration;
        beforeEach(function (done) {
            incomingSpaceConfiguration = require('../data/incomingUserRequestedConfiguration.json');
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.user-requested-configuration+json; version=1',
                {
                    serialNumber: '12345'
                },
                incomingSpaceConfiguration
            );
            res = expressTesting.generateResponseStub(done);
            next = function(error) {
                res.statusCode = error.status;
                done();
            };
            sut.post(req, res, next);
        });
        it('Should add configuration to repository', function () {
            expect(repositoryStub.addOrReplace).to.have.been.calledWith({
                mediaType: 'application/vnd.linn.user-requested-configuration+json; version=1',
                dateStamp: sinon.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
                dsSerialNumber: incomingSpaceConfiguration.dsSerialNumber,
                dsFirmwareVersion: incomingSpaceConfiguration.dsFirmwareVersion,
                userSubmission: incomingSpaceConfiguration.userSubmission
            });
        });
        it('Should return status 201', function () {
            expect(res.statusCode).to.be.eql(201);
        });
    });
    describe('When posting a user requested configuration with empty field', function () {
        var req, res, next, incomingSpaceConfiguration;
        beforeEach(function (done) {
            incomingSpaceConfiguration = require('../data/incomingUserRequestedConfigurationWithEmptyAttribute.json');
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.user-requested-configuration+json; version=1',
                {
                    serialNumber: '12345'
                },
                incomingSpaceConfiguration
            );
            res = expressTesting.generateResponseStub(done);
            next = function(error) {
                res.statusCode = error.status;
                done();
            };
            sut.post(req, res, next);
        });
        it('Should add configuration to repository', function () {
            expect(repositoryStub.addOrReplace).to.have.been.calledWith({
                mediaType: 'application/vnd.linn.user-requested-configuration+json; version=1',
                dateStamp: sinon.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
                dsSerialNumber: incomingSpaceConfiguration.dsSerialNumber,
                dsFirmwareVersion: incomingSpaceConfiguration.dsFirmwareVersion,
                "userSubmission": {
                    "additionalInformation": null,
                    "speakerVendor": "linn",
                    "speakerType": "majik140"
                }
            });
        });
        it('Should return status 201', function () {
            expect(res.statusCode).to.be.eql(201);
        });
    });
    describe('When posting nonsense', function () {
        var req, res, next;
        beforeEach(function (done) {
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.user-requested-configuration+json; version=1',
                {
                    serialNumber: '12345'
                },
                {}
            );
            res = expressTesting.generateResponseStub(done);
            next = function(error) {
                res.statusCode = error.status;
                done();
            };
            sut.post(req, res, next);
        });
        it('Should return status 400', function () {
            expect(res.statusCode).to.be.eql(400);
        });
    });
});