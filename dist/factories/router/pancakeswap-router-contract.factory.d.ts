import { BigNumberish, BytesLike } from 'ethers';
import { EthersProvider } from '../../ethers-provider';
export declare class PancakeswapRouterContractFactory {
    private _ethersProvider;
    private _pancakeswapRouterContract;
    constructor(_ethersProvider: EthersProvider);
    addLiquidity(tokenA: string, tokenB: string, amountADesired: BigNumberish, amountBDesired: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    addLiquidityETH(token: string, amountTokenDesired: BigNumberish, amountTokenMin: BigNumberish, amountETHMin: BigNumberish, to: string, deadline: BigNumberish): string;
    factory(): Promise<string>;
    getAmountsOut(amountIn: BigNumberish, path: string[]): Promise<string[]>;
    quote(amountA: BigNumberish, reserveA: BigNumberish, reserveB: BigNumberish): Promise<string>;
    removeLiquidity(tokenA: string, tokenB: string, liquidity: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityETH(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountETHMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityETHSupportingFeeOnTransferTokens(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountETHMin: BigNumberish, to: string, deadline: BigNumberish): string;
    removeLiquidityETHWithPermit(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountETHMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(token: string, liquidity: BigNumberish, amountTokenMin: BigNumberish, amountETHMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    removeLiquidityWithPermit(tokenA: string, tokenB: string, liquidity: BigNumberish, amountAMin: BigNumberish, amountBMin: BigNumberish, to: string, deadline: BigNumberish, approveMax: boolean, v: BigNumberish, r: BytesLike, s: BytesLike): string;
    swapExactETHForTokens(amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapETHForExactTokens(amountOut: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactETHForTokensSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForETH(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapTokensForExactETH(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForETHSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapTokensForExactTokens(amountOut: BigNumberish, amountInMax: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
    swapExactTokensForTokensSupportingFeeOnTransferTokens(amountIn: BigNumberish, amountOutMin: BigNumberish, path: string[], to: string, deadline: BigNumberish): string;
}
