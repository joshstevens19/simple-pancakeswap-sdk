import {
  BNB,
  ErrorCodes,
  PancakeswapError,
  PancakeswapPairFactory,
  PancakeswapPairSettings,
} from '../..';
import { EthersProvider } from '../../ethers-provider';
import { MOCKBAT } from '../../mocks/bat-token.mock';
import { MockEthereumAddress } from '../../mocks/ethereum-address.mock';
import { MOCKUNI } from '../../mocks/uni-token.mock';
import { PancakeswapPairFactoryContext } from './models/pancakeswap-pair-factory-context';

describe('PancakeswapPairFactory', () => {
  const ethersProvider = new EthersProvider();
  describe('erc20 > erc20', () => {
    const pancakeswapPairFactoryContext: PancakeswapPairFactoryContext = {
      fromToken: MOCKBAT(),
      toToken: MOCKUNI(),
      ethereumAddress: MockEthereumAddress(),
      settings: new PancakeswapPairSettings(),
      ethersProvider,
    };

    const pancakeswapPairFactory = new PancakeswapPairFactory(
      pancakeswapPairFactoryContext
    );

    it('`toToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.toToken).toEqual(
        pancakeswapPairFactoryContext.toToken
      );
    });

    it('`fromToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.fromToken).toEqual(
        pancakeswapPairFactoryContext.fromToken
      );
    });

    describe('trade', () => {
      it('should return trade info', async () => {
        const result = await pancakeswapPairFactory.trade('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findBestRoute', () => {
      it('should return the best route', async () => {
        const result = await pancakeswapPairFactory.findBestRoute('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutesWithQuote', () => {
      it('should return all possible routes with quotes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutesWithQuote(
          '1'
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutes', () => {
      it('should return all possible routes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe('hasGotEnoughAllowance', () => {
      xit('should return true if i have enough allowance', async () => {
        const result = await pancakeswapPairFactory.hasGotEnoughAllowance('1');
        expect(result).toEqual(true);
      });

      it('should return false if i do not have enough allowance', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKUNI(),
          toToken: MOCKBAT(),
          ethereumAddress: MockEthereumAddress(),
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.hasGotEnoughAllowance('1');
        expect(result).toEqual(false);
      });
    });

    describe('getAllowanceAndBalanceOfForFromToken', () => {});

    describe('allowance', () => {
      xit('should return more then 0', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKBAT(),
          toToken: MOCKUNI(),
          ethereumAddress: '0x5ab9d116a53ef41063e3eae26a7ebe736720e9ba',
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.allowance();
        expect(result).not.toEqual('0x00');
      });

      it('should return 0 allowance', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKUNI(),
          toToken: MOCKBAT(),
          ethereumAddress: MockEthereumAddress(),
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.allowance();
        expect(result).toEqual('0x00');
      });
    });

    describe('generateApproveMaxAllowanceData', () => {
      it('should generate the approve max allowance data', async () => {
        const result = await pancakeswapPairFactory.generateApproveMaxAllowanceData();
        expect(result).toEqual({
          data:
            '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
          to: '0x101d82428437127bf1608f699cd651e6abf9766e',
          value: '0x00',
        });
      });
    });
  });

  describe('erc20 > eth', () => {
    const pancakeswapPairFactoryContext: PancakeswapPairFactoryContext = {
      fromToken: MOCKBAT(),
      toToken: BNB.token(),
      ethereumAddress: MockEthereumAddress(),
      settings: new PancakeswapPairSettings(),
      ethersProvider,
    };

    const pancakeswapPairFactory = new PancakeswapPairFactory(
      pancakeswapPairFactoryContext
    );

    it('`toToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.toToken).toEqual(
        pancakeswapPairFactoryContext.toToken
      );
    });

    it('`fromToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.fromToken).toEqual(
        pancakeswapPairFactoryContext.fromToken
      );
    });

    describe('trade', () => {
      it('should return trade info', async () => {
        const result = await pancakeswapPairFactory.trade('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findBestRoute', () => {
      it('should return the best route', async () => {
        const result = await pancakeswapPairFactory.findBestRoute('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutesWithQuote', () => {
      it('should return all possible routes with quotes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutesWithQuote(
          '1'
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutes', () => {
      it('should return all possible routes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe('hasGotEnoughAllowance', () => {
      xit('should return true if i have enough allowance', async () => {
        const result = await pancakeswapPairFactory.hasGotEnoughAllowance('1');
        expect(result).toEqual(true);
      });

      it('should return false if i do not have enough allowance', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKUNI(),
          toToken: BNB.token(),
          ethereumAddress: MockEthereumAddress(),
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.hasGotEnoughAllowance('1');
        expect(result).toEqual(false);
      });
    });

    describe('getAllowanceAndBalanceOfForFromToken', () => {});

    describe('allowance', () => {
      xit('should return more then 0', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKBAT(),
          toToken: BNB.token(),
          ethereumAddress: '0x5ab9d116a53ef41063e3eae26a7ebe736720e9ba',
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.allowance();
        expect(result).not.toEqual('0x00');
      });

      it('should return 0 allowance', async () => {
        const factory = new PancakeswapPairFactory({
          fromToken: MOCKUNI(),
          toToken: BNB.token(),
          ethereumAddress: MockEthereumAddress(),
          settings: new PancakeswapPairSettings(),
          ethersProvider,
        });

        const result = await factory.allowance();
        expect(result).toEqual('0x00');
      });
    });

    describe('generateApproveMaxAllowanceData', () => {
      it('should generate the approve max allowance data', async () => {
        const result = await pancakeswapPairFactory.generateApproveMaxAllowanceData();
        expect(result).toEqual({
          data:
            '0x095ea7b300000000000000000000000010ed43c718714eb63d5aa57b78b54704e256024effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
          from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
          to: '0x101d82428437127bf1608f699cd651e6abf9766e',
          value: '0x00',
        });
      });
    });
  });

  describe('eth > erc20', () => {
    const pancakeswapPairFactoryContext: PancakeswapPairFactoryContext = {
      fromToken: BNB.token(),
      toToken: MOCKBAT(),
      ethereumAddress: MockEthereumAddress(),
      settings: new PancakeswapPairSettings(),
      ethersProvider,
    };

    const pancakeswapPairFactory = new PancakeswapPairFactory(
      pancakeswapPairFactoryContext
    );

    it('`toToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.toToken).toEqual(
        pancakeswapPairFactoryContext.toToken
      );
    });

    it('`fromToken` should retun correctly', () => {
      expect(pancakeswapPairFactory.fromToken).toEqual(
        pancakeswapPairFactoryContext.fromToken
      );
    });

    describe('trade', () => {
      it('should return trade info', async () => {
        const result = await pancakeswapPairFactory.trade('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findBestRoute', () => {
      it('should return the best route', async () => {
        const result = await pancakeswapPairFactory.findBestRoute('1');
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutesWithQuote', () => {
      it('should return all possible routes with quotes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutesWithQuote(
          '1'
        );
        expect(result).not.toBeUndefined();
      });
    });

    describe('findAllPossibleRoutes', () => {
      it('should return all possible routes', async () => {
        const result = await pancakeswapPairFactory.findAllPossibleRoutes();
        expect(result).not.toBeUndefined();
      });
    });

    describe('hasGotEnoughAllowance', () => {
      it('should always return true as not allowance needed', async () => {
        const result = await pancakeswapPairFactory.hasGotEnoughAllowance('1');
        expect(result).toEqual(true);
      });
    });

    describe('getAllowanceAndBalanceOfForFromToken', () => {});

    describe('allowance', () => {
      it('should always return max hex', async () => {
        const result = await pancakeswapPairFactory.allowance();
        expect(result).toEqual(
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
        );
      });
    });

    describe('generateApproveMaxAllowanceData', () => {
      it('should generate the approve max allowance data', async () => {
        await expect(
          pancakeswapPairFactory.generateApproveMaxAllowanceData()
        ).rejects.toThrowError(
          new PancakeswapError(
            'You do not need to generate approve pancakeswap allowance when doing eth > erc20',
            ErrorCodes.generateApproveMaxAllowanceDataNotAllowed
          )
        );
      });
    });
  });
});
