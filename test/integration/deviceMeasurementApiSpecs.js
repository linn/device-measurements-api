"use strict";
var proxyquire = require('proxyquire');
var expressTesting = require('./expressTesting');

var chai = require("chai");
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
/*jshint -W079 */
var expect = chai.expect;
chai.use(sinonChai);

describe('Device Measurements Api', function () {
    var sut, cloudDeviceFactory, loadDeviceCallbackArgs, loadProductDescriptorCallbackArgs, saveProductDescriptorCallbackArgs, deviceRepositoryStub;
    beforeEach(function () {
        loadDeviceCallbackArgs = [];
        deviceRepositoryStub = {
            findBy: function loadCloudDeviceFromStub(productDescriptorId, serialNumber, callback) { callback.apply(null, loadDeviceCallbackArgs); }
        };

        loadProductDescriptorCallbackArgs = [];
        var productDescriptorRepositoryStub = {
            filterBy: function loadCloudProductDescriptorFromStub(vendor, productType, callback) { callback.apply(null, loadProductDescriptorCallbackArgs); }
        };

        proxyquire.noCallThru();

        cloudDeviceFactory = proxyquire('../../cloudDeviceFactory', {
            './repositories/cloudDeviceRepository': deviceRepositoryStub,
            './repositories/cloudProductDescriptorRepository': productDescriptorRepositoryStub
        });

        sut = proxyquire('../../routes/deviceMeasurementsApi', {
            '../cloudDeviceFactory': cloudDeviceFactory
        });
    });
    describe('When requesting device measurements with serial padded with leading zeroes', function () {
        var next, res, req;
        beforeEach(function (done) {
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.device-measurements+xml; version=4',
                {
                    vendor: 'linn',
                    productType: 'speaker',
                    serialNumber: '001234'
                }
            );
            res = expressTesting.generateResponseStub(done);

            next = function(error) {
                res.statusCode = error.status;
                done();
            };

            sinon.spy(cloudDeviceFactory, 'create');

            loadProductDescriptorCallbackArgs[1] = [ { id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c'} ];
            loadDeviceCallbackArgs[1] = { serialNumber: '1234', lastUpdate: '2015-02-18T04:57:56Z' };

            sut.get(req, res, next);
        });
        it('Should return ok', function () {
            expect(res.statusCode).to.eql(200);
        });
        it('Should call device factory with unpadded serial number', function () {
            expect(cloudDeviceFactory.create).to.have.been.calledWith('linn', 'speaker', '1234');
        });
        it('Should return xml', function () {
            expect(res.send).to.have.been.called;
            expect(res.send.args[0][0]).to.be.eql("<?xml version=\"1.0\"?>\n<Device xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <SerialNumber>1234</SerialNumber>\n  <Components/>\n  <LastUpdate>2015-02-18T04:57:56Z</LastUpdate>\n</Device>");
        });
    });
    describe('When requesting device measurements with alphanumeric serial as XML', function () {
        var next, res, req;
        beforeEach(function (done) {
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.device-measurements+xml; version=4',
                {
                    vendor: 'linn',
                    productType: 'speaker',
                    serialNumber: 'ABCDEFG'
                }
            );
            res = expressTesting.generateResponseStub(done);

            next = function(error) {
                res.statusCode = error.status;
                done();
            };

            sinon.spy(cloudDeviceFactory, 'create');

            loadProductDescriptorCallbackArgs[1] = [ { id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c'} ];
            loadDeviceCallbackArgs[1] = { serialNumber: 'ABCDEFG', lastUpdate: '2015-02-18T04:57:56Z' };

            sut.get(req, res, next);
        });
        it('Should return ok', function () {
            expect(res.statusCode).to.eql(200);
        });
        it('Should call device factory with unpadded serial number', function () {
            expect(cloudDeviceFactory.create).to.have.been.calledWith('linn', 'speaker', 'ABCDEFG');
        });
        it('Should return xml', function () {
            expect(res.send).to.have.been.called;
            expect(res.send.args[0][0]).to.be.eql("<?xml version=\"1.0\"?>\n<Device xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <SerialNumber>ABCDEFG</SerialNumber>\n  <Components/>\n  <LastUpdate>2015-02-18T04:57:56Z</LastUpdate>\n</Device>");
        });
    });
    describe('When requesting device measurements as XML', function () {
        var next, res, req;
        beforeEach(function (done) {
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.device-measurements+xml; version=4',
                {
                    vendor: 'linn',
                    productType: 'speaker',
                    serialNumber: '123456'
                }
            );
            res = expressTesting.generateResponseStub(done);

            next = function(error) {
                res.statusCode = error.status;
                done();
            };

            loadProductDescriptorCallbackArgs[1] = [ { id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c'} ];
            loadDeviceCallbackArgs[1] = { serialNumber: '123456', lastUpdate: '2015-02-18T04:57:56Z' };

            sut.get(req, res, next);
        });
        it('Should return ok', function () {
            expect(res.statusCode).to.eql(200);
        });
        it('Should return xml', function () {
            expect(res.send).to.have.been.called;
            expect(res.send.args[0][0]).to.be.eql("<?xml version=\"1.0\"?>\n<Device xmlns:xsi=\"http://www.w3.org/2001/XMLSchema-instance\" xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">\n  <SerialNumber>123456</SerialNumber>\n  <Components/>\n  <LastUpdate>2015-02-18T04:57:56Z</LastUpdate>\n</Device>");
        });
        it('Should set Content-Type', function () {
            expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.device-measurements+xml; version=4');
        });
    });
    describe('When requesting device measurements with unsupported media type', function () {
        var next, res, req;
        beforeEach(function (done) {
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.device-measurements+json; version=1',
                {
                    vendor: 'linn',
                    productType: 'speaker',
                    serialNumber: '123456'
                }
            );
            res = expressTesting.generateResponseStub(done);

            next = function(error) {
                res.statusCode = error.status;
                done();
            };

            loadProductDescriptorCallbackArgs[1] = [ { id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c'} ];
            loadDeviceCallbackArgs[1] = { serialNumber: '123456', lastUpdate: '2015-02-18T04:57:56Z' };

            sut.get(req, res, next);
        });
        it('Should return ok', function () {
            expect(res.statusCode).to.eql(406);
        });
        it('Should not return json', function () {
            expect(res.json).not.to.have.been.called;
        });
    });
    describe('When requesting device measurements as JSON', function () {
        var next, res, req;
        beforeEach(function (done) {
            req = expressTesting.generateRequestStub(
                'application/vnd.linn.device-measurements+json; version=4',
                {
                    vendor: 'linn',
                    productType: 'speaker',
                    serialNumber: '123456'
                }
            );
            res = expressTesting.generateResponseStub(done);

            next = function(error) {
                res.statusCode = error.status;
                done();
            };

            loadProductDescriptorCallbackArgs[1] = [ { id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c'} ];
            loadDeviceCallbackArgs[1] = { serialNumber: '123456', lastUpdate: '2015-02-18T04:57:56Z' };

            sut.get(req, res, next);
        });
        it('Should return ok', function () {
            expect(res.statusCode).to.eql(200);
        });
        it('Should return json', function () {
            expect(res.json).to.have.been.called;
            expect(res.json.args[0][0]).to.be.eql({
                "components": [],
                "lastUpdate": "2015-02-18T04:57:56Z",
                "serialNumber": "123456"
            });
        });
        it('Should set Content-Type', function () {
            expect(res.set).to.have.been.calledWith('Content-Type', 'application/vnd.linn.device-measurements+json; version=4');
        });
    });
});