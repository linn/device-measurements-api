"use strict";

module.exports = function productDescriptorMatcher(serialNumber) {
    var parsedSerialNumber = parseInt(serialNumber, 10);
    return function serialNumberInRange(productDescriptor) {
        return ((!productDescriptor.firstSerialNumber || parsedSerialNumber >= productDescriptor.firstSerialNumber) &&
                (!productDescriptor.lastSerialNumber || parsedSerialNumber <= productDescriptor.lastSerialNumber));
    };
};