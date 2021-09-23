"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUnixTime = void 0;
const get_unix_time_1 = require("./get-unix-time");
/**
 * Get the current unit time
 */
function getCurrentUnixTime() {
    return get_unix_time_1.getUnixTime(new Date());
}
exports.getCurrentUnixTime = getCurrentUnixTime;
