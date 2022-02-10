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
exports.PancakeswapContractFactory = void 0;
const contract_context_1 = require("../../common/contract-context");
class PancakeswapContractFactory {
    constructor(_ethersProvider) {
        this._ethersProvider = _ethersProvider;
        this._pancakeswapFactoryContract = this._ethersProvider.getContract(JSON.stringify(contract_context_1.ContractContext.factoryAbi), contract_context_1.ContractContext.factoryAddress);
    }
    allPairs(parameter0) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapFactoryContract.allPairs(parameter0);
        });
    }
    allPairsLength() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._pancakeswapFactoryContract.allPairsLength()).toHexString();
        });
    }
    createPair(tokenA, tokenB) {
        return this._pancakeswapFactoryContract.interface.encodeFunctionData('createPair', [tokenA, tokenB]);
    }
    getPair(token0, token1) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapFactoryContract.getPair(token0, token1);
        });
    }
    feeTo() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapFactoryContract.feeTo();
        });
    }
    feeToSetter() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._pancakeswapFactoryContract.feeToSetter();
        });
    }
    setFeeTo(_feeTo) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._pancakeswapFactoryContract.interface.encodeFunctionData('setFeeTo', [_feeTo]);
        });
    }
    setFeeToSetter(_feeToSetter) {
        return __awaiter(this, void 0, void 0, function* () {
            return this._pancakeswapFactoryContract.interface.encodeFunctionData('setFeeToSetter', [_feeToSetter]);
        });
    }
}
exports.PancakeswapContractFactory = PancakeswapContractFactory;
