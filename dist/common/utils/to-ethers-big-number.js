"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toEthersBigNumber = void 0;
const ethers_1 = require("ethers");
function toEthersBigNumber(value) {
    return ethers_1.BigNumber.from(value.toFixed());
}
exports.toEthersBigNumber = toEthersBigNumber;
