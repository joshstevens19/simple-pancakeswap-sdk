import { JsonFragment } from '@ethersproject/abi';

export class ContractContext {
  /**
   * The pancakeswap router address
   */
  public static routerAddress = '0xCDe540d7eAFE93aC5fE6233Bee57E1270D3E330F';

  /**
   * The pancakeswap factory address
   */
  public static factoryAddress = '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7';

  /**
   * The pancakeswap pair address
   */
  public static pairAddress = '0x01bF7C66c6BD861915CdaaE475042d3c4BaE16A7';

  /**
   * PancakeSwap v2 router
   */
  public static routerAbi: JsonFragment[] = require('../ABI/pancakeswap-router-v2.json');

  /**
   * PancakeSwap v2 factory
   */
  public static factoryAbi: JsonFragment[] = require('../ABI/pancakeswap-factory-v2.json');

  /**
   * PancakeSwap v2 pair
   */
  public static pairAbi: JsonFragment[] = require('../ABI/pancakeswap-pair-v2.json');

  /**
   * ERC20 abi
   */
  public static erc20Abi: JsonFragment[] = require('../ABI/erc-20-abi.json');
}
