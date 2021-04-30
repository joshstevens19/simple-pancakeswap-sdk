import { BigNumberish } from 'ethers';
import { ContractContext as FactoryContractContext } from '../../ABI/types/pancakeswap-factory';
import { ContractContext } from '../../common/contract-context';
import { EthersProvider } from '../../ethers-provider';

export class PancakeswapContractFactory {
  private _pancakeswapFactoryContract = this._ethersProvider.getContract<FactoryContractContext>(
    JSON.stringify(ContractContext.factoryAbi),
    ContractContext.factoryAddress
  );

  constructor(private _ethersProvider: EthersProvider) {}

  public async allPairs(parameter0: BigNumberish): Promise<string> {
    return await this._pancakeswapFactoryContract.allPairs(parameter0);
  }

  public async allPairsLength(): Promise<string> {
    return (
      await this._pancakeswapFactoryContract.allPairsLength()
    ).toHexString();
  }

  public createPair(tokenA: string, tokenB: string): string {
    return this._pancakeswapFactoryContract.interface.encodeFunctionData(
      'createPair',
      [tokenA, tokenB]
    );
  }

  public async getPair(token0: string, token1: string): Promise<string> {
    return await this._pancakeswapFactoryContract.getPair(token0, token1);
  }

  public async feeTo(): Promise<string> {
    return await this._pancakeswapFactoryContract.feeTo();
  }

  public async feeToSetter(): Promise<string> {
    return await this._pancakeswapFactoryContract.feeToSetter();
  }

  public async setFeeTo(_feeTo: string): Promise<string> {
    return this._pancakeswapFactoryContract.interface.encodeFunctionData(
      'setFeeTo',
      [_feeTo]
    );
  }

  public async setFeeToSetter(_feeToSetter: string): Promise<string> {
    return this._pancakeswapFactoryContract.interface.encodeFunctionData(
      'setFeeToSetter',
      [_feeToSetter]
    );
  }
}
