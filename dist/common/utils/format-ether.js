"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatEther = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("ethers/lib/utils");
/**
 * format ether from wei
 * @param wei The value
 */
function formatEther(
// tslint:disable-next-line: no-any
wei) {
    return new bignumber_js_1.default(utils_1.formatEther(new bignumber_js_1.default(wei).toFixed()));
}
exports.formatEther = formatEther;
