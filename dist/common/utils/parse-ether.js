"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseEther = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const utils_1 = require("ethers/lib/utils");
/**
 * Convert a string value to wei
 * @param value The value
 */
function parseEther(value) {
    return new bignumber_js_1.default(utils_1.parseEther(new bignumber_js_1.default(value).toFixed()).toHexString());
}
exports.parseEther = parseEther;
