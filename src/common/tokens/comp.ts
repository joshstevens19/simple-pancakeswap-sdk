import { ChainId } from '../../enums/chain-id';

/**
 * COMP token context
 */
export class COMP {
  /**
   * Get COMP token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x52ce071bd9b1c4b00a0b92d298c512478cad67e8',
      decimals: 18,
      symbol: 'COMP',
      name: 'Compound',
    };
  }
}
