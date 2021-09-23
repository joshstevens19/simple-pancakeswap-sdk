import { ErrorCodes } from '../..';
export declare class PancakeswapError extends Error {
    name: string;
    code: ErrorCodes;
    message: string;
    constructor(message: string, code: ErrorCodes);
}
