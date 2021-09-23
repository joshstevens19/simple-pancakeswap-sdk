import BigNumber from 'bignumber.js';
import { EthersProvider } from '../../ethers-provider';
import { Token } from '../token/models/token';
import { BestRouteQuotes } from './models/best-route-quotes';
import { RouteQuote } from './models/route-quote';
export declare class PancakeswapRouterFactory {
    private _fromToken;
    private _toToken;
    private _disableMultihops;
    private _ethersProvider;
    private _multicall;
    constructor(_fromToken: Token, _toToken: Token, _disableMultihops: boolean, _ethersProvider: EthersProvider);
    /**
     * Get all possible routes will only go up to 4 due to gas increase the more routes
     * you go.
     */
    getAllPossibleRoutes(): Promise<Token[][]>;
    getAllPossibleRoutesWithQuotes(amountToTrade: BigNumber): Promise<RouteQuote[]>;
    /**
     * Finds the best route
     * @param amountToTrade The amount they want to trade
     */
    findBestRoute(amountToTrade: BigNumber): Promise<BestRouteQuotes>;
    /**
     * Works out every possible route it can take
     * @param fromTokenRoutes The from token routes
     * @param toTokenRoutes The to token routes
     * @param allMainRoutes All the main routes
     */
    private workOutAllPossibleRoutes;
    private getTokenAvailablePairs;
    private getFromRouterDirectionAvailablePairs;
    private getToRouterDirectionAvailablePairs;
    /**
     * Build up route quotes from results
     * @param pancakeswapFactoryContext The pancakeswap factory context
     * @param contractCallReturnContext The contract call return context
     */
    private buildRouteQuotesFromResults;
    /**
     * Build up the route quote for erc20 > erc20
     * @param callReturnContext The call return context
     */
    private buildRouteQuoteForErc20ToErc20;
    /**
     * Build up route quote for eth > erc20
     * @param callReturnContext The call return context
     */
    private buildRouteQuoteForEthToErc20;
    /**
     * Build up the route quote for erc20 > eth
     * @param callReturnContext The call return context
     */
    private buildRouteQuoteForErc20ToEth;
    /**
     * Format amount to trade into callable formats
     * @param amountToTrade The amount to trade
     * @param pancakeswapFactoryContext The pancakeswap factory context
     */
    private formatAmountToTrade;
    /**
     * Get the trade path
     */
    private tradePath;
    private get allTokens();
    private get allMainTokens();
    private get mainCurrenciesPairsForFromToken();
    private get mainCurrenciesPairsForToToken();
    private get mainCurrenciesPairsForUSDT();
    private get mainCurrenciesPairsForCOMP();
    private get mainCurrenciesPairsForDAI();
    private get mainCurrenciesPairsForUSDC();
    private get mainCurrenciesPairsForWETH();
    private get USDTTokenForConnectedNetwork();
    private get COMPTokenForConnectedNetwork();
    private get DAITokenForConnectedNetwork();
    private get USDCTokenForConnectedNetwork();
    private get WETHTokenForConnectedNetwork();
}
