"use strict";
var productDescriptorMatcher = require('../../productDescriptorMatcher');
/*jshint -W079 */
var expect = require('chai').expect;

describe('Product Descriptor Matcher', function () {
    var sut, result;
    beforeEach(function () {
        sut = productDescriptorMatcher("00000500");
    });
    describe('When serial number range not used', function () {
        beforeEach(function () {
            var productDescriptor = {
            };
            result = sut(productDescriptor);
        });
        it('should match', function () {
            expect(result).to.be.true;
        });
    });
    describe('When serial number before start of unbounded range', function () {
        beforeEach(function () {
            var productDescriptor = {
                firstSerialNumber: 501
            };
            result = sut(productDescriptor);
        });
        it('should not match', function () {
            expect(result).to.be.false;
        });
    });
    describe('When serial number at start of unbounded range', function () {
        beforeEach(function () {
            var productDescriptor = {
                firstSerialNumber: 500
            };
            result = sut(productDescriptor);
        });
        it('should match', function () {
            expect(result).to.be.true;
        });
    });
    describe('When serial number at end of unbounded range', function () {
        beforeEach(function () {
            var productDescriptor = {
                lastSerialNumber: 500
            };
            result = sut(productDescriptor);
        });
        it('should match', function () {
            expect(result).to.be.true;
        });
    });
    describe('When serial number after unbounded range', function () {
        beforeEach(function () {
            var productDescriptor = {
                lastSerialNumber: 499
            };
            result = sut(productDescriptor);
        });
        it('should not match', function () {
            expect(result).to.be.false;
        });
    });
    describe('When serial number within bounded range', function () {
        beforeEach(function () {
            var productDescriptor = {
                firstSerialNumber: 499,
                lastSerialNumber: 501
            };
            result = sut(productDescriptor);
        });
        it('should match', function () {
            expect(result).to.be.true;
        });
    });
});