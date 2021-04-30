import { PancakeswapError } from '../..';
import { ErrorCodes } from './error-codes';

describe('Pancakeswap', () => {
  const message = 'message_error';
  const code = ErrorCodes.canNotFindChainId;
  const pankecakeswapError = new PancakeswapError(message, code);

  it('should have the correct name on error', () => {
    expect(pankecakeswapError.name).toEqual('PancakeswapError');
  });

  it('should have the correct code on error', () => {
    expect(pankecakeswapError.code).toEqual(code);
  });

  it('should have the correct message on error', () => {
    expect(pankecakeswapError.message).toEqual(message);
  });
});
