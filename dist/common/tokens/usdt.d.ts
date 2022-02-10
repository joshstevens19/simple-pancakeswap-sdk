import { ChainId } from '../../enums/chain-id';
/**
 * USDT token context
 */
export declare class USDT {
    /**
     * Get USDT token info
     */
    static token(): {
        chainId: ChainId;
        contractAddress: string;
        decimals: number;
        symbol: string;
        name: string;
    };
}
