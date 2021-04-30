import { EthersProvider } from '../../ethers-provider';
import { PancakeswapContractFactory } from './pancakeswap-contract.factory';

export class PancakeswapContractFactoryPublic extends PancakeswapContractFactory {
  constructor() {
    super(new EthersProvider());
  }
}
