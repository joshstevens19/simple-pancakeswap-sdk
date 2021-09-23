"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapRouterFactory = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const ethereum_multicall_1 = require("ethereum-multicall");
const contract_context_1 = require("../../common/contract-context");
const error_codes_1 = require("../../common/errors/error-codes");
const pancakeswap_error_1 = require("../../common/errors/pancakeswap-error");
const bnb_1 = require("../../common/tokens/bnb");
const comp_1 = require("../../common/tokens/comp");
const dai_1 = require("../../common/tokens/dai");
const usdc_1 = require("../../common/tokens/usdc");
const usdt_1 = require("../../common/tokens/usdt");
const format_ether_1 = require("../../common/utils/format-ether");
const hexlify_1 = require("../../common/utils/hexlify");
const only_unique_1 = require("../../common/utils/only-unique");
const parse_ether_1 = require("../../common/utils/parse-ether");
const trade_path_1 = require("../../common/utils/trade-path");
const chain_id_1 = require("../../enums/chain-id");
const trade_path_2 = require("../../enums/trade-path");
const router_direction_1 = require("./enums/router-direction");
class PancakeswapRouterFactory {
    constructor(_fromToken, _toToken, _disableMultihops, _ethersProvider) {
        this._fromToken = _fromToken;
        this._toToken = _toToken;
        this._disableMultihops = _disableMultihops;
        this._ethersProvider = _ethersProvider;
        this._multicall = new ethereum_multicall_1.Multicall({
            ethersProvider: this._ethersProvider.provider,
        });
    }
    /**
     * Get all possible routes will only go up to 4 due to gas increase the more routes
     * you go.
     */
    getAllPossibleRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            let findPairs = [];
            if (!this._disableMultihops) {
                findPairs = [
                    this.mainCurrenciesPairsForFromToken,
                    this.mainCurrenciesPairsForToToken,
                    this.mainCurrenciesPairsForUSDT,
                    this.mainCurrenciesPairsForCOMP,
                    this.mainCurrenciesPairsForDAI,
                    this.mainCurrenciesPairsForUSDC,
                    this.mainCurrenciesPairsForWETH,
                    [[this._fromToken, this._toToken]],
                ];
            }
            else {
                // multihops turned off so only go direct
                findPairs = [[[this._fromToken, this._toToken]]];
            }
            const contractCallContext = {
                reference: 'pancakeswap-pairs',
                contractAddress: contract_context_1.ContractContext.pairAddress,
                abi: contract_context_1.ContractContext.pairAbi,
                calls: [],
            };
            for (let pairs = 0; pairs < findPairs.length; pairs++) {
                for (let tokenPairs = 0; tokenPairs < findPairs[pairs].length; tokenPairs++) {
                    const fromToken = findPairs[pairs][tokenPairs][0];
                    const toToken = findPairs[pairs][tokenPairs][1];
                    contractCallContext.calls.push({
                        reference: `${fromToken.contractAddress}-${toToken.contractAddress}-${fromToken.symbol}/${toToken.symbol}`,
                        methodName: 'getPair',
                        methodParameters: [
                            fromToken.contractAddress,
                            toToken.contractAddress,
                        ],
                    });
                }
            }
            const contractCallResults = yield this._multicall.call(contractCallContext);
            const results = contractCallResults.results[contractCallContext.reference];
            const availablePairs = results.callsReturnContext.filter((c) => c.returnValues[0] !== '0x0000000000000000000000000000000000000000');
            const fromTokenRoutes = {
                token: this._fromToken,
                pairs: {
                    fromTokenPairs: this.getTokenAvailablePairs(this._fromToken, availablePairs, router_direction_1.RouterDirection.from),
                },
            };
            const toTokenRoutes = {
                token: this._toToken,
                pairs: {
                    toTokenPairs: this.getTokenAvailablePairs(this._toToken, availablePairs, router_direction_1.RouterDirection.to),
                },
            };
            const allMainRoutes = [];
            for (let i = 0; i < this.allMainTokens.length; i++) {
                const fromTokenPairs = this.getTokenAvailablePairs(this.allMainTokens[i], availablePairs, router_direction_1.RouterDirection.from);
                const toTokenPairs = this.getTokenAvailablePairs(this.allMainTokens[i], availablePairs, router_direction_1.RouterDirection.to);
                allMainRoutes.push({
                    token: this.allMainTokens[i],
                    pairs: { fromTokenPairs, toTokenPairs },
                });
            }
            return this.workOutAllPossibleRoutes(fromTokenRoutes, toTokenRoutes, allMainRoutes);
        });
    }
    getAllPossibleRoutesWithQuotes(amountToTrade) {
        return __awaiter(this, void 0, void 0, function* () {
            const tradeAmount = this.formatAmountToTrade(amountToTrade);
            const routes = yield this.getAllPossibleRoutes();
            const contractCallContext = {
                reference: 'pancakeswap-route-quotes',
                contractAddress: contract_context_1.ContractContext.routerAddress,
                abi: contract_context_1.ContractContext.routerAbi,
                calls: [],
                context: routes,
            };
            for (let i = 0; i < routes.length; i++) {
                const routeCombo = routes[i];
                contractCallContext.calls.push({
                    reference: `route${i}`,
                    methodName: 'getAmountsOut',
                    methodParameters: [
                        tradeAmount,
                        routeCombo.map((c) => {
                            return c.contractAddress;
                        }),
                    ],
                });
            }
            const contractCallResults = yield this._multicall.call(contractCallContext);
            const results = contractCallResults.results[contractCallContext.reference];
            return this.buildRouteQuotesFromResults(results);
        });
    }
    /**
     * Finds the best route
     * @param amountToTrade The amount they want to trade
     */
    findBestRoute(amountToTrade) {
        return __awaiter(this, void 0, void 0, function* () {
            const allRoutes = yield this.getAllPossibleRoutesWithQuotes(amountToTrade);
            if (allRoutes.length === 0) {
                throw new pancakeswap_error_1.PancakeswapError(`No routes found for ${this._fromToken.contractAddress} > ${this._toToken.contractAddress}`, error_codes_1.ErrorCodes.noRoutesFound);
            }
            return {
                bestRouteQuote: allRoutes[0],
                triedRoutesQuote: allRoutes.map((route) => {
                    return {
                        expectedConvertQuote: route.expectedConvertQuote,
                        routePathArrayTokenMap: route.routePathArrayTokenMap,
                        routeText: route.routeText,
                        routePathArray: route.routePathArray,
                    };
                }),
            };
        });
    }
    /**
     * Works out every possible route it can take
     * @param fromTokenRoutes The from token routes
     * @param toTokenRoutes The to token routes
     * @param allMainRoutes All the main routes
     */
    workOutAllPossibleRoutes(fromTokenRoutes, toTokenRoutes, allMainRoutes) {
        const jointCompatibleRoutes = toTokenRoutes.pairs.toTokenPairs.filter((t) => fromTokenRoutes.pairs.fromTokenPairs.find((f) => f.contractAddress === t.contractAddress));
        const routes = [];
        if (fromTokenRoutes.pairs.fromTokenPairs.find((t) => t.contractAddress === toTokenRoutes.token.contractAddress)) {
            routes.push([fromTokenRoutes.token, toTokenRoutes.token]);
        }
        for (let i = 0; i < allMainRoutes.length; i++) {
            const tokenRoute = allMainRoutes[i];
            if (jointCompatibleRoutes.find((c) => c.contractAddress === tokenRoute.token.contractAddress)) {
                routes.push([
                    fromTokenRoutes.token,
                    tokenRoute.token,
                    toTokenRoutes.token,
                ]);
                for (let f = 0; f < fromTokenRoutes.pairs.fromTokenPairs.length; f++) {
                    const fromSupportedToken = fromTokenRoutes.pairs.fromTokenPairs[f];
                    if (tokenRoute.pairs.toTokenPairs.find((pair) => pair.contractAddress === fromSupportedToken.contractAddress)) {
                        const workedOutFromRoute = [
                            fromTokenRoutes.token,
                            fromSupportedToken,
                            tokenRoute.token,
                            toTokenRoutes.token,
                        ];
                        if (workedOutFromRoute.filter(only_unique_1.onlyUnique).length ===
                            workedOutFromRoute.length) {
                            routes.push(workedOutFromRoute);
                        }
                    }
                }
                for (let f = 0; f < toTokenRoutes.pairs.toTokenPairs.length; f++) {
                    const toSupportedToken = toTokenRoutes.pairs.toTokenPairs[f];
                    if (tokenRoute.pairs.fromTokenPairs.find((pair) => pair.contractAddress === toSupportedToken.contractAddress)) {
                        const workedOutToRoute = [
                            fromTokenRoutes.token,
                            tokenRoute.token,
                            toSupportedToken,
                            toTokenRoutes.token,
                        ];
                        if (workedOutToRoute.filter(only_unique_1.onlyUnique).length ===
                            workedOutToRoute.length) {
                            routes.push(workedOutToRoute);
                        }
                    }
                }
            }
        }
        return routes;
    }
    getTokenAvailablePairs(token, allAvailablePairs, direction) {
        switch (direction) {
            case router_direction_1.RouterDirection.from:
                return this.getFromRouterDirectionAvailablePairs(token, allAvailablePairs);
            case router_direction_1.RouterDirection.to:
                return this.getToRouterDirectionAvailablePairs(token, allAvailablePairs);
        }
    }
    getFromRouterDirectionAvailablePairs(token, allAvailablePairs) {
        const fromRouterDirection = allAvailablePairs.filter((c) => c.reference.split('-')[0] === token.contractAddress);
        const tokens = [];
        for (let index = 0; index < fromRouterDirection.length; index++) {
            const context = fromRouterDirection[index];
            tokens.push(this.allTokens.find((t) => t.contractAddress === context.reference.split('-')[1]));
        }
        return tokens;
    }
    getToRouterDirectionAvailablePairs(token, allAvailablePairs) {
        const toRouterDirection = allAvailablePairs.filter((c) => c.reference.split('-')[1] === token.contractAddress);
        const tokens = [];
        for (let index = 0; index < toRouterDirection.length; index++) {
            const context = toRouterDirection[index];
            tokens.push(this.allTokens.find((t) => t.contractAddress === context.reference.split('-')[0]));
        }
        return tokens;
    }
    /**
     * Build up route quotes from results
     * @param pancakeswapFactoryContext The pancakeswap factory context
     * @param contractCallReturnContext The contract call return context
     */
    buildRouteQuotesFromResults(contractCallReturnContext) {
        const tradePath = this.tradePath();
        const result = [];
        if (contractCallReturnContext) {
            for (let i = 0; i < contractCallReturnContext.callsReturnContext.length; i++) {
                const callReturnContext = contractCallReturnContext.callsReturnContext[i];
                switch (tradePath) {
                    case trade_path_2.TradePath.ethToErc20:
                        result.push(this.buildRouteQuoteForEthToErc20(callReturnContext));
                        break;
                    case trade_path_2.TradePath.erc20ToEth:
                        result.push(this.buildRouteQuoteForErc20ToEth(callReturnContext));
                        break;
                    case trade_path_2.TradePath.erc20ToErc20:
                        result.push(this.buildRouteQuoteForErc20ToErc20(callReturnContext));
                        break;
                    default:
                        throw new pancakeswap_error_1.PancakeswapError(`${tradePath} not found`, error_codes_1.ErrorCodes.tradePathIsNotSupported);
                }
            }
            return result.sort((a, b) => {
                if (new bignumber_js_1.default(a.expectedConvertQuote).isGreaterThan(b.expectedConvertQuote)) {
                    return -1;
                }
                return new bignumber_js_1.default(a.expectedConvertQuote).isLessThan(b.expectedConvertQuote)
                    ? 1
                    : 0;
            });
        }
        return result;
    }
    /**
     * Build up the route quote for erc20 > erc20
     * @param callReturnContext The call return context
     */
    buildRouteQuoteForErc20ToErc20(callReturnContext) {
        return this.buildRouteQuoteForEthToErc20(callReturnContext);
    }
    /**
     * Build up route quote for eth > erc20
     * @param callReturnContext The call return context
     */
    buildRouteQuoteForEthToErc20(callReturnContext) {
        const convertQuoteUnformatted = new bignumber_js_1.default(callReturnContext.returnValues[callReturnContext.returnValues.length - 1].hex);
        return {
            expectedConvertQuote: convertQuoteUnformatted
                .shiftedBy(this._toToken.decimals * -1)
                .toFixed(this._toToken.decimals),
            routePathArrayTokenMap: callReturnContext.methodParameters[1].map((c) => {
                return this.allTokens.find((t) => t.contractAddress === c);
            }),
            routeText: callReturnContext.methodParameters[1]
                .map((c) => {
                return this.allTokens.find((t) => t.contractAddress === c).symbol;
            })
                .join(' > '),
            // route array is always in the 1 index of the method parameters
            routePathArray: callReturnContext.methodParameters[1],
        };
    }
    /**
     * Build up the route quote for erc20 > eth
     * @param callReturnContext The call return context
     */
    buildRouteQuoteForErc20ToEth(callReturnContext) {
        const convertQuoteUnformatted = new bignumber_js_1.default(callReturnContext.returnValues[callReturnContext.returnValues.length - 1].hex);
        return {
            expectedConvertQuote: new bignumber_js_1.default(format_ether_1.formatEther(convertQuoteUnformatted)).toFixed(this._toToken.decimals),
            routePathArrayTokenMap: callReturnContext.methodParameters[1].map((c) => {
                return this.allTokens.find((t) => t.contractAddress === c);
            }),
            routeText: callReturnContext.methodParameters[1]
                .map((c) => {
                return this.allTokens.find((t) => t.contractAddress === c).symbol;
            })
                .join(' > '),
            // route array is always in the 1 index of the method parameters
            routePathArray: callReturnContext.methodParameters[1],
        };
    }
    /**
     * Format amount to trade into callable formats
     * @param amountToTrade The amount to trade
     * @param pancakeswapFactoryContext The pancakeswap factory context
     */
    formatAmountToTrade(amountToTrade) {
        switch (this.tradePath()) {
            case trade_path_2.TradePath.ethToErc20:
                const amountToTradeWei = parse_ether_1.parseEther(amountToTrade);
                return hexlify_1.hexlify(amountToTradeWei);
            case trade_path_2.TradePath.erc20ToEth:
            case trade_path_2.TradePath.erc20ToErc20:
                return hexlify_1.hexlify(amountToTrade.shiftedBy(this._fromToken.decimals));
            default:
                throw new pancakeswap_error_1.PancakeswapError(`Internal trade path ${this.tradePath()} is not supported`, error_codes_1.ErrorCodes.tradePathIsNotSupported);
        }
    }
    /**
     * Get the trade path
     */
    tradePath() {
        return trade_path_1.getTradePath(this._fromToken, this._toToken);
    }
    get allTokens() {
        return [this._fromToken, this._toToken, ...this.allMainTokens];
    }
    get allMainTokens() {
        if (this._ethersProvider.provider.network.chainId === chain_id_1.ChainId.BSC) {
            return [
                this.USDTTokenForConnectedNetwork,
                this.COMPTokenForConnectedNetwork,
                this.USDCTokenForConnectedNetwork,
                this.DAITokenForConnectedNetwork,
                this.WETHTokenForConnectedNetwork,
            ];
        }
        return [this.WETHTokenForConnectedNetwork];
    }
    get mainCurrenciesPairsForFromToken() {
        const pairs = [
            [this._fromToken, this.USDTTokenForConnectedNetwork],
            [this._fromToken, this.COMPTokenForConnectedNetwork],
            [this._fromToken, this.USDCTokenForConnectedNetwork],
            [this._fromToken, this.DAITokenForConnectedNetwork],
            [this._fromToken, this.WETHTokenForConnectedNetwork],
        ];
        return pairs.filter((t) => t[0].contractAddress !== t[1].contractAddress);
    }
    get mainCurrenciesPairsForToToken() {
        const pairs = [
            [this.USDTTokenForConnectedNetwork, this._toToken],
            [this.COMPTokenForConnectedNetwork, this._toToken],
            [this.USDCTokenForConnectedNetwork, this._toToken],
            [this.DAITokenForConnectedNetwork, this._toToken],
            [this.WETHTokenForConnectedNetwork, this._toToken],
        ];
        return pairs.filter((t) => t[0].contractAddress !== t[1].contractAddress);
    }
    get mainCurrenciesPairsForUSDT() {
        return [
            [this.USDTTokenForConnectedNetwork, this.COMPTokenForConnectedNetwork],
            [this.USDTTokenForConnectedNetwork, this.DAITokenForConnectedNetwork],
            [this.USDTTokenForConnectedNetwork, this.USDCTokenForConnectedNetwork],
            [this.USDTTokenForConnectedNetwork, this.WETHTokenForConnectedNetwork],
        ];
    }
    get mainCurrenciesPairsForCOMP() {
        return [
            [this.COMPTokenForConnectedNetwork, this.USDTTokenForConnectedNetwork],
            [this.COMPTokenForConnectedNetwork, this.DAITokenForConnectedNetwork],
            [this.COMPTokenForConnectedNetwork, this.USDCTokenForConnectedNetwork],
            [this.COMPTokenForConnectedNetwork, this.WETHTokenForConnectedNetwork],
        ];
    }
    get mainCurrenciesPairsForDAI() {
        return [
            [this.DAITokenForConnectedNetwork, this.COMPTokenForConnectedNetwork],
            [this.DAITokenForConnectedNetwork, this.WETHTokenForConnectedNetwork],
        ];
    }
    get mainCurrenciesPairsForUSDC() {
        return [
            [this.USDCTokenForConnectedNetwork, this.USDTTokenForConnectedNetwork],
            [this.USDCTokenForConnectedNetwork, this.COMPTokenForConnectedNetwork],
            [this.USDCTokenForConnectedNetwork, this.DAITokenForConnectedNetwork],
            [this.USDCTokenForConnectedNetwork, this.WETHTokenForConnectedNetwork],
        ];
    }
    get mainCurrenciesPairsForWETH() {
        return [
            [this.WETHTokenForConnectedNetwork, this.USDTTokenForConnectedNetwork],
            [this.WETHTokenForConnectedNetwork, this.COMPTokenForConnectedNetwork],
            [this.WETHTokenForConnectedNetwork, this.DAITokenForConnectedNetwork],
            [this.WETHTokenForConnectedNetwork, this.USDCTokenForConnectedNetwork],
        ];
    }
    get USDTTokenForConnectedNetwork() {
        return usdt_1.USDT.token();
    }
    get COMPTokenForConnectedNetwork() {
        return comp_1.COMP.token();
    }
    get DAITokenForConnectedNetwork() {
        return dai_1.DAI.token();
    }
    get USDCTokenForConnectedNetwork() {
        return usdc_1.USDC.token();
    }
    get WETHTokenForConnectedNetwork() {
        return bnb_1.BNB.token();
    }
}
exports.PancakeswapRouterFactory = PancakeswapRouterFactory;
