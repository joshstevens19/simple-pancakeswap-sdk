import { ChainId } from '../../enums/chain-id';
/**
 * COMP token context
 */
export declare class COMP {
    /**
     * Get COMP token info
     */
    static token(): {
        chainId: ChainId;
        contractAddress: string;
        decimals: number;
        symbol: string;
        name: string;
    };
}
