"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContractContext = void 0;
class ContractContext {
}
exports.ContractContext = ContractContext;
/**
 * The pancakeswap router address
 */
ContractContext.routerAddress = '0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F';
/**
 * The pancakeswap factory address
 */
ContractContext.factoryAddress = '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7';
/**
 * The pancakeswap pair address
 */
ContractContext.pairAddress = '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7';
/**
 * PancakeSwap v2 router
 */
ContractContext.routerAbi = require('../ABI/pancakeswap-router-v2.json');
/**
 * PancakeSwap v2 factory
 */
ContractContext.factoryAbi = require('../ABI/pancakeswap-factory-v2.json');
/**
 * PancakeSwap v2 pair
 */
ContractContext.pairAbi = require('../ABI/pancakeswap-pair-v2.json');
/**
 * ERC20 abi
 */
ContractContext.erc20Abi = require('../ABI/erc-20-abi.json');
