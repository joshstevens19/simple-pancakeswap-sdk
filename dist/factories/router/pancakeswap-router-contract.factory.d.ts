import { BigNumberish, BytesLike } from 'ethers';
import { EthersProvider } from '../../ethers-provider';
export declare class PancakeswapRouterContractFactory {
    private _ethersProvider;
    private _pancakeswapRouterContract;
    constructor(_ethersProvider: EthersProvider);
    addLiquidity(tokenA: string, tokenB: string, amountADesired: BigNumberish, amountBDesired: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    addLiquidityBNB(token: string, amountTokenDesired: BigNumberish, amountTokenMin: BigNumberish, amountBNBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    factory(): Promise<string>;
    getAmountsOut(amountIn: BigNumberish, path: string[]): Promise<string[]>;
    quote(amountA: BigNumberish, reserveA: BigNumberish, reserveB: BigNumberish): Promise<string>;
    removeLiquidity(tokenA: string, tokenB: string, liquidity: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityBNB(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountBNBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityBNBSupportingFeeOnTransferTokens(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountBNBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityBNBWithPermit(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountBNBMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    removeLiquidityBNBWithPermitSupportingFeeOnTransferTokens(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountBNBMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    removeLiquidityWithPermit(tokenA: string, tokenB: string, liquidity: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    swapExactBNBForTokens(amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapBNBForExactTokens(amountOut: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactBNBForTokensSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForBNB(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapTokensForExactBNB(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForBNBSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapTokensForExactTokens(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
}
