"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorCodes = void 0;
var ErrorCodes;
(function (ErrorCodes) {
    ErrorCodes[ErrorCodes["noRoutesFound"] = 1] = "noRoutesFound";
    ErrorCodes[ErrorCodes["canNotFindChainId"] = 2] = "canNotFindChainId";
    ErrorCodes[ErrorCodes["tokenChainIdContractDoesNotExist"] = 3] = "tokenChainIdContractDoesNotExist";
    ErrorCodes[ErrorCodes["tradePathIsNotSupported"] = 4] = "tradePathIsNotSupported";
    ErrorCodes[ErrorCodes["generateApproveMaxAllowanceDataNotAllowed"] = 5] = "generateApproveMaxAllowanceDataNotAllowed";
    ErrorCodes[ErrorCodes["fromTokenContractAddressRequired"] = 6] = "fromTokenContractAddressRequired";
    ErrorCodes[ErrorCodes["fromTokenContractAddressNotValid"] = 7] = "fromTokenContractAddressNotValid";
    ErrorCodes[ErrorCodes["toTokenContractAddressRequired"] = 8] = "toTokenContractAddressRequired";
    ErrorCodes[ErrorCodes["toTokenContractAddressNotValid"] = 9] = "toTokenContractAddressNotValid";
    ErrorCodes[ErrorCodes["ethereumAddressRequired"] = 10] = "ethereumAddressRequired";
    ErrorCodes[ErrorCodes["ethereumAddressNotValid"] = 11] = "ethereumAddressNotValid";
    ErrorCodes[ErrorCodes["invalidFromOrToContractToken"] = 13] = "invalidFromOrToContractToken";
})(ErrorCodes = exports.ErrorCodes || (exports.ErrorCodes = {}));
