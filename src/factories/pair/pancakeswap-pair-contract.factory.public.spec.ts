import { isHexString } from 'ethers/lib/utils';
import { BNB, PancakeswapPairContractFactoryPublic } from '../..';
import { MOCKBAT } from '../../mocks/bat-token.mock';

describe('PancakeswapPairContractFactoryPublic', () => {
  const pancakeswapPairContractFactoryPublic = new PancakeswapPairContractFactoryPublic();

  it('allPairs', async () => {
    const result = await pancakeswapPairContractFactoryPublic.allPairs('0x01');
    expect(result).toEqual('0x0eD7e52944161450477ee417DE9Cd3a859b14fD0');
  });

  it('allPairsLength', async () => {
    const result = await pancakeswapPairContractFactoryPublic.allPairsLength();
    expect(isHexString(result)).toEqual(true);
  });

  it('createPair', () => {
    const result = pancakeswapPairContractFactoryPublic.createPair(
      MOCKBAT().contractAddress,
      BNB.token().contractAddress
    );
    expect(result).toEqual(
      '0xc9c65396000000000000000000000000101d82428437127bf1608f699cd651e6abf9766e000000000000000000000000bb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c'
    );
  });

  it('feeTo', async () => {
    const result = await pancakeswapPairContractFactoryPublic.feeTo();
    expect(isHexString(result)).toEqual(true);
  });

  it('feeToSetter', async () => {
    const result = await pancakeswapPairContractFactoryPublic.feeToSetter();
    expect(isHexString(result)).toEqual(true);
  });

  it('getPair', async () => {
    const result = await pancakeswapPairContractFactoryPublic.getPair(
      BNB.token().contractAddress,
      MOCKBAT().contractAddress
    );
    expect(result).toEqual('0xD72AE03Be5ce45bB6FdFE0AA0D81d7eef709dCC3');
  });

  it('setFeeTo', async () => {
    const result = await pancakeswapPairContractFactoryPublic.setFeeTo(
      '0x05B0c1D8839eF3a989B33B6b63D3aA96cB7Ec142'
    );
    expect(result).toEqual(
      '0xf46901ed00000000000000000000000005b0c1d8839ef3a989b33b6b63d3aa96cb7ec142'
    );
  });

  it('setFeeToSetter', async () => {
    const result = await pancakeswapPairContractFactoryPublic.setFeeToSetter(
      '0x05B0c1D8839eF3a989B33B6b63D3aA96cB7Ec142'
    );
    expect(result).toEqual(
      '0xa2e74af600000000000000000000000005b0c1d8839ef3a989b33b6b63d3aa96cb7ec142'
    );
  });
});
