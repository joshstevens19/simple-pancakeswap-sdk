"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapContractFactoryPublic = void 0;
const ethers_provider_1 = require("../../ethers-provider");
const pancakeswap_contract_factory_1 = require("./pancakeswap-contract.factory");
class PancakeswapContractFactoryPublic extends pancakeswap_contract_factory_1.PancakeswapContractFactory {
    constructor() {
        super(new ethers_provider_1.EthersProvider());
    }
}
exports.PancakeswapContractFactoryPublic = PancakeswapContractFactoryPublic;
