"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BNB = void 0;
const chain_id_1 = require("../../enums/chain-id");
/**
 * BNB token context
 */
class BNB {
    /**
     * Get BNB token info
     */
    static token() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
            decimals: 18,
            symbol: 'WBNB',
            name: 'Wrapped Binance token',
        };
    }
}
exports.BNB = BNB;
