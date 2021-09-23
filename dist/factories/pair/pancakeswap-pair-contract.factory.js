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
exports.PancakeswapPairContractFactory = void 0;
const contract_context_1 = require("../../common/contract-context");
class PancakeswapPairContractFactory {
    constructor(_ethersProvider) {
        this._ethersProvider = _ethersProvider;
        this._pancakeswapPairFactory = this._ethersProvider.getContract(JSON.stringify(contract_context_1.ContractContext.pairAbi), contract_context_1.ContractContext.pairAddress);
    }
    allPairs(parameter0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapPairFactory.allPairs(parameter0);
        });
    }
    allPairsLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._pancakeswapPairFactory.allPairsLength()).toHexString();
        });
    }
    createPair(tokenA, tokenB) {
        return this._pancakeswapPairFactory.interface.encodeFunctionData('createPair', [tokenA, tokenB]);
    }
    feeTo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapPairFactory.feeTo();
        });
    }
    feeToSetter() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapPairFactory.feeToSetter();
        });
    }
    getPair(parameter0, parameter1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapPairFactory.getPair(parameter0, parameter1);
        });
    }
    setFeeTo(_feeTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._pancakeswapPairFactory.interface.encodeFunctionData('setFeeTo', [_feeTo]);
        });
    }
    setFeeToSetter(_feeToSetter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._pancakeswapPairFactory.interface.encodeFunctionData('setFeeToSetter', [_feeToSetter]);
        });
    }
}
exports.PancakeswapPairContractFactory = PancakeswapPairContractFactory;
