import { TradePath } from '../../enums/trade-path';
import { Token } from '../../factories/token/models/token';
import { BNB } from '../tokens/bnb';

export function getTradePath(fromToken: Token, toToken: Token): TradePath {
  if (fromToken.contractAddress === BNB.token().contractAddress) {
    return TradePath.ethToErc20;
  }

  if (toToken.contractAddress === BNB.token().contractAddress) {
    return TradePath.erc20ToEth;
  }

  return TradePath.erc20ToErc20;
}
