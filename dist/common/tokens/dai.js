"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DAI = void 0;
const chain_id_1 = require("../../enums/chain-id");
/**
 * DAI token context
 */
class DAI {
    static MAINNET() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0x26a5dfab467d4f58fb266648cae769503cec9580',
            decimals: 18,
            symbol: 'DAI',
            name: 'Dai Stablecoin',
        };
    }
    /**
     * Get DAI token info
     */
    static token() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0x26a5dfab467d4f58fb266648cae769503cec9580',
            decimals: 18,
            symbol: 'DAI',
            name: 'Dai Stablecoin',
        };
    }
}
exports.DAI = DAI;
