import { TradePath } from '../../enums/trade-path';
import { MOCKBAT } from '../../mocks/bat-token.mock';
import { MOCKUNI } from '../../mocks/uni-token.mock';
import { BNB } from '../tokens';
import { getTradePath } from './trade-path';

describe('getTradePath', () => {
  it('should return `TradePath.ethToErc20`', () => {
    const result = getTradePath(BNB.token(), MOCKBAT());
    expect(result).toEqual(TradePath.ethToErc20);
  });

  it('should return `TradePath.erc20ToEth`', () => {
    const result = getTradePath(MOCKBAT(), BNB.token());
    expect(result).toEqual(TradePath.erc20ToEth);
  });

  it('should return `TradePath.erc20ToErc20`', () => {
    const result = getTradePath(MOCKBAT(), MOCKUNI());
    expect(result).toEqual(TradePath.erc20ToErc20);
  });
});
