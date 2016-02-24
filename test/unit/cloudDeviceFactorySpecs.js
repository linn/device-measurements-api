"use strict";
var proxyquire = require('proxyquire');

var chai = require("chai");
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
/*jshint -W079 */
var expect = chai.expect;
chai.use(sinonChai);

describe('Cloud Device Factory', function () {
    var sut, loadDeviceCallbackArgs, saveDeviceCallbackArgs, loadProductDescriptorCallbackArgs, saveProductDescriptorCallbackArgs, deviceRepositoryStub;
    beforeEach(function () {
        loadDeviceCallbackArgs = [];
        saveDeviceCallbackArgs = [];

        deviceRepositoryStub = {
            findBy: function loadCloudDeviceFromStub(productDescriptorId, serialNumber, callback) { callback.apply(null, loadDeviceCallbackArgs); }
        };

        loadProductDescriptorCallbackArgs = [];
        saveProductDescriptorCallbackArgs = [];

        var productDescriptorRepositoryStub = {
            filterBy: function loadCloudProductDescriptorFromStub(vendor, productType, callback) { callback.apply(null, loadProductDescriptorCallbackArgs); }
        };

        sut = proxyquire('../../cloudDeviceFactory', {
            './repositories/cloudDeviceRepository': deviceRepositoryStub,
            './repositories/cloudProductDescriptorRepository': productDescriptorRepositoryStub
        });
    });
    describe('When requesting device measurements and device not found', function () {
        var result, tweeterComponent;
        beforeEach(function (done) {
            tweeterComponent = require('./../data/tweeterComponent.json');

            loadProductDescriptorCallbackArgs[1] = [{
                id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c',
                components: [ tweeterComponent ]
            }];

            sut.create('linn', 'speaker', '123456', function (err, data) {
                result = data;
                done();
            });
        });
        it('Should return a device the same as the product descriptor, but with correct serial number', function () {
            expect(result).to.be.eql({
                serialNumber: '123456',
                lastUpdate: '2014-02-21T17:50:00Z',
                components: [tweeterComponent]
            });
        });
    });
    describe('When requesting device measurements and multiple product descriptors found', function () {
        var result;
        beforeEach(function (done) {
            loadProductDescriptorCallbackArgs[1] = [{
                id: '1cfdb6aa-dc7f-4e1e-a983-7ed19659866c',
                lastSerialNumber: 123400
            }, {
                id: '2cfdb6aa-dc7f-4e1e-a983-7ed19659866c',
                firstSerialNumber: 123401
            }];

            loadDeviceCallbackArgs[1] = { serialNumber: '123456', lastUpdate: '2015-02-18T04:57:56Z' };

            sinon.spy(deviceRepositoryStub, 'findBy');

            sut.create('linn', 'speaker', '123456', function (err, data) {
                result = data;
                done();
            });
        });
        it('Should use correct product descriptor to find device', function () {
            expect(deviceRepositoryStub.findBy).to.have.been.calledWith('2cfdb6aa-dc7f-4e1e-a983-7ed19659866c', '123456');
        });
    });
    describe('When requesting device measurements and product descriptor not found', function () {
        var err;
        beforeEach(function (done) {
            loadProductDescriptorCallbackArgs[1] = [];

            sut.create('linn', 'speaker', '123456', function (error) {
                err = error;
                done();
            });
        });
        it('Should return error object', function () {
            expect(err).to.have.property('message').eql('Failed to find Product Descriptor');
        });
        it('Error object should have a status code', function () {
            expect(err).to.have.property('status').eql(404);
        });
    });
});