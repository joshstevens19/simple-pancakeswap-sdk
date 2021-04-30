import BigNumber from 'bignumber.js';
import { BNB, ErrorCodes, PancakeswapError } from '../..';
import { EthersProvider } from '../../ethers-provider';
import { MOCKBAT } from '../../mocks/bat-token.mock';
import { MOCKUNI } from '../../mocks/uni-token.mock';
import { PancakeswapRouterFactory } from './pancakeswap-router.factory';

describe('PancakeswapRouterFactory', () => {
  const ethersProvider = new EthersProvider();

  describe('erc20 > erc20', () => {
    const fromToken = MOCKBAT();
    const toToken = MOCKUNI();

    const pancakeswapRouterFactory = new PancakeswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider
    );

    describe('getAllPossibleRoutes', () => {
      it('should get all possible routes', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes (in this case return nothing as there is no direct route)', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 0).toEqual(true);
      });
    });

    describe('getAllPossibleRoutesWithQuotes', () => {
      it('should get all possible routes with quote', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes (in this case return nothing as there is no direct route)', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length === 0).toEqual(true);
      });
    });

    describe('findBestRoute', () => {
      it('should find best route', async () => {
        const result = await pancakeswapRouterFactory.findBestRoute(
          new BigNumber(100)
        );
        expect(result.bestRouteQuote.routeText).toEqual('BAT > WBNB > UNI');
      });

      it('should throw an error as there is no best route with disableMultihops turned on', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        await expect(
          factory.findBestRoute(new BigNumber(100))
        ).rejects.toThrowError(
          new PancakeswapError(
            `No routes found for ${fromToken.contractAddress} > ${toToken.contractAddress}`,
            ErrorCodes.noRoutesFound
          )
        );
      });
    });
  });

  describe('erc20 > bnb', () => {
    const fromToken = MOCKBAT();
    const toToken = BNB.token();

    const pancakeswapRouterFactory = new PancakeswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider
    );

    describe('getAllPossibleRoutes', () => {
      it('should get all possible routes', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 1).toEqual(true);
        expect(result[0][0]).toEqual(fromToken);
        expect(result[0][1]).toEqual(toToken);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(false);
      });
    });

    describe('getAllPossibleRoutesWithQuotes', () => {
      it('should get all possible routes with quote', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(
          result.filter((c) => c.routePathArray.length > 2).length > 0
        ).toEqual(false);
      });
    });

    describe('findBestRoute', () => {
      it('should find best route', async () => {
        const result = await pancakeswapRouterFactory.findBestRoute(
          new BigNumber(100)
        );
        expect(result.bestRouteQuote.routeText).toEqual('BAT > WBNB');
      });

      it('should return best route', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.findBestRoute(new BigNumber(100));

        expect(result.bestRouteQuote.routeText).toEqual('BAT > WBNB');
        expect(
          result.triedRoutesQuote.filter((c) => c.routePathArray.length > 2)
            .length > 0
        ).toEqual(false);
      });
    });
  });

  describe('eth > erc20', () => {
    const fromToken = BNB.token();
    const toToken = MOCKBAT();

    const pancakeswapRouterFactory = new PancakeswapRouterFactory(
      fromToken,
      toToken,
      false,
      ethersProvider
    );

    describe('getAllPossibleRoutes', () => {
      it('should get all possible routes', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutes();
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutes();
        expect(result.length === 1).toEqual(true);
        expect(result[0][0]).toEqual(fromToken);
        expect(result[0][1]).toEqual(toToken);
        expect(result.filter((c) => c.length > 2).length > 0).toEqual(false);
      });
    });

    describe('getAllPossibleRoutesWithQuotes', () => {
      it('should get all possible routes with quote', async () => {
        const result = await pancakeswapRouterFactory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(result.length > 0).toEqual(true);
      });

      it('should only return direct routes', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.getAllPossibleRoutesWithQuotes(
          new BigNumber(1)
        );
        expect(
          result.filter((c) => c.routePathArray.length > 2).length > 0
        ).toEqual(false);
      });
    });

    describe('findBestRoute', () => {
      it('should find best route', async () => {
        const result = await pancakeswapRouterFactory.findBestRoute(
          new BigNumber(100)
        );
        expect(result.bestRouteQuote.routeText).toEqual('WBNB > BAT');
      });

      it('should return best route', async () => {
        const factory = new PancakeswapRouterFactory(
          fromToken,
          toToken,
          true,
          ethersProvider
        );

        const result = await factory.findBestRoute(new BigNumber(100));

        expect(result.bestRouteQuote.routeText).toEqual('WBNB > BAT');
        expect(
          result.triedRoutesQuote.filter((c) => c.routePathArray.length > 2)
            .length > 0
        ).toEqual(false);
      });
    });
  });
});
