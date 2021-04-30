import { Token } from '../factories/token/models/token';

export function MOCKUNI(): Token {
  return {
    chainId: 56,
    contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    decimals: 18,
    symbol: 'UNI',
    name: 'Uniswap',
  };
}
