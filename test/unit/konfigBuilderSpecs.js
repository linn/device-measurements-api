"use strict";
var sut = require('../../konfigBuilder');
/*jshint -W079 */
var expect = require('chai').expect;

describe('Konfig Builder', function () {
    var cloudDevice, expectedKonfigDevice;
    beforeEach(function () {
        expectedKonfigDevice = require('../data/konfigDevice.json');
        cloudDevice = require('../data/cloudDevice.json');
    });
    describe('When building', function () {
        var result;
        beforeEach(function () {
            result = sut.build(cloudDevice);
        });
        it('result should be correct', function() {
            expect(result).to.eql(expectedKonfigDevice);
        });
    });
});