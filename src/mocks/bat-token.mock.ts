import { Token } from '../factories/token/models/token';

export function MOCKBAT(): Token {
  return {
    chainId: 56,
    contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
    decimals: 18,
    symbol: 'BAT',
    name: 'Basic Attention Token',
  };
}
