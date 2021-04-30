import { TokenFactoryPublic } from '../..';
import { ContractContext } from '../../common/contract-context';
import { MOCKBAT } from '../../mocks/BAT-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';

describe('TokenFactoryPublic', () => {
  const token = MOCKBAT();
  const tokenFactoryPublic = new TokenFactoryPublic(token.contractAddress);

  it('getToken', async () => {
    const result = await tokenFactoryPublic.getToken();
    expect(result).toEqual(token);
  });

  it('allowance', async () => {
    const result = await tokenFactoryPublic.allowance(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('generateApproveAllowanceData', () => {
    const result = tokenFactoryPublic.generateApproveAllowanceData(
      ContractContext.routerAddress,
      '0x05'
    );
    expect(result).toEqual(
      '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024e0000000000000000000000000000000000000000000000000000000000000005'
    );
  });

  it('balanceOf', async () => {
    const result = await tokenFactoryPublic.balanceOf(MockEthereumAddress());
    expect(result).not.toBeUndefined();
  });

  it('totalSupply', async () => {
    const result = await tokenFactoryPublic.totalSupply();
    expect(result).toEqual('0x14adf4b7320334b9000000');
  });

  it('getAllowanceAndBalanceOf', async () => {
    const result = await tokenFactoryPublic.getAllowanceAndBalanceOf(
      MockEthereumAddress()
    );
    expect(result).toEqual({
      allowance: '0x00',
      balanceOf: '0x00',
    });
  });
});
