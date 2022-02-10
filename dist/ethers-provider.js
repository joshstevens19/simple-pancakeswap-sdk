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
exports.EthersProvider = void 0;
const ethers_1 = require("ethers");
class EthersProvider {
    constructor(providerUrl = 'https://bsc-dataseed.binance.org/') {
        this._ethersProvider = new ethers_1.providers.StaticJsonRpcProvider(providerUrl);
    }
    /**
     * Creates a contract instance
     * @param abi The ABI
     * @param contractAddress The contract address
     */
    getContract(abi, contractAddress) {
        const contract = new ethers_1.Contract(contractAddress, abi, this._ethersProvider);
        return contract;
    }
    /**
     * Get the network
     */
    network() {
        return this._ethersProvider.network;
    }
    /**
     * Get the ethers provider
     */
    get provider() {
        return this._ethersProvider;
    }
    /**
     * Get eth amount
     * @param ethereumAddress The ethereum address
     */
    balanceOf(ethereumAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this._ethersProvider.getBalance(ethereumAddress)).toHexString();
        });
    }
}
exports.EthersProvider = EthersProvider;
