import { ChainId } from '../../enums/chain-id';

/**
 * BUSD token context
 */
export class BUSD {
  /**
   * Get BUSD token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
      decimals: 18,
      symbol: 'BUSD',
      name: 'Binance-Peg BUSD Token',
    };
  }
}
