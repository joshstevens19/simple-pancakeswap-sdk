import { Observable as PancakeswapStream } from 'rxjs';
import { RouteQuote } from '../../router/models/route-quote';
import { Token } from '../../token/models/token';
import { Transaction } from './transaction';
export interface TradeContext {
    baseConvertRequest: string;
    minAmountConvertQuote: string;
    expectedConvertQuote: string;
    liquidityProviderFee: string;
    tradeExpires: number;
    routePathTokenMap: Token[];
    routeText: string;
    routePath: string[];
    allTriedRoutesQuotes: RouteQuote[];
    hasEnoughAllowance: boolean;
    approvalTransaction?: Transaction | undefined;
    fromToken: Token;
    toToken: Token;
    fromBalance: {
        hasEnough: boolean;
        balance: string;
    };
    transaction: Transaction;
    quoteChanged$: PancakeswapStream<TradeContext>;
    destroy: () => void;
}
