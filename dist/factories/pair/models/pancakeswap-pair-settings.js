"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapPairSettings = void 0;
class PancakeswapPairSettings {
    constructor(settings) {
        this.slippage = (settings === null || settings === void 0 ? void 0 : settings.slippage) || 0.005;
        this.deadlineMinutes = (settings === null || settings === void 0 ? void 0 : settings.deadlineMinutes) || 20;
        this.disableMultihops = (settings === null || settings === void 0 ? void 0 : settings.disableMultihops) || false;
    }
}
exports.PancakeswapPairSettings = PancakeswapPairSettings;
