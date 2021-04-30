import { ErrorCodes, PancakeswapError } from '../..';
import { MOCKBAT } from '../../mocks/bat-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';
import { MOCKUNI } from '../../mocks/uni-token.mock';
import { PancakeswapPairContext } from './models/pancakeswap-pair-contexts';
import { PancakeswapPair } from './pancakeswap-pair';

describe('PancakeswapPair', () => {
  it('should throw if no fromTokenContractAddress is passed in', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {};
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        'Must have a `fromTokenContractAddress` on the context',
        ErrorCodes.fromTokenContractAddressRequired
      )
    );
  });

  it('should throw if fromTokenContractAddress is invalid address', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: '1',
    };
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        '`fromTokenContractAddress` is not a valid contract address',
        ErrorCodes.fromTokenContractAddressNotValid
      )
    );
  });

  it('should throw if no toTokenContractAddress is passed in', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: MOCKBAT().contractAddress,
    };
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        'Must have a `toTokenContractAddress` on the context',
        ErrorCodes.toTokenContractAddressRequired
      )
    );
  });

  it('should throw if toTokenContractAddress is invalid address', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: MOCKBAT().contractAddress,
      toTokenContractAddress: '1',
    };
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        '`toTokenContractAddress` is not a valid contract address',
        ErrorCodes.toTokenContractAddressNotValid
      )
    );
  });

  it('should throw if no ethereumAddress is passed in', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: MOCKBAT().contractAddress,
      toTokenContractAddress: MOCKUNI().contractAddress,
    };
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        'Must have a `ethereumAddress` on the context',
        ErrorCodes.ethereumAddressRequired
      )
    );
  });

  it('should throw if ethereumAddress is invalid address', () => {
    // @ts-ignore
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: MOCKBAT().contractAddress,
      toTokenContractAddress: MOCKUNI().contractAddress,
      ethereumAddress: '1',
    };
    expect(() => new PancakeswapPair(context)).toThrowError(
      new PancakeswapError(
        '`ethereumAddress` is not a valid address',
        ErrorCodes.ethereumAddressNotValid
      )
    );
  });

  it('should create ethers provider', () => {
    const context: PancakeswapPairContext = {
      fromTokenContractAddress: MOCKBAT().contractAddress,
      toTokenContractAddress: MOCKUNI().contractAddress,
      ethereumAddress: MockEthereumAddress(),
    };

    const pancakeswapPair = new PancakeswapPair(context);

    //@ts-ignore
    expect(typeof pancakeswapPair._ethersProvider).not.toBeUndefined();
  });

  describe('createFactory', () => {
    it('should create a pancakeswap pair factory', async () => {
      const context: PancakeswapPairContext = {
        fromTokenContractAddress: MOCKBAT().contractAddress,
        toTokenContractAddress: MOCKUNI().contractAddress,
        ethereumAddress: MockEthereumAddress(),
      };

      const pancakeswapPair = new PancakeswapPair(context);
      const factory = await pancakeswapPair.createFactory();
      expect(factory.toToken).toEqual(MOCKUNI());
      expect(factory.fromToken).toEqual(MOCKBAT());
    });
  });
});
