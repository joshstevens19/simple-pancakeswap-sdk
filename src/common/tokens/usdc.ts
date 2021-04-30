import { ChainId } from '../../enums/chain-id';

/**
 * USDC token context
 */
export class USDC {
  /**
   * Get USDC token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d',
      decimals: 18,
      symbol: 'USDC',
      name: 'USD Coin',
    };
  }
}
