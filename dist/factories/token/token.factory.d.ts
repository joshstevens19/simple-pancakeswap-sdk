import { EthersProvider } from '../../ethers-provider';
import { AllowanceAndBalanceOf } from './models/allowance-balance-of';
import { Token } from './models/token';
export declare class TokenFactory {
    private _tokenContractAddress;
    private _ethersProvider;
    private _multicall;
    private _erc20TokenContracy;
    constructor(_tokenContractAddress: string, _ethersProvider: EthersProvider);
    /**
     * Get the token details
     */
    getToken(): Promise<Token>;
    /**
     * Get the allowance for the amount which can be moved from the contract
     * for a user
     * @ethereumAddress The users ethereum address
     */
    allowance(ethereumAddress: string): Promise<string>;
    /**
     * Generate the token approve data allowance to move the tokens.
     * This will return the data for you to send as a transaction
     * @spender The contract address for which you are allowing to move tokens on your behalf
     * @value The amount you want to allow them to do
     */
    generateApproveAllowanceData(spender: string, value: string): string;
    /**
     * Get the balance the user has of this token
     * @ethereumAddress The users ethereum address
     */
    balanceOf(ethereumAddress: string): Promise<string>;
    /**
     * Get the total supply of tokens which exist
     */
    totalSupply(): Promise<string>;
    /**
     * Get allowance and balance
     * @param ethereumAddress
     */
    getAllowanceAndBalanceOf(ethereumAddress: string): Promise<AllowanceAndBalanceOf>;
}
