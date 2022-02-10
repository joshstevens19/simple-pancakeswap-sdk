"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapError = void 0;
class PancakeswapError extends Error {
    constructor(message, code) {
        super(message);
        this.name = 'PancakeswapError';
        this.message = message;
        this.code = code;
    }
}
exports.PancakeswapError = PancakeswapError;
