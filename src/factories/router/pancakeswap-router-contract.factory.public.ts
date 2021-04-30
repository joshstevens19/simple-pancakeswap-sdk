import { EthersProvider } from '../../ethers-provider';
import { PancakeswapRouterContractFactory } from './pancakeswap-router-contract.factory';

export class PancakeswapRouterContractFactoryPublic extends PancakeswapRouterContractFactory {
  constructor() {
    super(new EthersProvider());
  }
}
