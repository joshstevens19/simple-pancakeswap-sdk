import { ErrorCodes, PancakeswapError, TokensFactoryPublic } from '../..';
import { MOCKBAT } from '../../mocks/bat-token.mock';
import { MOCKUNI } from '../../mocks/uni-token.mock';

describe('TokensFactoryPublic', () => {
  const tokensFactoryPublic = new TokensFactoryPublic();

  describe('getTokens', () => {
    it('should return both token info', async () => {
      const result = await tokensFactoryPublic.getTokens([
        MOCKBAT().contractAddress,
        MOCKUNI().contractAddress,
      ]);
      expect(result[0]).toEqual(MOCKBAT());
      expect(result[1]).toEqual(MOCKUNI());
    });

    it('should throw error if 1 of the contract addresses are invalid', async () => {
      await expect(
        tokensFactoryPublic.getTokens([
          '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E722c',
          MOCKUNI().contractAddress,
        ])
      ).rejects.toThrowError(
        new PancakeswapError(
          'invalid from or to contract tokens',
          ErrorCodes.invalidFromOrToContractToken
        )
      );
    });
  });
});
