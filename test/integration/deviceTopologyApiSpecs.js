"use strict";
var proxyquire = require('proxyquire');
var expressTesting = require('./expressTesting');

var chai = require("chai");
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
/*jshint -W079 */
var expect = chai.expect;
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
    describe('When posting an unsupported configuration', function () {
        var req, res, next, incomingSpaceConfiguration;
        beforeEach(function (done) {
            incomingSpaceConfiguration = require('../data/incomingSpaceConfiguration.json');
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.unsupported-configuration+json; version=1',
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
                mediaType: 'application/vnd.linn.unsupported-configuration+json; version=1',
                dateStamp: sinon.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
                dsSerialNumber: incomingSpaceConfiguration.dsSerialNumber,
                dsFirmwareVersion: incomingSpaceConfiguration.dsFirmwareVersion,
                speakerVendor: incomingSpaceConfiguration.speakerVendor,
                speakerType: incomingSpaceConfiguration.speakerType
            });
        });
        it('Should return status 201', function () {
            expect(res.statusCode).to.be.eql(201);
        });
    });
    describe('When posting a SPACE configuration', function () {
        var req, res, next, incomingSpaceConfiguration;
        beforeEach(function (done) {
            incomingSpaceConfiguration = require('../data/incomingSpaceConfiguration.json');
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.space-configuration+json; version=1',
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
                mediaType: 'application/vnd.linn.space-configuration+json; version=1',
                dateStamp: sinon.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
                dsSerialNumber: incomingSpaceConfiguration.dsSerialNumber,
                dsFirmwareVersion: incomingSpaceConfiguration.dsFirmwareVersion,
                speakerVendor: incomingSpaceConfiguration.speakerVendor,
                speakerType: incomingSpaceConfiguration.speakerType
            });
        });
        it('Should return status 201', function () {
            expect(res.statusCode).to.be.eql(201);
        });
    });
    describe('When posting a SPACE+ configuration', function () {
        var req, res, next, incomingConfiguration;
        beforeEach(function (done) {
            incomingConfiguration = require('../data/incomingSpacePlusConfiguration.json');
            loadCallbackArgs[1] = [];
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.space-plus-configuration+json; version=1',
                {
                    serialNumber: '12345'
                },
                incomingConfiguration
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
                mediaType: 'application/vnd.linn.space-plus-configuration+json; version=1',
                dateStamp: sinon.match(/^([\+-]?\d{4}(?!\d{2}\b))((-?)((0[1-9]|1[0-2])(\3([12]\d|0[1-9]|3[01]))?|W([0-4]\d|5[0-2])(-?[1-7])?|(00[1-9]|0[1-9]\d|[12]\d{2}|3([0-5]\d|6[1-6])))([T\s]((([01]\d|2[0-3])((:?)[0-5]\d)?|24\:?00)([\.,]\d+(?!:))?)?(\17[0-5]\d([\.,]\d+)?)?([zZ]|([\+-])([01]\d|2[0-3]):?([0-5]\d)?)?)?)?$/),
                dsSerialNumber: incomingConfiguration.dsSerialNumber,
                dsFirmwareVersion: incomingConfiguration.dsFirmwareVersion,
                exaktDevices: incomingConfiguration.exaktDevices
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
                'application/vnd.linn.space-plus-configuration+json; version=1',
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
    describe('When getting unsupported media type', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.banana+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.banana+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 406', function () {
                expect(res.statusCode).to.be.eql(406);
            });
        });
    });
    describe('When getting as JSON', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/json',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple user requested configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleUserRequestedTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/json',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return user requested json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    userSubmission: existingTopologies[1].userSubmission
                });
            });
            it('Should set user requested Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.user-requested-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE+ configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/json',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return SPACE+ json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    exaktDevices: existingTopologies[1].exaktDevices
                });
            });
            it('Should set SPACE+ Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.space-plus-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpaceTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/json',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return SPACE json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    speakerVendor: existingTopologies[1].speakerVendor,
                    speakerType: existingTopologies[1].speakerType
                });
            });
            it('Should set SPACE Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.space-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple unsupported configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleUnsupportedTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/json',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return unsupported configuration json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    speakerVendor: existingTopologies[1].speakerVendor,
                    speakerType: existingTopologies[1].speakerType
                });
            });
            it('Should set unsupported Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.unsupported-configuration+json; version=1');
            });
        });
    });
    describe('When getting as SPACE+', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-plus-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple SPACE+ configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-plus-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return SPACE+ json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    exaktDevices: existingTopologies[1].exaktDevices
                });
            });
            it('Should set SPACE+ Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.space-plus-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpaceTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-plus-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 406', function () {
                expect(res.statusCode).to.be.eql(406);
            });
        });
    });
    describe('When getting as SPACE', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-configuration+json; version=4',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple SPACE configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpaceTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return SPACE json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    speakerVendor: existingTopologies[1].speakerVendor,
                    speakerType: existingTopologies[1].speakerType
                });
            });
            it('Should set SPACE Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.space-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE+ configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.space-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 406', function () {
                expect(res.statusCode).to.be.eql(406);
            });
        });
    });
    describe('When getting as Unsupported Configuration', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.unsupported-configuration+json; version=4',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple unsupported configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleUnsupportedTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.unsupported-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return unsupported configuration json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    speakerVendor: existingTopologies[1].speakerVendor,
                    speakerType: existingTopologies[1].speakerType
                });
            });
            it('Should set unsupported configuration Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.unsupported-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE+ configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.unsupported-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 406', function () {
                expect(res.statusCode).to.be.eql(406);
            });
        });
    });
    describe('When getting as User Requested Configuration', function () {
        describe('For device not seen before', function () {
            var req, res, next;
            beforeEach(function (done) {
                loadCallbackArgs[1] = [];
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.user-requested-configuration+json; version=4',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 404', function () {
                expect(res.statusCode).to.be.eql(404);
            });
        });
        describe('For existing device with multiple user requested configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleUserRequestedTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.user-requested-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 200', function () {
                expect(res.statusCode).to.be.eql(200);
            });
            it('Should return User Requested json', function () {
                expect(res.json).to.have.been.called;
                expect(res.json.args[0][0]).to.be.eql({
                    dsSerialNumber: existingTopologies[1].dsSerialNumber,
                    dsFirmwareVersion: existingTopologies[1].dsFirmwareVersion,
                    userSubmission: existingTopologies[1].userSubmission
                });
            });
            it('Should set user requested configuration Content-Type', function () {
                expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.user-requested-configuration+json; version=1');
            });
        });
        describe('For existing device with multiple SPACE+ configurations', function () {
            var req, res, next, existingTopologies;
            beforeEach(function (done) {
                existingTopologies = require('../data/multipleSpacePlusTopologies.json');
                loadCallbackArgs[1] = existingTopologies;
                req = expressTesting.generateRequestStub(
                    'application/vnd.linn.user-requested-configuration+json; version=1',
                    {
                        serialNumber: '123456'
                    }
                );
                res = expressTesting.generateResponseStub(done);
                next = function(error) {
                    res.statusCode = error.status;
                    done();
                };
                sut.get(req, res, next);
            });
            it('Should return status 406', function () {
                expect(res.statusCode).to.be.eql(406);
            });
        });
    });
});