import { EthersProvider } from '../../ethers-provider';
import { TokensFactory } from './tokens.factory';

export class TokensFactoryPublic extends TokensFactory {
  constructor() {
    super(new EthersProvider());
  }
}
