import { ContractContext as PairContractContext } from './ABI/types/pancakeswap-pair';
import { ContractContext } from './common/contract-context';
import { EthersProvider } from './ethers-provider';
import { MockEthereumAddress } from './mocks/ethereum-address.mock';

describe('EthersProvider', () => {
  const ethersProvider = new EthersProvider();

  it('getContract', () => {
    const result = ethersProvider.getContract<PairContractContext>(
      JSON.stringify(ContractContext.pairAbi),
      ContractContext.pairAddress
    );

    expect(result).not.toBeUndefined();
  });

  it('balanceOf', () => {
    const result = ethersProvider.balanceOf(MockEthereumAddress());

    expect(result).not.toBeUndefined();
  });
});
