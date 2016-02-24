"use strict";
var sut = require('../../konfigXmlBuilder');
/*jshint -W079 */
var expect = require('chai').expect;

describe('Konfig Xml Builder', function () {
    var konfigDevice, expectedXml;
    beforeEach(function () {
        expectedXml =  '<?xml version="1.0"?>\n<Device xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema">\n  <SerialNumber>123456</SerialNumber>\n  <Components>\n    <Component>\n      <ComponentName>tweeter</ComponentName>\n      <Measurements>\n        <Measurement xsi:type="value">\n          <Name>spl</Name>\n          <MeasuredOn>2014-02-21T17:49:00Z</MeasuredOn>\n          <SourceName>ptest</SourceName>\n          <SourceVersion>1.0</SourceVersion>\n          <Value>1</Value>\n          <Metadata>\n            <Metadatum>\n              <Key>fStart</Key>\n              <Value>10070.8</Value>\n            </Metadatum>\n            <Metadatum>\n              <Key>fStop</Key>\n              <Value>21514.9</Value>\n            </Metadatum>\n          </Metadata>\n        </Measurement>\n        <Measurement xsi:type="file">\n          <Name>impedance</Name>\n          <MeasuredOn>2014-02-21T17:50:00Z</MeasuredOn>\n          <SourceName>ptest</SourceName>\n          <SourceVersion>1.0</SourceVersion>\n          <FileType>tdms</FileType>\n          <Files>\n            <Link Href="/device-measurements/files/generic-tweeter-impedance.tdms" Rel="test.tdms"/>\n          </Files>\n        </Measurement>\n      </Measurements>\n    </Component>\n  </Components>\n  <LastUpdate>2014-02-21T17:50:00Z</LastUpdate>\n</Device>';
        konfigDevice = require('../data/konfigDevice.json');
    });
    describe('When building', function () {
        var result;
        beforeEach(function () {
            result = sut.build(konfigDevice);
        });
        it('xml should be correct', function() {
            expect(result).to.eql(expectedXml);
        });
    });
});