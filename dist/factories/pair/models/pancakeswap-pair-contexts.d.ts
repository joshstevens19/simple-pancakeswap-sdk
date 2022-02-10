import { PancakeswapPairSettings } from './pancakeswap-pair-settings';
export interface PancakeswapPairContext {
    fromTokenContractAddress: string;
    toTokenContractAddress: string;
    ethereumAddress: string;
    providerUrl?: string | undefined;
    settings?: PancakeswapPairSettings | undefined;
}
