import { BigNumberish } from 'ethers';
import { EthersProvider } from '../../ethers-provider';
export declare class PancakeswapPairContractFactory {
    private _ethersProvider;
    private _pancakeswapPairFactory;
    constructor(_ethersProvider: EthersProvider);
    allPairs(parameter0: BigNumberish): Promise<string>;
    allPairsLength(): Promise<string>;
    createPair(tokenA: string, tokenB: string): string;
    feeTo(): Promise<string>;
    feeToSetter(): Promise<string>;
    getPair(parameter0: string, parameter1: string): Promise<string>;
    setFeeTo(_feeTo: string): Promise<string>;
    setFeeToSetter(_feeToSetter: string): Promise<string>;
}
