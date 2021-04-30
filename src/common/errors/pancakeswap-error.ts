import { ErrorCodes } from '../..';

export class PancakeswapError extends Error {
  public name = 'PancakeswapError';
  public code: ErrorCodes;
  public message: string;
  constructor(message: string, code: ErrorCodes) {
    super(message);
    this.message = message;
    this.code = code;
  }
}
