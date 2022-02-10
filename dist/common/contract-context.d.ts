import { JsonFragment } from '@ethersproject/abi';
export declare class ContractContext {
    /**
     * The pancakeswap router address
     */
    static routerAddress: string;
    /**
     * The pancakeswap factory address
     */
    static factoryAddress: string;
    /**
     * The pancakeswap pair address
     */
    static pairAddress: string;
    /**
     * PancakeSwap v2 router
     */
    static routerAbi: JsonFragment[];
    /**
     * PancakeSwap v2 factory
     */
    static factoryAbi: JsonFragment[];
    /**
     * PancakeSwap v2 pair
     */
    static pairAbi: JsonFragment[];
    /**
     * ERC20 abi
     */
    static erc20Abi: JsonFragment[];
}
