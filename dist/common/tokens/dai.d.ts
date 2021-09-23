import { ChainId } from '../../enums/chain-id';
/**
 * DAI token context
 */
export declare class DAI {
    static MAINNET(): {
        chainId: ChainId;
        contractAddress: string;
        decimals: number;
        symbol: string;
        name: string;
    };
    /**
     * Get DAI token info
     */
    static token(): {
        chainId: ChainId;
        contractAddress: string;
        decimals: number;
        symbol: string;
        name: string;
    };
}
