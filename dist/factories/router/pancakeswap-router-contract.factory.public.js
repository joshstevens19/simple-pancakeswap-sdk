"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PancakeswapRouterContractFactoryPublic = void 0;
const ethers_provider_1 = require("../../ethers-provider");
const pancakeswap_router_contract_factory_1 = require("./pancakeswap-router-contract.factory");
class PancakeswapRouterContractFactoryPublic extends pancakeswap_router_contract_factory_1.PancakeswapRouterContractFactory {
    constructor() {
        super(new ethers_provider_1.EthersProvider());
    }
}
exports.PancakeswapRouterContractFactoryPublic = PancakeswapRouterContractFactoryPublic;
