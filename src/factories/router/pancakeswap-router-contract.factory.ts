import { BigNumberish, BytesLike } from 'ethers';
import { ContractContext as RouterContractContext } from '../../ABI/types/pancakeswap-router';
import { ContractContext } from '../../common/contract-context';
import { EthersProvider } from '../../ethers-provider';

export class PancakeswapRouterContractFactory {
  private _pancakeswapRouterContract = this._ethersProvider.getContract<RouterContractContext>(
    JSON.stringify(ContractContext.routerAbi),
    ContractContext.routerAddress
  );

  constructor(private _ethersProvider: EthersProvider) {}

  public addLiquidity(
    tokenA: string,
    tokenB: string,
    amountADesired: BigNumberish,
    amountBDesired: BigNumberish,
    amountAMin: BigNumberish,
    amountBMin: BigNumberish,
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'addLiquidity',
      [
        tokenA,
        tokenB,
        amountADesired,
        amountBDesired,
        amountAMin,
        amountBMin,
        to,
        deadline,
      ]
    );
  }

  public addLiquidityBNB(
    token: string,
    amountTokenDesired: BigNumberish,
    amountTokenMin: BigNumberish,
    amountBNBMin: BigNumberish,
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'addLiquidityBNB',
      [token, amountTokenDesired, amountTokenMin, amountBNBMin, to, deadline]
    );
  }

  public async factory(): Promise<string> {
    return await this._pancakeswapRouterContract.factory();
  }

  public async getAmountsOut(
    amountIn: BigNumberish,
    path: string[]
  ): Promise<string[]> {
    const amounts = await this._pancakeswapRouterContract.getAmountsOut(
      amountIn,
      path
    );
    return amounts.map((c) => c.toHexString());
  }

  public async quote(
    amountA: BigNumberish,
    reserveA: BigNumberish,
    reserveB: BigNumberish
  ): Promise<string> {
    return (
      await this._pancakeswapRouterContract.quote(amountA, reserveA, reserveB)
    ).toHexString();
  }

  public removeLiquidity(
    tokenA: string,
    tokenB: string,
    liquidity: BigNumberish,
    amountAMin: BigNumberish,
    amountBMin: BigNumberish,
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidity',
      [tokenA, tokenB, liquidity, amountAMin, amountBMin, to, deadline]
    );
  }

  public removeLiquidityBNB(
    token: string,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountBNBMin: BigNumberish,
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidity',
      [token, liquidity, amountTokenMin, amountBNBMin, to, deadline]
    );
  }

  public removeLiquidityBNBSupportingFeeOnTransferTokens(
    token: string,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountBNBMin: BigNumberish,
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidityBNBSupportingFeeOnTransferTokens',
      [token, liquidity, amountTokenMin, amountBNBMin, to, deadline]
    );
  }

  public removeLiquidityBNBWithPermit(
    token: string,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountBNBMin: BigNumberish,
    to: string,
    deadline: BigNumberish,
    approveMax: boolean,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidityBNBWithPermit',
      [
        token,
        liquidity,
        amountTokenMin,
        amountBNBMin,
        to,
        deadline,
        approveMax,
        v,
        r,
        s,
      ]
    );
  }

  public removeLiquidityBNBWithPermitSupportingFeeOnTransferTokens(
    token: string,
    liquidity: BigNumberish,
    amountTokenMin: BigNumberish,
    amountBNBMin: BigNumberish,
    to: string,
    deadline: BigNumberish,
    approveMax: boolean,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidityBNBWithPermitSupportingFeeOnTransferTokens',
      [
        token,
        liquidity,
        amountTokenMin,
        amountBNBMin,
        to,
        deadline,
        approveMax,
        v,
        r,
        s,
      ]
    );
  }

  public removeLiquidityWithPermit(
    tokenA: string,
    tokenB: string,
    liquidity: BigNumberish,
    amountAMin: BigNumberish,
    amountBMin: BigNumberish,
    to: string,
    deadline: BigNumberish,
    approveMax: boolean,
    v: BigNumberish,
    r: BytesLike,
    s: BytesLike
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'removeLiquidityWithPermit',
      [
        tokenA,
        tokenB,
        liquidity,
        amountAMin,
        amountBMin,
        to,
        deadline,
        approveMax,
        v,
        r,
        s,
      ]
    );
  }

  public swapExactBNBForTokens(
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactBNBForTokens',
      [amountOutMin, path, to, deadline]
    );
  }

  public swapBNBForExactTokens(
    amountOut: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapBNBForExactTokens',
      [amountOut, path, to, deadline]
    );
  }

  public swapExactBNBForTokensSupportingFeeOnTransferTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactBNBForTokensSupportingFeeOnTransferTokens',
      [amountIn, amountOutMin, path, to, deadline]
    );
  }

  public swapExactTokensForBNB(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactTokensForBNB',
      [amountIn, amountOutMin, path, to, deadline]
    );
  }

  public swapTokensForExactBNB(
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapTokensForExactBNB',
      [amountOut, amountInMax, path, to, deadline]
    );
  }

  public swapExactTokensForBNBSupportingFeeOnTransferTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactTokensForBNBSupportingFeeOnTransferTokens',
      [amountIn, amountOutMin, path, to, deadline]
    );
  }

  public swapExactTokensForTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactTokensForTokens',
      [amountIn, amountOutMin, path, to, deadline]
    );
  }

  public swapTokensForExactTokens(
    amountOut: BigNumberish,
    amountInMax: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapTokensForExactTokens',
      [amountOut, amountInMax, path, to, deadline]
    );
  }

  public swapExactTokensForTokensSupportingFeeOnTransferTokens(
    amountIn: BigNumberish,
    amountOutMin: BigNumberish,
    path: string[],
    to: string,
    deadline: BigNumberish
  ): string {
    return this._pancakeswapRouterContract.interface.encodeFunctionData(
      'swapExactTokensForTokensSupportingFeeOnTransferTokens',
      [amountIn, amountOutMin, path, to, deadline]
    );
  }
}
