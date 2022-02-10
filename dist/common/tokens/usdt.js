"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USDT = void 0;
const chain_id_1 = require("../../enums/chain-id");
/**
 * USDT token context
 */
class USDT {
    /**
     * Get USDT token info
     */
    static token() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0x55d398326f99059ff775485246999027b3197955',
            decimals: 18,
            symbol: 'USDT',
            name: 'Tether USD',
        };
    }
}
exports.USDT = USDT;
