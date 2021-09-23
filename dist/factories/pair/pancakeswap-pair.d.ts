import { PancakeswapPairContext } from './models/pancakeswap-pair-contexts';
import { PancakeswapPairFactory } from './pancakeswap-pair.factory';
export declare class PancakeswapPair {
    private _pancakeswapPairContext;
    private _ethersProvider;
    constructor(_pancakeswapPairContext: PancakeswapPairContext);
    /**
     * Create factory to be able to call methods on the 2 tokens
     */
    createFactory(): Promise<PancakeswapPairFactory>;
}
