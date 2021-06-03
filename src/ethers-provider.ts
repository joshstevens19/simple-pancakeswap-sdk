import { Contract, ContractInterface, providers } from 'ethers';

export class EthersProvider {
  private _ethersProvider: providers.BaseProvider;
  constructor(providerUrl: string = 'https://bsc-dataseed.binance.org/') {
    this._ethersProvider = new providers.StaticJsonRpcProvider(providerUrl);
  }

  /**
   * Creates a contract instance
   * @param abi The ABI
   * @param contractAddress The contract address
   */
  public getContract<TGeneratedTypedContext>(
    abi: ContractInterface,
    contractAddress: string
  ): TGeneratedTypedContext {
    const contract = new Contract(contractAddress, abi, this._ethersProvider);

    return (contract as unknown) as TGeneratedTypedContext;
  }

  /**
   * Get the network
   */
  public network(): providers.Network {
    return this._ethersProvider.network;
  }

  /**
   * Get the ethers provider
   */
  public get provider(): providers.BaseProvider {
    return this._ethersProvider;
  }

  /**
   * Get eth amount
   * @param ethereumAddress The ethereum address
   */
  public async balanceOf(ethereumAddress: string): Promise<string> {
    return (
      await this._ethersProvider.getBalance(ethereumAddress)
    ).toHexString();
  }
}
