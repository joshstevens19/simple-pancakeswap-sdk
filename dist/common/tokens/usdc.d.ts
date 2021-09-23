import { ChainId } from '../../enums/chain-id';
/**
 * USDC token context
 */
export declare class USDC {
    /**
     * Get USDC token info
     */
    static token(): {
        chainId: ChainId;
        contractAddress: string;
        decimals: number;
        symbol: string;
        name: string;
    };
}
