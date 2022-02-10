import { BestRouteQuotes } from '../router/models/best-route-quotes';
import { RouteQuote } from '../router/models/route-quote';
import { AllowanceAndBalanceOf } from '../token/models/allowance-balance-of';
import { Token } from '../token/models/token';
import { PancakeswapPairFactoryContext } from './models/pancakeswap-pair-factory-context';
import { TradeContext } from './models/trade-context';
import { Transaction } from './models/transaction';
import { PancakeswapPairContractFactory } from './pancakeswap-pair-contract.factory';
export declare class PancakeswapPairFactory {
    private _pancakeswapPairFactoryContext;
    private readonly LIQUIDITY_PROVIDER_FEE;
    private _fromTokenFactory;
    private _pancakeswapRouterContractFactory;
    private _pancakeswapPairFactory;
    private _pancakeswapRouterFactory;
    private _quoteChangeTimeout;
    private _quoteChanged$;
    constructor(_pancakeswapPairFactoryContext: PancakeswapPairFactoryContext);
    /**
     * The to token
     */
    get toToken(): Token;
    /**
     * The from token
     */
    get fromToken(): Token;
    /**
     * Get the contract calls
     */
    get contractCalls(): PancakeswapPairContractFactory;
    /**
     * Execute the trade path
     * @param amount The amount
     */
    private executeTradePath;
    /**
     * Destroy the trade instance watchers + subscriptions
     */
    private destroy;
    /**
     * Generate trade - this will return amount but you still need to send the transaction
     * if you want it to be executed on the blockchain
     * @amount The amount you want to swap, this is the FROM token amount.
     */
    trade(amount: string): Promise<TradeContext>;
    /**
     * Route getter
     */
    private get _routes();
    /**
     * Find the best route rate out of all the route quotes
     * @param amountToTrade The amount to trade
     */
    findBestRoute(amountToTrade: string): Promise<BestRouteQuotes>;
    /**
     * Find the best route rate out of all the route quotes
     * @param amountToTrade The amount to trade
     */
    findAllPossibleRoutesWithQuote(amountToTrade: string): Promise<RouteQuote[]>;
    /**
     * Find all possible routes
     */
    findAllPossibleRoutes(): Promise<Token[][]>;
    /**
     * Has got enough allowance to do the trade
     * @param amount The amount you want to swap
     */
    hasGotEnoughAllowance(amount: string): Promise<boolean>;
    /**
     * Has got enough allowance to do the trade
     * @param amount The amount you want to swap
     */
    private _hasGotEnoughAllowance;
    /**
     * Has got enough balance to do the trade (erc20 check only)
     * @param amount The amount you want to swap
     */
    private hasGotEnoughBalanceErc20;
    /**
     * Has got enough balance to do the trade (eth check only)
     * @param amount The amount you want to swap
     */
    private hasGotEnoughBalanceEth;
    /**
     * Get the allowance and balance for the from token (erc20 > blah) only
     */
    getAllowanceAndBalanceOfForFromToken(): Promise<AllowanceAndBalanceOf>;
    /**
     * Get the allowance for the amount which can be moved from the `fromToken`
     * on the users behalf. Only valid when the `fromToken` is a ERC20 token.
     */
    allowance(): Promise<string>;
    /**
     * Generate the from token approve data max allowance to move the tokens.
     * This will return the data for you to send as a transaction
     */
    generateApproveMaxAllowanceData(): Promise<Transaction>;
    /**
     * Get the token trade amount for erc20 > eth
     * @param amount The amount
     */
    private getTokenTradeAmountErc20ToEth;
    /**
     * Gets how much token they will get for their trade minus all fees
     * @param ethAmount The eth amount
     */
    private getTokenTradeAmountEthToErc20;
    /**
     * Get the token trade amount for erc20 > erc20
     * @param amount The amount
     */
    private getTokenTradeAmountErc20ToErc20;
    /**
     * finds the best price and path for Erc20ToEth
     * @param amount the erc20Token amount being sent
     */
    private findBestPriceAndPathErc20ToEth;
    /**
     * finds the best price and path for Erc20ToErc20
     * @param amount the erc20Token amount being sent
     */
    private findBestPriceAndPathErc20ToErc20;
    /**
     * Find the best price and route path to take (will round down the slippage)
     * @param ethAmount The eth amount
     */
    private findBestPriceAndPathEthToErc20;
    /**
     * Generate trade data eth > erc20
     * @param tokenAmount The token amount
     * @param routePath The route path
     * @param deadline The deadline it expiries unix time
     */
    private generateTradeDataEthToErc20;
    /**
     * Generate trade amount erc20 > eth
     * @param tokenAmount The token amount
     * @param ethAmountOutMin The min eth in eth not wei this converts it
     * @param routePathArray The route path array
     * @param deadline The deadline it expiries unix time
     */
    private generateTradeDataErc20ToEth;
    /**
     * Generate trade amount erc20 > erc20
     * @param tokenAmount The token amount
     * @param tokenAmountOut The min token amount out
     * @param routePathArray The route path array
     * @param deadline The deadline it expiries unix time
     */
    private generateTradeDataErc20ToErc20;
    /**
     * Build up a transaction for erc20 from
     * @param data The data
     */
    private buildUpTransactionErc20;
    /**
     * Build up a transaction for eth from
     * @param ethValue The eth value
     * @param data The data
     */
    private buildUpTransactionEth;
    /**
     * Get the trade path
     */
    private tradePath;
    /**
     * Generates the trade datetime unix time
     */
    private generateTradeDeadlineUnixTime;
    /**
     * Watch trade price move automatically emitting the stream if it changes
     * @param tradeContext The old trade context aka the current one
     */
    private watchTradePrice;
}
