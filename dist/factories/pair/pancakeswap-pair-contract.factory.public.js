"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapPairContractFactoryPublic = void 0;
const ethers_provider_1 = require("../../ethers-provider");
const pancakeswap_pair_contract_factory_1 = require("./pancakeswap-pair-contract.factory");
class PancakeswapPairContractFactoryPublic extends pancakeswap_pair_contract_factory_1.PancakeswapPairContractFactory {
    constructor() {
        super(new ethers_provider_1.EthersProvider());
    }
}
exports.PancakeswapPairContractFactoryPublic = PancakeswapPairContractFactoryPublic;
