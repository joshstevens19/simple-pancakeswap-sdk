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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapPair = void 0;
const error_codes_1 = require("../../common/errors/error-codes");
const pancakeswap_error_1 = require("../../common/errors/pancakeswap-error");
const is_address_1 = require("../../common/utils/is-address");
const ethers_provider_1 = require("../../ethers-provider");
const tokens_factory_1 = require("../token/tokens.factory");
const pancakeswap_pair_settings_1 = require("./models/pancakeswap-pair-settings");
const pancakeswap_pair_factory_1 = require("./pancakeswap-pair.factory");
class PancakeswapPair {
    constructor(_pancakeswapPairContext) {
        this._pancakeswapPairContext = _pancakeswapPairContext;
        if (!this._pancakeswapPairContext.fromTokenContractAddress) {
            throw new pancakeswap_error_1.PancakeswapError('Must have a `fromTokenContractAddress` on the context', error_codes_1.ErrorCodes.fromTokenContractAddressRequired);
        }
        if (!is_address_1.isAddress(this._pancakeswapPairContext.fromTokenContractAddress)) {
            throw new pancakeswap_error_1.PancakeswapError('`fromTokenContractAddress` is not a valid contract address', error_codes_1.ErrorCodes.fromTokenContractAddressNotValid);
        }
        if (!this._pancakeswapPairContext.toTokenContractAddress) {
            throw new pancakeswap_error_1.PancakeswapError('Must have a `toTokenContractAddress` on the context', error_codes_1.ErrorCodes.toTokenContractAddressRequired);
        }
        if (!is_address_1.isAddress(this._pancakeswapPairContext.toTokenContractAddress)) {
            throw new pancakeswap_error_1.PancakeswapError('`toTokenContractAddress` is not a valid contract address', error_codes_1.ErrorCodes.toTokenContractAddressNotValid);
        }
        if (!this._pancakeswapPairContext.ethereumAddress) {
            throw new pancakeswap_error_1.PancakeswapError('Must have a `ethereumAddress` on the context', error_codes_1.ErrorCodes.ethereumAddressRequired);
        }
        if (!is_address_1.isAddress(this._pancakeswapPairContext.ethereumAddress)) {
            throw new pancakeswap_error_1.PancakeswapError('`ethereumAddress` is not a valid address', error_codes_1.ErrorCodes.ethereumAddressNotValid);
        }
        if (this._pancakeswapPairContext.providerUrl) {
            this._ethersProvider = new ethers_provider_1.EthersProvider(this._pancakeswapPairContext.providerUrl);
            return;
        }
        this._ethersProvider = new ethers_provider_1.EthersProvider();
    }
    /**
     * Create factory to be able to call methods on the 2 tokens
     */
    createFactory() {
        return __awaiter(this, void 0, void 0, function* () {
            const tokensFactory = new tokens_factory_1.TokensFactory(this._ethersProvider);
            const tokens = yield tokensFactory.getTokens([
                this._pancakeswapPairContext.fromTokenContractAddress,
                this._pancakeswapPairContext.toTokenContractAddress,
            ]);
            const pancakeswapFactoryContext = {
                fromToken: tokens.find((t) => t.contractAddress ===
                    this._pancakeswapPairContext.fromTokenContractAddress),
                toToken: tokens.find((t) => t.contractAddress ===
                    this._pancakeswapPairContext.toTokenContractAddress),
                ethereumAddress: this._pancakeswapPairContext.ethereumAddress,
                settings: this._pancakeswapPairContext.settings || new pancakeswap_pair_settings_1.PancakeswapPairSettings(),
                ethersProvider: this._ethersProvider,
            };
            return new pancakeswap_pair_factory_1.PancakeswapPairFactory(pancakeswapFactoryContext);
        });
    }
}
exports.PancakeswapPair = PancakeswapPair;
