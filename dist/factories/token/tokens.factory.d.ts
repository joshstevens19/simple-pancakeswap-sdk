import { EthersProvider } from '../../ethers-provider';
import { Token } from './models/token';
export declare class TokensFactory {
    private _ethersProvider;
    private _multicall;
    constructor(_ethersProvider: EthersProvider);
    /**
     * Get the tokens details
     */
    getTokens(tokenContractAddresses: string[]): Promise<Token[]>;
}
