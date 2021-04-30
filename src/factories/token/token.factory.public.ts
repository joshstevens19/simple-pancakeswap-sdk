import { EthersProvider } from '../../ethers-provider';
import { TokenFactory } from './token.factory';

export class TokenFactoryPublic extends TokenFactory {
  constructor(tokenContractAddress: string) {
    super(tokenContractAddress, new EthersProvider());
  }
}
