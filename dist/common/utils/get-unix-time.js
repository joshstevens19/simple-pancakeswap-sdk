"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUnixTime = void 0;
/**
 * Get unix timestamp
 * @param date The date
 */
function getUnixTime(date) {
    return (date.getTime() / 1e3) | 0;
}
exports.getUnixTime = getUnixTime;
