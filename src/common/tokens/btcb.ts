import { ChainId } from '../../enums/chain-id';

/**
 * BTCB token context
 */
export class BTCB {
  /**
   * Get BTCB token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c',
      decimals: 18,
      symbol: 'BTCB',
      name: 'Binance-Peg BTCB Token',
    };
  }
}
