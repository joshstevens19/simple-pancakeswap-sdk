"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COMP = void 0;
const chain_id_1 = require("../../enums/chain-id");
/**
 * COMP token context
 */
class COMP {
    /**
     * Get COMP token info
     */
    static token() {
        return {
            chainId: chain_id_1.ChainId.BSC,
            contractAddress: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
            decimals: 18,
            symbol: 'COMP',
            name: 'Compound',
        };
    }
}
exports.COMP = COMP;
