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
exports.TokenFactory = void 0;
const ethereum_multicall_1 = require("ethereum-multicall");
const ethers_1 = require("ethers");
const contract_context_1 = require("../../common/contract-context");
class TokenFactory {
    constructor(_tokenContractAddress, _ethersProvider) {
        this._tokenContractAddress = _tokenContractAddress;
        this._ethersProvider = _ethersProvider;
        this._multicall = new ethereum_multicall_1.Multicall({
            ethersProvider: this._ethersProvider.provider,
        });
        this._erc20TokenContracy = this._ethersProvider.getContract(JSON.stringify(contract_context_1.ContractContext.erc20Abi), this._tokenContractAddress);
    }
    /**
     * Get the token details
     */
    getToken() {
        return __awaiter(this, void 0, void 0, function* () {
            const SYMBOL = 0;
            const DECIMALS = 1;
            const NAME = 2;
            const contractCallContext = {
                reference: 'token',
                contractAddress: this._tokenContractAddress,
                abi: contract_context_1.ContractContext.erc20Abi,
                calls: [
                    {
                        reference: `symbol`,
                        methodName: 'symbol',
                        methodParameters: [],
                    },
                    {
                        reference: `decimals`,
                        methodName: 'decimals',
                        methodParameters: [],
                    },
                    {
                        reference: `name`,
                        methodName: 'name',
                        methodParameters: [],
                    },
                ],
            };
            const contractCallResults = yield this._multicall.call(contractCallContext);
            const results = contractCallResults.results[contractCallContext.reference];
            return {
                chainId: this._ethersProvider.network().chainId,
                contractAddress: this._tokenContractAddress,
                symbol: results.callsReturnContext[SYMBOL].returnValues[0],
                decimals: results.callsReturnContext[DECIMALS].returnValues[0],
                name: results.callsReturnContext[NAME].returnValues[0],
            };
        });
    }
    /**
     * Get the allowance for the amount which can be moved from the contract
     * for a user
     * @ethereumAddress The users ethereum address
     */
    allowance(ethereumAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const allowance = yield this._erc20TokenContracy.allowance(ethereumAddress, contract_context_1.ContractContext.routerAddress);
            return allowance.toHexString();
        });
    }
    /**
     * Generate the token approve data allowance to move the tokens.
     * This will return the data for you to send as a transaction
     * @spender The contract address for which you are allowing to move tokens on your behalf
     * @value The amount you want to allow them to do
     */
    generateApproveAllowanceData(spender, value) {
        return this._erc20TokenContracy.interface.encodeFunctionData('approve', [
            spender,
            value,
        ]);
    }
    /**
     * Get the balance the user has of this token
     * @ethereumAddress The users ethereum address
     */
    balanceOf(ethereumAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const balance = yield this._erc20TokenContracy.balanceOf(ethereumAddress);
            return balance.toHexString();
        });
    }
    /**
     * Get the total supply of tokens which exist
     */
    totalSupply() {
        return __awaiter(this, void 0, void 0, function* () {
            const totalSupply = yield this._erc20TokenContracy.totalSupply();
            return totalSupply.toHexString();
        });
    }
    /**
     * Get allowance and balance
     * @param ethereumAddress
     */
    getAllowanceAndBalanceOf(ethereumAddress) {
        return __awaiter(this, void 0, void 0, function* () {
            const ALLOWANCE = 0;
            const BALANCEOF = 1;
            const contractCallContext = {
                reference: 'allowance-and-balance-of',
                contractAddress: this._tokenContractAddress,
                abi: contract_context_1.ContractContext.erc20Abi,
                calls: [
                    {
                        reference: 'allowance',
                        methodName: 'allowance',
                        methodParameters: [ethereumAddress, contract_context_1.ContractContext.routerAddress],
                    },
                    {
                        reference: 'balanceOf',
                        methodName: 'balanceOf',
                        methodParameters: [ethereumAddress],
                    },
                ],
            };
            const contractCallResults = yield this._multicall.call(contractCallContext);
            const results = contractCallResults.results[contractCallContext.reference];
            return {
                allowance: ethers_1.BigNumber.from(results.callsReturnContext[ALLOWANCE].returnValues[0]).toHexString(),
                balanceOf: ethers_1.BigNumber.from(results.callsReturnContext[BALANCEOF].returnValues[0]).toHexString(),
            };
        });
    }
}
exports.TokenFactory = TokenFactory;
