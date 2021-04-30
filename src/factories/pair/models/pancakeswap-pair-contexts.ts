import { PancakeswapPairSettings } from './pancakeswap-pair-settings';

export interface PancakeswapPairContext {
  fromTokenContractAddress: string;
  toTokenContractAddress: string;
  ethereumAddress: string;
  settings?: PancakeswapPairSettings | undefined;
}
