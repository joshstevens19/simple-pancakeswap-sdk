import { ChainId } from '../../enums/chain-id';

/**
 * USDT token context
 */
export class USDT {
  /**
   * Get USDT token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x55d398326f99059ff775485246999027b3197955',
      decimals: 18,
      symbol: 'USDT',
      name: 'Tether USD',
    };
  }
}
