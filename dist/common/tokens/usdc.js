"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.USDC = void 0;
const chain_id_1 = require("../../enums/chain-id");
/**
 * USDC token context
 */
class USDC {
    /**
     * Get USDC token info
     */
    static token() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
            decimals: 18,
            symbol: 'USDC',
            name: 'USD Coin',
        };
    }
}
exports.USDC = USDC;
