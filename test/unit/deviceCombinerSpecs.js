"use strict";
var sut = require('../../deviceCombiner');
/*jshint -W079 */
var expect = require('chai').expect;
var _ = require('underscore');

describe('Device Combiner', function () {
    var cloudProductDescriptor, result, splOnlyTweeterComponent, specificTweeterComponent, tweeterComponent, midComponent, bassComponent;
    beforeEach(function () {
        tweeterComponent = require('./../data/tweeterComponent.json');
        splOnlyTweeterComponent = require('./../data/splOnlyTweeterComponent.json');
        specificTweeterComponent = require('./../data/specificTweeterComponent.json');
        midComponent = require('./../data/midComponent.json');
        bassComponent =  require('./../data/bassComponent.json');
        cloudProductDescriptor = {
            vendor: 'linn',
            productType: 'speaker',
            id: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
            components: [ tweeterComponent, midComponent, bassComponent ]
        };
    });
    describe('When generic measurement older than cloud device last update date', function () {
        beforeEach(function (done) {
            var cloudDevice = {
                productDescriptor: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
                serialNumber: 12345,
                components: [ ],
                lastUpdate: '2014-02-21T18:51:00Z'
            };
            sut.combine(cloudDevice, cloudProductDescriptor, function (err, data) {
                result = data;
                done();
            });
        });
        it('Should not update last update', function () {
            expect(result.lastUpdate).to.eql('2014-02-21T18:51:00Z');
        });
    });
    describe('When generic measurement newer than cloud device last update date', function () {
        beforeEach(function (done) {
            var cloudDevice = {
                productDescriptor: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
                serialNumber: 12345,
                components: [ ],
                lastUpdate: '2014-02-21T18:49:00Z'
            };
            sut.combine(cloudDevice, cloudProductDescriptor, function (err, data) {
                result = data;
                done();
            });
        });
        it('Should update last update', function () {
            expect(result.lastUpdate).to.eql('2014-02-21T18:50:00Z');
        });
    });
    describe('When combining device with partially measured component', function () {
        beforeEach(function (done) {
            var cloudDevice = {
                productDescriptor: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
                serialNumber: 12345,
                components: [ splOnlyTweeterComponent ],
                lastUpdate: '2014-02-21T18:49:00Z'
            };
            sut.combine(cloudDevice, cloudProductDescriptor, function (err, data) {
                result = data;
                done();
            });
        });
        it('Should have a serialNumber', function () {
            expect(result.serialNumber).to.eql(12345);
        });
        it('Should have an array of components', function () {
            expect(result.components).to.be.an('array');
        });
        it('Device should have same components as generic device', function () {
            expect(result.components.length).to.eql(3);
        });
        describe('the result component names', function () {
            var componentNames;
            beforeEach(function () {
                componentNames = _.pluck(result.components, 'componentName');
            });
            it('Should match generic names', function () {
                expect(componentNames).to.have.length(3);
                expect(componentNames).to.contain('bass');
                expect(componentNames).to.contain('mid');
                expect(componentNames).to.contain('tweeter');
            });
        });
        describe('the tweeter component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'tweeter' });
            });
            it('Should have correct spl measurement', function () {
                expect(component.measurements.spl).to.deep.equal(splOnlyTweeterComponent.measurements.spl);
            });
            it('Should have correct impedance measurement', function () {
                expect(component.measurements.impedance).to.deep.equal(tweeterComponent.measurements.impedance);
            });
        });
        describe('the mid component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'mid' });
            });
            it('Should match generic mid', function () {
                expect(component).to.deep.equal(midComponent);
            });
        });
        describe('the bass component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'bass' });
            });
            it('Should match generic tweeter', function () {
                expect(component).to.deep.equal(bassComponent);
            });
        });
    });
    describe('When combining device with missing component', function () {
        beforeEach(function (done) {
            var cloudDevice = {
                productDescriptor: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
                serialNumber: 12345,
                components: [ specificTweeterComponent ]
            };
            sut.combine(cloudDevice, cloudProductDescriptor, function (err, data) {
                result = data;
                done();
            });
        });
        it('Should have a serialNumber', function () {
            expect(result.serialNumber).to.eql(12345);
        });
        it('Should have an array of components', function () {
            expect(result.components).to.be.an('array');
        });
        it('Device should have same components as generic device', function () {
            expect(result.components.length).to.eql(3);
        });
        describe('the result component names', function () {
            var componentNames;
            beforeEach(function () {
                componentNames = _.pluck(result.components, 'componentName');
            });
            it('Should match generic names', function () {
                expect(componentNames).to.have.length(3);
                expect(componentNames).to.contain('bass');
                expect(componentNames).to.contain('mid');
                expect(componentNames).to.contain('tweeter');
            });
        });
        describe('the tweeter component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'tweeter' });
            });
            it('Should match specific tweeter', function () {
                expect(component).to.deep.equal(specificTweeterComponent);
            });
        });
        describe('the mid component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'mid' });
            });
            it('Should match generic mid', function () {
                expect(component).to.deep.equal(midComponent);
            });
        });
        describe('the bass component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'bass' });
            });
            it('Should match generic tweeter', function () {
                expect(component).to.deep.equal(bassComponent);
            });
        });
    });
    describe('When combining empty device and populated cloudProductDescriptor', function () {
        beforeEach(function (done) {
            var cloudDevice = {
                productDescriptor: '0c9fc263-63b9-4e85-ab4f-e4b24db4a154',
                serialNumber: 12345
            };
            sut.combine(cloudDevice, cloudProductDescriptor, function (err, data) {
                result = data;
                done();
            });
        });
        it('Should have a serialNumber', function () {
            expect(result.serialNumber).to.eql(12345);
        });
        it('Should have an array of components', function () {
            expect(result.components).to.be.an('array');
        });
        it('Device should have same components as generic device', function () {
            expect(result.components.length).to.eql(3);
        });
        describe('the result component names', function () {
            var componentNames;
            beforeEach(function () {
                componentNames = _.pluck(result.components, 'componentName');
            });
            it('Should match generic names', function () {
                expect(componentNames).to.have.length(3);
                expect(componentNames).to.contain('bass');
                expect(componentNames).to.contain('mid');
                expect(componentNames).to.contain('tweeter');
            });
        });
        describe('the tweeter component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'tweeter' });
            });
            it('Should match generic tweeter', function () {
                expect(component).to.deep.equal(tweeterComponent);
            });
        });
        describe('the mid component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'mid' });
            });
            it('Should match generic mid', function () {
                expect(component).to.deep.equal(midComponent);
            });
        });
        describe('the bass component', function () {
            var component;
            beforeEach(function () {
                component = _.findWhere(result.components, { componentName : 'bass' });
            });
            it('Should match generic tweeter', function () {
                expect(component).to.deep.equal(bassComponent);
            });
        });
    });
});