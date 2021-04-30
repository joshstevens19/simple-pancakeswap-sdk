import { EthersProvider } from '../../ethers-provider';
import { PancakeswapPairContractFactory } from './pancakeswap-pair-contract.factory';

export class PancakeswapPairContractFactoryPublic extends PancakeswapPairContractFactory {
  constructor() {
    super(new EthersProvider());
  }
}
