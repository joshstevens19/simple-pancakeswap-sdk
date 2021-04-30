import { ChainId } from '../../enums/chain-id';

/**
 * DAI token context
 */
export class DAI {
  public static MAINNET() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x26a5dfab467d4f58fb266648cae769503cec9580',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    };
  }

  /**
   * Get DAI token info
   */
  public static token() {
    return {
      chainId: ChainId.BSC,
      contractAddress: '0x26a5dfab467d4f58fb266648cae769503cec9580',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    };
  }
}
