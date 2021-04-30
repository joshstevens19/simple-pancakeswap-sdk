import { BigNumberish } from 'ethers';
import { ContractContext as PairContractContext } from '../../ABI/types/pancakeswap-pair';
import { ContractContext } from '../../common/contract-context';
import { EthersProvider } from '../../ethers-provider';

export class PancakeswapPairContractFactory {
  private _pancakeswapPairFactory = this._ethersProvider.getContract<PairContractContext>(
    JSON.stringify(ContractContext.pairAbi),
    ContractContext.pairAddress
  );

  constructor(private _ethersProvider: EthersProvider) {}

  public async allPairs(parameter0: BigNumberish): Promise<string> {
    return await this._pancakeswapPairFactory.allPairs(parameter0);
  }

  public async allPairsLength(): Promise<string> {
    return (await this._pancakeswapPairFactory.allPairsLength()).toHexString();
  }

  public createPair(tokenA: string, tokenB: string): string {
    return this._pancakeswapPairFactory.interface.encodeFunctionData(
      'createPair',
      [tokenA, tokenB]
    );
  }

  public async feeTo(): Promise<string> {
    return await this._pancakeswapPairFactory.feeTo();
  }

  public async feeToSetter(): Promise<string> {
    return await this._pancakeswapPairFactory.feeToSetter();
  }

  public async getPair(
    parameter0: string,
    parameter1: string
  ): Promise<string> {
    return await this._pancakeswapPairFactory.getPair(parameter0, parameter1);
  }

  public async setFeeTo(_feeTo: string): Promise<string> {
    return this._pancakeswapPairFactory.interface.encodeFunctionData(
      'setFeeTo',
      [_feeTo]
    );
  }

  public async setFeeToSetter(_feeToSetter: string): Promise<string> {
    return this._pancakeswapPairFactory.interface.encodeFunctionData(
      'setFeeToSetter',
      [_feeToSetter]
    );
  }
}
