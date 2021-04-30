import { ContractContext } from '../../common/contract-context';
import { EthersProvider } from '../../ethers-provider';
import { MOCKBAT } from '../../mocks/BAT-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';
import { TokenFactory } from './token.factory';

describe('TokenFactory', () => {
  const ethersProvider = new EthersProvider();
  const token = MOCKBAT();

  const tokenFactory = new TokenFactory(token.contractAddress, ethersProvider);

  it('getToken', async () => {
    const result = await tokenFactory.getToken();
    expect(result).toEqual(token);
  });

  it('allowance', async () => {
    const result = await tokenFactory.allowance(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('generateApproveAllowanceData', () => {
    const result = tokenFactory.generateApproveAllowanceData(
      ContractContext.routerAddress,
      '0x05'
    );
    expect(result).toEqual(
      '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e0000000000000000000000000000000000000000000000000000000000000005'
    );
  });

  it('balanceOf', async () => {
    const result = await tokenFactory.balanceOf(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('totalSupply', async () => {
    const result = await tokenFactory.totalSupply();
    expect(result).toEqual('0x14adf4b7320334b9000000');
  });

  it('getAllowanceAndBalanceOf', async () => {
    const result = await tokenFactory.getAllowanceAndBalanceOf(
      MockEthereumAddress()
    );
    expect(result).toEqual({
      allowance: '0x00',
      balanceOf: '0x00',
    });
  });
});
