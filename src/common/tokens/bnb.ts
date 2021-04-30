import { ChainId } from '../../enums/chain-id';

/**
 * BNB token context
 */
export class BNB {
  /**
   * Get BNB token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped Binance token',
    };
  }
}
