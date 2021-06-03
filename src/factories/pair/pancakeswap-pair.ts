import { ErrorCodes } from '../../common/errors/error-codes';
import { PancakeswapError } from '../../common/errors/pancakeswap-error';
import { isAddress } from '../../common/utils/is-address';
import { EthersProvider } from '../../ethers-provider';
import { TokensFactory } from '../token/tokens.factory';
import { PancakeswapPairContext } from './models/pancakeswap-pair-contexts';
import { PancakeswapPairFactoryContext } from './models/pancakeswap-pair-factory-context';
import { PancakeswapPairSettings } from './models/pancakeswap-pair-settings';
import { PancakeswapPairFactory } from './pancakeswap-pair.factory';

export class PancakeswapPair {
  private _ethersProvider: EthersProvider;

  constructor(private _pancakeswapPairContext: PancakeswapPairContext) {
    if (!this._pancakeswapPairContext.fromTokenContractAddress) {
      throw new PancakeswapError(
        'Must have a `fromTokenContractAddress` on the context',
        ErrorCodes.fromTokenContractAddressRequired
      );
    }

    if (!isAddress(this._pancakeswapPairContext.fromTokenContractAddress)) {
      throw new PancakeswapError(
        '`fromTokenContractAddress` is not a valid contract address',
        ErrorCodes.fromTokenContractAddressNotValid
      );
    }

    if (!this._pancakeswapPairContext.toTokenContractAddress) {
      throw new PancakeswapError(
        'Must have a `toTokenContractAddress` on the context',
        ErrorCodes.toTokenContractAddressRequired
      );
    }

    if (!isAddress(this._pancakeswapPairContext.toTokenContractAddress)) {
      throw new PancakeswapError(
        '`toTokenContractAddress` is not a valid contract address',
        ErrorCodes.toTokenContractAddressNotValid
      );
    }

    if (!this._pancakeswapPairContext.ethereumAddress) {
      throw new PancakeswapError(
        'Must have a `ethereumAddress` on the context',
        ErrorCodes.ethereumAddressRequired
      );
    }

    if (!isAddress(this._pancakeswapPairContext.ethereumAddress)) {
      throw new PancakeswapError(
        '`ethereumAddress` is not a valid address',
        ErrorCodes.ethereumAddressNotValid
      );
    }

    if (this._pancakeswapPairContext.providerUrl) {
      this._ethersProvider = new EthersProvider(
        this._pancakeswapPairContext.providerUrl
      );
      return;
    }

    this._ethersProvider = new EthersProvider();
  }

  /**
   * Create factory to be able to call methods on the 2 tokens
   */
  public async createFactory(): Promise<PancakeswapPairFactory> {
    const tokensFactory = new TokensFactory(this._ethersProvider);
    const tokens = await tokensFactory.getTokens([
      this._pancakeswapPairContext.fromTokenContractAddress,
      this._pancakeswapPairContext.toTokenContractAddress,
    ]);

    const pancakeswapFactoryContext: PancakeswapPairFactoryContext = {
      fromToken: tokens.find(
        (t) =>
          t.contractAddress ===
          this._pancakeswapPairContext.fromTokenContractAddress
      )!,
      toToken: tokens.find(
        (t) =>
          t.contractAddress ===
          this._pancakeswapPairContext.toTokenContractAddress
      )!,
      ethereumAddress: this._pancakeswapPairContext.ethereumAddress,
      settings:
        this._pancakeswapPairContext.settings || new PancakeswapPairSettings(),
      ethersProvider: this._ethersProvider,
    };

    return new PancakeswapPairFactory(pancakeswapFactoryContext);
  }
}
