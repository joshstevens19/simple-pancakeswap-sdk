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
exports.PancakeswapPairFactory = void 0;
const bignumber_js_1 = __importDefault(require("bignumber.js"));
const rxjs_1 = require("rxjs");
const __1 = require("../..");
const constants_1 = require("../../common/constants");
const contract_context_1 = require("../../common/contract-context");
const error_codes_1 = require("../../common/errors/error-codes");
const hexlify_1 = require("../../common/utils/hexlify");
const parse_ether_1 = require("../../common/utils/parse-ether");
const to_ethers_big_number_1 = require("../../common/utils/to-ethers-big-number");
const trade_path_1 = require("../../common/utils/trade-path");
const trade_path_2 = require("../../enums/trade-path");
const pancakeswap_router_contract_factory_1 = require("../router/pancakeswap-router-contract.factory");
const pancakeswap_router_factory_1 = require("../router/pancakeswap-router.factory");
const token_factory_1 = require("../token/token.factory");
const pancakeswap_pair_contract_factory_1 = require("./pancakeswap-pair-contract.factory");
class PancakeswapPairFactory {
    constructor(_pancakeswapPairFactoryContext) {
        this._pancakeswapPairFactoryContext = _pancakeswapPairFactoryContext;
        this.LIQUIDITY_PROVIDER_FEE = 0.003;
        this._fromTokenFactory = new token_factory_1.TokenFactory(this._pancakeswapPairFactoryContext.fromToken.contractAddress, this._pancakeswapPairFactoryContext.ethersProvider);
        this._pancakeswapRouterContractFactory = new pancakeswap_router_contract_factory_1.PancakeswapRouterContractFactory(this._pancakeswapPairFactoryContext.ethersProvider);
        this._pancakeswapPairFactory = new pancakeswap_pair_contract_factory_1.PancakeswapPairContractFactory(this._pancakeswapPairFactoryContext.ethersProvider);
        this._pancakeswapRouterFactory = new pancakeswap_router_factory_1.PancakeswapRouterFactory(this._pancakeswapPairFactoryContext.fromToken, this._pancakeswapPairFactoryContext.toToken, this._pancakeswapPairFactoryContext.settings.disableMultihops, this._pancakeswapPairFactoryContext.ethersProvider);
        this._quoteChanged$ = new rxjs_1.Subject();
    }
    /**
     * The to token
     */
    get toToken() {
        return this._pancakeswapPairFactoryContext.toToken;
    }
    /**
     * The from token
     */
    get fromToken() {
        return this._pancakeswapPairFactoryContext.fromToken;
    }
    /**
     * Get the contract calls
     */
    get contractCalls() {
        return this._pancakeswapPairFactory;
    }
    /**
     * Execute the trade path
     * @param amount The amount
     */
    executeTradePath(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (this.tradePath()) {
                case trade_path_2.TradePath.erc20ToEth:
                    return yield this.getTokenTradeAmountErc20ToEth(amount);
                case trade_path_2.TradePath.ethToErc20:
                    return yield this.getTokenTradeAmountEthToErc20(amount);
                case trade_path_2.TradePath.erc20ToErc20:
                    return yield this.getTokenTradeAmountErc20ToErc20(amount);
                default:
                    throw new __1.PancakeswapError(`${this.tradePath()} is not defined`, error_codes_1.ErrorCodes.tradePathIsNotSupported);
            }
        });
    }
    /**
     * Destroy the trade instance watchers + subscriptions
     */
    destroy() {
        for (let i = 0; i < this._quoteChanged$.observers.length; i++) {
            this._quoteChanged$.observers[i].complete();
        }
        if (this._quoteChangeTimeout) {
            clearTimeout(this._quoteChangeTimeout);
        }
    }
    /**
     * Generate trade - this will return amount but you still need to send the transaction
     * if you want it to be executed on the blockchain
     * @amount The amount you want to swap, this is the FROM token amount.
     */
    trade(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            this.destroy();
            const tradeContext = yield this.executeTradePath(new bignumber_js_1.default(amount));
            this.watchTradePrice(tradeContext);
            return tradeContext;
        });
    }
    /**
     * Route getter
     */
    get _routes() {
        return this._pancakeswapRouterFactory;
    }
    /**
     * Find the best route rate out of all the route quotes
     * @param amountToTrade The amount to trade
     */
    findBestRoute(amountToTrade) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._routes.findBestRoute(new bignumber_js_1.default(amountToTrade));
        });
    }
    /**
     * Find the best route rate out of all the route quotes
     * @param amountToTrade The amount to trade
     */
    findAllPossibleRoutesWithQuote(amountToTrade) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._routes.getAllPossibleRoutesWithQuotes(new bignumber_js_1.default(amountToTrade));
        });
    }
    /**
     * Find all possible routes
     */
    findAllPossibleRoutes() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._routes.getAllPossibleRoutes();
        });
    }
    /**
     * Has got enough allowance to do the trade
     * @param amount The amount you want to swap
     */
    hasGotEnoughAllowance(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tradePath() === trade_path_2.TradePath.ethToErc20) {
                return true;
            }
            const allowance = yield this.allowance();
            return this._hasGotEnoughAllowance(amount, allowance);
        });
    }
    /**
     * Has got enough allowance to do the trade
     * @param amount The amount you want to swap
     */
    _hasGotEnoughAllowance(amount, allowance) {
        if (this.tradePath() === trade_path_2.TradePath.ethToErc20) {
            return true;
        }
        const bigNumberAllowance = new bignumber_js_1.default(allowance).shiftedBy(this.fromToken.decimals * -1);
        if (new bignumber_js_1.default(amount).isGreaterThan(bigNumberAllowance)) {
            return false;
        }
        return true;
    }
    /**
     * Has got enough balance to do the trade (erc20 check only)
     * @param amount The amount you want to swap
     */
    hasGotEnoughBalanceErc20(amount, balance) {
        const bigNumberBalance = new bignumber_js_1.default(balance).shiftedBy(this.fromToken.decimals * -1);
        if (new bignumber_js_1.default(amount).isGreaterThan(bigNumberBalance)) {
            return {
                hasEnough: false,
                balance: bigNumberBalance.toFixed(),
            };
        }
        return {
            hasEnough: true,
            balance: bigNumberBalance.toFixed(),
        };
    }
    /**
     * Has got enough balance to do the trade (eth check only)
     * @param amount The amount you want to swap
     */
    hasGotEnoughBalanceEth(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this._pancakeswapPairFactoryContext.ethersProvider.balanceOf(this._pancakeswapPairFactoryContext.ethereumAddress);
            const bigNumberBalance = new bignumber_js_1.default(balance).shiftedBy(constants_1.Constants.BNB_MAX_DECIMALS * -1);
            if (new bignumber_js_1.default(amount).isGreaterThan(bigNumberBalance)) {
                return {
                    hasEnough: false,
                    balance: bigNumberBalance.toFixed(),
                };
            }
            return {
                hasEnough: true,
                balance: bigNumberBalance.toFixed(),
            };
        });
    }
    /**
     * Get the allowance and balance for the from token (erc20 > blah) only
     */
    getAllowanceAndBalanceOfForFromToken() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._fromTokenFactory.getAllowanceAndBalanceOf(this._pancakeswapPairFactoryContext.ethereumAddress);
        });
    }
    /**
     * Get the allowance for the amount which can be moved from the `fromToken`
     * on the users behalf. Only valid when the `fromToken` is a ERC20 token.
     */
    allowance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tradePath() === trade_path_2.TradePath.ethToErc20) {
                return '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
            }
            const allowance = yield this._fromTokenFactory.allowance(this._pancakeswapPairFactoryContext.ethereumAddress);
            return allowance;
        });
    }
    /**
     * Generate the from token approve data max allowance to move the tokens.
     * This will return the data for you to send as a transaction
     */
    generateApproveMaxAllowanceData() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.tradePath() === trade_path_2.TradePath.ethToErc20) {
                throw new __1.PancakeswapError('You do not need to generate approve pancakeswap allowance when doing eth > erc20', error_codes_1.ErrorCodes.generateApproveMaxAllowanceDataNotAllowed);
            }
            const data = this._fromTokenFactory.generateApproveAllowanceData(contract_context_1.ContractContext.routerAddress, '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');
            return {
                to: this.fromToken.contractAddress,
                from: this._pancakeswapPairFactoryContext.ethereumAddress,
                data,
                value: constants_1.Constants.EMPTY_HEX_STRING,
            };
        });
    }
    /**
     * Get the token trade amount for erc20 > eth
     * @param amount The amount
     */
    getTokenTradeAmountErc20ToEth(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findBestPriceAndPathErc20ToEth(amount);
        });
    }
    /**
     * Gets how much token they will get for their trade minus all fees
     * @param ethAmount The eth amount
     */
    getTokenTradeAmountEthToErc20(ethAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findBestPriceAndPathEthToErc20(ethAmount);
        });
    }
    /**
     * Get the token trade amount for erc20 > erc20
     * @param amount The amount
     */
    getTokenTradeAmountErc20ToErc20(amount) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.findBestPriceAndPathErc20ToErc20(amount);
        });
    }
    /**
     * finds the best price and path for Erc20ToEth
     * @param amount the erc20Token amount being sent
     */
    findBestPriceAndPathErc20ToEth(erc20Amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const bestRouteQuotes = yield this._routes.findBestRoute(erc20Amount);
            const bestRouteQuote = bestRouteQuotes.bestRouteQuote;
            const convertQuoteWithSlippage = new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote).minus(new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote)
                .times(this._pancakeswapPairFactoryContext.settings.slippage)
                .toFixed(this.fromToken.decimals));
            const tradeExpires = this.generateTradeDeadlineUnixTime();
            const data = this.generateTradeDataErc20ToEth(erc20Amount, convertQuoteWithSlippage, bestRouteQuote.routePathArray, tradeExpires.toString());
            const allowanceAndBalanceOf = yield this.getAllowanceAndBalanceOfForFromToken();
            const hasEnoughAllowance = this._hasGotEnoughAllowance(erc20Amount.toFixed(), allowanceAndBalanceOf.allowance);
            const tradeContext = {
                baseConvertRequest: erc20Amount.toFixed(),
                minAmountConvertQuote: convertQuoteWithSlippage.toFixed(this.toToken.decimals),
                expectedConvertQuote: bestRouteQuote.expectedConvertQuote,
                liquidityProviderFee: erc20Amount
                    .times(this.LIQUIDITY_PROVIDER_FEE)
                    .toFixed(this.fromToken.decimals),
                tradeExpires,
                routePathTokenMap: bestRouteQuote.routePathArrayTokenMap,
                routeText: bestRouteQuote.routeText,
                routePath: bestRouteQuote.routePathArray,
                hasEnoughAllowance,
                approvalTransaction: !hasEnoughAllowance
                    ? yield this.generateApproveMaxAllowanceData()
                    : undefined,
                toToken: this.toToken,
                fromToken: this.fromToken,
                fromBalance: this.hasGotEnoughBalanceErc20(erc20Amount.toFixed(), allowanceAndBalanceOf.balanceOf),
                transaction: this.buildUpTransactionErc20(data),
                allTriedRoutesQuotes: bestRouteQuotes.triedRoutesQuote,
                quoteChanged$: this._quoteChanged$,
                destroy: () => this.destroy(),
            };
            return tradeContext;
        });
    }
    /**
     * finds the best price and path for Erc20ToErc20
     * @param amount the erc20Token amount being sent
     */
    findBestPriceAndPathErc20ToErc20(erc20Amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const bestRouteQuotes = yield this._routes.findBestRoute(erc20Amount);
            const bestRouteQuote = bestRouteQuotes.bestRouteQuote;
            const convertQuoteWithSlippage = new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote).minus(new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote)
                .times(this._pancakeswapPairFactoryContext.settings.slippage)
                .toFixed(this.fromToken.decimals));
            const tradeExpires = this.generateTradeDeadlineUnixTime();
            const data = this.generateTradeDataErc20ToErc20(erc20Amount, convertQuoteWithSlippage, bestRouteQuote.routePathArray, tradeExpires.toString());
            const allowanceAndBalanceOf = yield this.getAllowanceAndBalanceOfForFromToken();
            const hasEnoughAllowance = this._hasGotEnoughAllowance(erc20Amount.toFixed(), allowanceAndBalanceOf.allowance);
            const tradeContext = {
                baseConvertRequest: erc20Amount.toFixed(),
                minAmountConvertQuote: convertQuoteWithSlippage.toFixed(this.toToken.decimals),
                expectedConvertQuote: bestRouteQuote.expectedConvertQuote,
                liquidityProviderFee: erc20Amount
                    .times(this.LIQUIDITY_PROVIDER_FEE)
                    .toFixed(this.fromToken.decimals),
                tradeExpires,
                routePathTokenMap: bestRouteQuote.routePathArrayTokenMap,
                routeText: bestRouteQuote.routeText,
                routePath: bestRouteQuote.routePathArray,
                hasEnoughAllowance,
                approvalTransaction: !hasEnoughAllowance
                    ? yield this.generateApproveMaxAllowanceData()
                    : undefined,
                toToken: this.toToken,
                fromToken: this.fromToken,
                fromBalance: this.hasGotEnoughBalanceErc20(erc20Amount.toFixed(), allowanceAndBalanceOf.balanceOf),
                transaction: this.buildUpTransactionErc20(data),
                allTriedRoutesQuotes: bestRouteQuotes.triedRoutesQuote,
                quoteChanged$: this._quoteChanged$,
                destroy: () => this.destroy(),
            };
            return tradeContext;
        });
    }
    /**
     * Find the best price and route path to take (will round down the slippage)
     * @param ethAmount The eth amount
     */
    findBestPriceAndPathEthToErc20(ethAmount) {
        return __awaiter(this, void 0, void 0, function* () {
            const bestRouteQuotes = yield this._routes.findBestRoute(ethAmount);
            const bestRouteQuote = bestRouteQuotes.bestRouteQuote;
            const convertQuoteWithSlippage = new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote).minus(new bignumber_js_1.default(bestRouteQuote.expectedConvertQuote)
                .times(this._pancakeswapPairFactoryContext.settings.slippage)
                .toFixed(this.toToken.decimals));
            const tradeExpires = this.generateTradeDeadlineUnixTime();
            const data = this.generateTradeDataEthToErc20(convertQuoteWithSlippage, bestRouteQuote.routePathArray, tradeExpires.toString());
            const tradeContext = {
                baseConvertRequest: ethAmount.toFixed(),
                minAmountConvertQuote: convertQuoteWithSlippage.toFixed(this.toToken.decimals),
                expectedConvertQuote: bestRouteQuote.expectedConvertQuote,
                liquidityProviderFee: ethAmount
                    .times(this.LIQUIDITY_PROVIDER_FEE)
                    .toFixed(this.fromToken.decimals),
                tradeExpires,
                routePathTokenMap: bestRouteQuote.routePathArrayTokenMap,
                routeText: bestRouteQuote.routeText,
                routePath: bestRouteQuote.routePathArray,
                hasEnoughAllowance: true,
                toToken: this.toToken,
                fromToken: this.fromToken,
                fromBalance: yield this.hasGotEnoughBalanceEth(ethAmount.toFixed()),
                transaction: this.buildUpTransactionEth(ethAmount, data),
                allTriedRoutesQuotes: bestRouteQuotes.triedRoutesQuote,
                quoteChanged$: this._quoteChanged$,
                destroy: () => this.destroy(),
            };
            return tradeContext;
        });
    }
    /**
     * Generate trade data eth > erc20
     * @param tokenAmount The token amount
     * @param routePath The route path
     * @param deadline The deadline it expiries unix time
     */
    generateTradeDataEthToErc20(tokenAmount, routePathArray, deadline) {
        // pancakeswap adds extra digits on even if the token is say 8 digits long
        const convertedMinTokens = tokenAmount
            .shiftedBy(this.toToken.decimals)
            .decimalPlaces(0);
        const hex = hexlify_1.hexlify(convertedMinTokens);
        return this._pancakeswapRouterContractFactory.swapExactBNBForTokens(hex, routePathArray, this._pancakeswapPairFactoryContext.ethereumAddress, deadline);
    }
    /**
     * Generate trade amount erc20 > eth
     * @param tokenAmount The token amount
     * @param ethAmountOutMin The min eth in eth not wei this converts it
     * @param routePathArray The route path array
     * @param deadline The deadline it expiries unix time
     */
    generateTradeDataErc20ToEth(tokenAmount, ethAmountOutMin, routePathArray, deadline) {
        // pancakeswap adds extra digits on even if the token is say 8 digits long
        const amountIn = tokenAmount
            .shiftedBy(this.fromToken.decimals)
            .decimalPlaces(0);
        const ethAmountOutWei = hexlify_1.hexlify(parse_ether_1.parseEther(ethAmountOutMin));
        return this._pancakeswapRouterContractFactory.swapExactTokensForBNB(hexlify_1.hexlify(amountIn), ethAmountOutWei, routePathArray, this._pancakeswapPairFactoryContext.ethereumAddress, deadline);
    }
    /**
     * Generate trade amount erc20 > erc20
     * @param tokenAmount The token amount
     * @param tokenAmountOut The min token amount out
     * @param routePathArray The route path array
     * @param deadline The deadline it expiries unix time
     */
    generateTradeDataErc20ToErc20(tokenAmount, tokenAmountMin, routePathArray, deadline) {
        // pancakeswap adds extra digits on even if the token is say 8 digits long
        const amountIn = tokenAmount
            .shiftedBy(this.fromToken.decimals)
            .decimalPlaces(0);
        const amountMin = tokenAmountMin
            .shiftedBy(this.toToken.decimals)
            .decimalPlaces(0);
        return this._pancakeswapRouterContractFactory.swapExactTokensForTokens(hexlify_1.hexlify(amountIn), hexlify_1.hexlify(amountMin), routePathArray, this._pancakeswapPairFactoryContext.ethereumAddress, deadline);
    }
    /**
     * Build up a transaction for erc20 from
     * @param data The data
     */
    buildUpTransactionErc20(data) {
        return {
            to: contract_context_1.ContractContext.routerAddress,
            from: this._pancakeswapPairFactoryContext.ethereumAddress,
            data,
            value: constants_1.Constants.EMPTY_HEX_STRING,
        };
    }
    /**
     * Build up a transaction for eth from
     * @param ethValue The eth value
     * @param data The data
     */
    buildUpTransactionEth(ethValue, data) {
        return {
            to: contract_context_1.ContractContext.routerAddress,
            from: this._pancakeswapPairFactoryContext.ethereumAddress,
            data,
            value: to_ethers_big_number_1.toEthersBigNumber(parse_ether_1.parseEther(ethValue)).toHexString(),
        };
    }
    /**
     * Get the trade path
     */
    tradePath() {
        return trade_path_1.getTradePath(this.fromToken, this.toToken);
    }
    /**
     * Generates the trade datetime unix time
     */
    generateTradeDeadlineUnixTime() {
        const now = new Date();
        const expiryDate = new Date(now.getTime() +
            this._pancakeswapPairFactoryContext.settings.deadlineMinutes * 60000);
        return (expiryDate.getTime() / 1e3) | 0;
    }
    /**
     * Watch trade price move automatically emitting the stream if it changes
     * @param tradeContext The old trade context aka the current one
     */
    watchTradePrice(tradeContext) {
        return __awaiter(this, void 0, void 0, function* () {
            this._quoteChangeTimeout = setTimeout(() => __awaiter(this, void 0, void 0, function* () {
                if (this._quoteChanged$.observers.length > 0) {
                    const trade = yield this.executeTradePath(new bignumber_js_1.default(tradeContext.baseConvertRequest));
                    if (!new bignumber_js_1.default(trade.expectedConvertQuote).eq(tradeContext.expectedConvertQuote) ||
                        trade.routeText !== tradeContext.routeText) {
                        this._quoteChanged$.next(trade);
                        this.watchTradePrice(trade);
                        return;
                    }
                    // it has expired send another one to them
                    if (tradeContext.tradeExpires > this.generateTradeDeadlineUnixTime()) {
                        this._quoteChanged$.next(trade);
                        this.watchTradePrice(trade);
                        return;
                    }
                    this.watchTradePrice(tradeContext);
                }
                else {
                    this.watchTradePrice(tradeContext);
                }
                // maybe make config???
                // query new prices every 10 seconds
            }), 10000);
        });
    }
}
exports.PancakeswapPairFactory = PancakeswapPairFactory;
