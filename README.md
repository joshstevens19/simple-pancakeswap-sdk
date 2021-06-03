# simple-pancakeswap-sdk

[![npm version](https://badge.fury.io/js/simple-pancakeswap-sdk.svg)](https://badge.fury.io/js/simple-pancakeswap-sdk)
![downloads](https://img.shields.io/npm/dw/simple-pancakeswap-sdk)

Pancakeswap SDK which handles the routes automatically for you, changes in trade quotes reactive subscriptions, exposure to formatted easy to understand information, bringing back the best trade quotes automatically, generating transactions for you and much more. All the pancakeswap logic for you in a simple to easy understand interface to hook straight into your dApp without having to understand how it all works.

Please note this is not owned or maintained by pancakeswap and is a open source package for anyone to use freely.

## Features 🚀

🚀 Queries all the best routes and finds the best price for you
<br/>
🚀 Exposes all the route paths it tried so you can see every detail in how it worked out the best price
<br/>
🚀 Easy subscriptions to get alerted when the price moves or the trade expires
<br/>
🚀 The transaction is generated for you, just fill it with the gas details and send it on its way
<br/>
🚀 All the figures are all formatted for you, no need to worry about timing it back to its decimal formatted place, just render it straight onto your UI
<br/>
🚀 Exposes all the tokens metadata for you, name, symbol, decimals
<br/>
🚀 Uses [multicall](https://github.com/joshstevens19/ethereum-multicall) for every on chain lookup, so even though it could be doing 100 JSONRPC calls it is all put into a few calls meaning it can stay very fast
<br/>
🚀 Tidy bundle size
<br/>
🚀 Fully typescript supported with full generated typings
<br/>
🚀 Other cool internal stuff exposed for your use
<br/>

- 🚀query many tokens in 1 jsonrpc call perfect to get token metadata fast
  <br/>
- 🚀all the pancakeswap contracts are all exposed for your use with full typings if you wanted to call a more bespoke method
  <br/>
- 🚀 and much more!!

# Motivation

As a ethereum dApp developer you try to get your dApp experience as integrated as possible, Ethereum right now is hard to show in a web2.0 world as it is. On top of this as a developer you have to learn all the complex stuff for the blockchain which can take its toll on you.

When I was integrating pancakeswap on our wallet I found that their `SDK` was a bit too much for what I needed. Deepdown from the dApp point of view I only really cared about getting the best price for the user with all the fees related. I also found myself having to write a lot of custom code which I thought could be abstracted away so nobody has to deal with that again. A lot of the pancakeswap features like routing is all done in their client itself which is great but not when you want to use it in a more integrated approach in your on dApp.

My motivation here is to create a library which allows more people to integrate it on their dApp without having to worry about how their amazing software links together. This makes the whole user experience better and allows more developers to get involved integrating pancakeswap in their dApp with a web2.0 experience, and on top of this also growing the usage of it.

# Installing

## npm

```bash
$ npm install simple-pancakeswap-sdk
```

## yarn

```bash
$ yarn add simple-pancakeswap-sdk
```

# SDK guide

## Creating a pancakeswap pair factory

The pancakeswap pair factory is an instance which is joint together with the `from` token and the `to` token, it is all self contained in the instance and exposes easy methods for you to call to start using pancakeswap.

```ts
export class PancakeswapPair {
  constructor(
    private _pancakeswapPairContext: PancakeswapPairContext
)
```

```ts
export interface PancakeswapPairContext {
  fromTokenContractAddress: string;
  toTokenContractAddress: string;
  ethereumAddress: string;
  settings?: PancakeswapPairSettings | undefined;
}
```

```ts
export class PancakeswapPairSettings {
  slippage: number;
  deadlineMinutes: number;
  disableMultihops: boolean;

  constructor(settings?: {
    slippage?: number | undefined;
    deadlineMinutes?: number | undefined;
    disableMultihops?: boolean | undefined;
  }) {
    this.slippage = settings?.slippage || 0.005;
    this.deadlineMinutes = settings?.deadlineMinutes || 20;
    this.disableMultihops = settings?.disableMultihops || false;
  }
}
```

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  // you can pass in the provider url as well if you want
  // providerUrl: YOUR_PROVIDER_URL,
  settings: new PancakeswapPairSettings({
    // if not supplied it will use `0.005` which is 0.5%
    // please pass it in as a full number decimal so 0.7%
    // would be 0.007
    slippage: 0.005,
    // if not supplied it will use 20 a deadline minutes
    deadlineMinutes: 20,
    // if not supplied it will try to use multihops
    // if this is true it will require swaps to direct
    // pairs
    disableMultihops: false,
  }),
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();
```

## Catching error

I know randomly throwing errors with no error codes is a pain when writing dApps. In this package when we throw we have our own custom error. This has error codes you can map to what actually happened to allow your dApp to handle them gracefully.

```ts
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
```

```ts
export enum ErrorCodes {
  noRoutesFound = 1,
  canNotFindChainId = 2,
  tokenChainIdContractDoesNotExist = 3,
  tradePathIsNotSupported = 4,
  generateApproveMaxAllowanceDataNotAllowed = 5,
  fromTokenContractAddressRequired = 6,
  fromTokenContractAddressNotValid = 7,
  toTokenContractAddressRequired = 8,
  toTokenContractAddressNotValid = 9,
  ethereumAddressRequired = 10,
  ethereumAddressNotValid = 11,
  invalidFromOrToContractToken = 13,
}
```

## Pancakeswap pair factory

### toToken

This exposes the to token contract information, like decimals, symbol and name.

```ts
get toToken(): Token
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const toToken = PancakeswapPairFactory.toToken;
console.log(toToken);
// toToken:
{
  chainId: 56,
  contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  decimals: 18,
  symbol: 'UNI',
  name: 'Uniswap',
}
```

### fromToken

This exposes the from token contract information, like decimals, symbol and name.

```ts
get fromToken(): Token
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const fromToken = PancakeswapPairFactory.fromToken;
console.log(fromToken);
// fromToken:
{
  chainId: 56,
  contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  decimals: 18,
  symbol: 'BAT',
  name: 'Basic Attention Token',
}
```

### Trade

This will generate you the trade with all the information you need to show to the user on the dApp. It will find the best route price for you automatically. You will still need to send the transaction if they confirm the swap, we generate the transaction for you but you will still need to estimate the gas and get them to sign and send it on the dApp once they confirm the swap.

It will also return a `hasEnoughAllowance` in the `TradeContext` trade response, if the allowance approved for moving tokens is below the amount sending to the pancakeswap router this will be false if not true. We still return the quote but if this is `false` you need to make sure you send the approval generated data first before being able to do the swap. We advise you check the allowance before you execute the trade which you should do anyway or it will fail onchain. You can use our `hasGotEnoughAllowance` method below to check and also our `generateApproveMaxAllowanceData` to generate the transaction for the user to appove moving of the tokens.

Please note `ROPSTEN`, `RINKEBY`, `GÖRLI` and `KOVAN` will only use `WBNB` as a main currency unlike `MAINNET` which uses everything, so you will get less routes on those testnets.

```ts
async trade(amount: string): Promise<TradeContext>
```

```ts
export interface TradeContext {
  // the amount you requested to convert
  // this will be formatted in readable number
  // so you can render straight out the box
  baseConvertRequest: string;
  // the min amount you will receive taking off the slippage
  // if the price changes below that then
  // the pancakeswap contract will throw
  // this will be formatted in readable number
  // so you can render straight out the box
  minAmountConvertQuote: string;
  // the expected amount you will receive
  // this will be formatted in readable number
  // so you can render straight out the box
  expectedConvertQuote: string;
  // A portion of each trade (0.03%) goes to
  // liquidity providers as a protocol of
  // incentive
  liquidityProviderFee: string;
  // A unix datestamp in when this trade expires
  // if it does expiry while looking at it as long
  // as you are hooked onto `quoteChanged$` that will
  // emit you a new valid quote
  tradeExpires: number;
  // the route path mapped with full token info
  routePathTokenMap: Token[];
  // the route text so you can display it on the dApp easily
  routeText: string;
  // the pure route path, only had the arrays in nothing else
  routePath: string[];
  // full list of every route it tried with the expected convert quotes
  // this will be ordered from the best expected convert quote to worse [0] = best
  allTriedRoutesQuotes: {
    expectedConvertQuote: string;
    routePathArrayTokenMap: Token[];
    routeText: string;
    routePathArray: string[];
  }[];
  // if the allowance approved for moving tokens is below the amount sending to the
  // pancakeswap router this will be false if not true
  // this is not reactive so if you get the trade quote
  // and this returns false but then you do the approval
  // transaction, this old context will still say false
  hasEnoughAllowance: boolean;
  // this is the transaction you need to send first if approve the swap
  // but do not have any allowance for the router to move the token on their
  // behalf. This will be undefined if you do not need to send this transaction.
  // it DOES not estimate gas so you should fill in those blanks before
  // you send it (most dApps have a picker to choose the speed)
  approvalTransaction:
    | {
        to: string;
        from: string;
        data: string;
        value: string;
      }
    | undefined;
  // the from token info
  fromToken: Token;
  // the to token info
  toToken: Token;
  // holds the from balance context
  // this is not reactive so if they top
  // up their account after this is generated
  // then you need to query that yourself
  // or regen the trade info
  fromBalance: {
    // if the balance of the users has enough to perform this trade, does not consider gas prices
    // right now if your doing bnb > ERC20
    hasEnough: boolean;
    // the total balance that user has on the from formatted for you already
    balance: string;
  };
  // this is the transaction you need to send if they approve the swap
  // it DOES not estimate gas so you should fill in those blanks before
  // you send it (most dApps have a picker to choose the speed)
  transaction: {
    to: string;
    from: string;
    data: string;
    value: string;
  };
  // this is a stream which emits if the quote has changed, this will emit
  // not matter what you should listen to this for the source of truth
  // for a reactive dApp. If you dont listen to this the user could end up
  // sending a pancakeswap transaction which price is now out of date
  quoteChanged$: Observable<TradeContext>;
  // when you generate a trade it does more then just return data, it makes
  // sure your data stays in sync with the `quoteChanged$`, so once you have
  // finished with a trade please call this to do a general clear up so we do
  // not keep timeouts and streams running.
  // when you call this it will kill all `quoteChanged$` subscriptions and
  // some watcher timeouts. If you execute a new trade with a new amount on
  // the same instance it will clear it for you.
  destroy: () => void;
}
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}

export enum ChainId {
  BSC = 56,
}
```

#### Usage

#### ERC20 > ERC20

```ts
import { PancakeswapPair,  TradeContext } from 'simple-pancakeswap-sdk';

// the contract address of the token you want to convert FROM
const fromTokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';
// the contract address of the token you want to convert TO
const toTokenContractAddress = '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1';
// the ethereum address of the user using this part of the dApp
const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10
// it will work it all out for you
const trade = await PancakeswapPairFactory.trade('10');

// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '0.014400465273974444',
  expectedConvertQuote: '0.014730394044348867',
  liquidityProviderFee: '0.030000000000000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
     {
       chainId: 56,
       contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
       decimals: 8,
       symbol: 'BAT',
       name: 'Basic Attention Token'
     },
     {
       chainId: 56,
       contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
       decimals: 18,
       symbol: 'DAI',
       name: 'Dai Stablecoin'
     },
     {
       chainId: 56,
       contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
       decimals: 18,
       symbol: 'WBNB',
       name: 'Wrapped Binance token'
     },
     {
       chainId: 56,
       contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
       decimals: 18,
       symbol: 'UNI',
       name: 'Uniswap'
     }
   ],
  routeText: 'BAT > DAI > WBNB > UNI',
  routePath:['0x101d82428437127bf1608f699cd651e6abf9766e', '0x6B175474E89094C44Da98b954EedeAC495271d0F', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2','0xBf5140A22578168FD562DCcF235E5D43A02ce9B1' ],
  allTriedRoutesQuotes: [
      {
        expectedConvertQuote: '0.014730394044348867',
        routePathArrayTokenMap: [
          {
            chainId: 56,
            contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
            symbol: BAT,
            decimals: 8,
            name: 'Basic Attention Token',
          },
          {
            chainId: 56,
            contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            symbol: 'WBNB',
            name: 'Wrapped Binance token',
          },
          {
            chainId: 56,
            contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            symbol: 'UNI',
            decimals: 18,
            name: 'Uniswap',
          },
        ],
        routeText: 'BAT > WBNB > UNI',
        routePathArray: [
          '0x101d82428437127bf1608f699cd651e6abf9766e',
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        ],
      },
      {
        expectedConvertQuote: '0.014606303273323544',
        routePathArrayTokenMap: [
          {
            chainId: 56,
            contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
            symbol: 'BAT',
            decimals: 8,
            name: 'Basic Attention Token',
          },
          {
            chainId: 56,
            contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
            decimals: 18,
            symbol: 'DAI',
            name: 'Dai Stablecoin',
          },
          {
            chainId: 56,
            contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            symbol: 'WBNB',
            name: 'Wrapped Binance token',
          },
          {
            chainId: 56,
            contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            symbol: 'UNI',
            decimals: 18,
            name: 'Uniswap',
          },
        ],
        routeText: 'BAT > DAI > WBNB > UNI',
        routePathArray: [
          '0x101d82428437127bf1608f699cd651e6abf9766e',
          '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        ],
      },
      {
        expectedConvertQuote: '0.013997397994408657',
        routePathArrayTokenMap: [
          {
            chainId: 56,
            contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
            symbol: 'BAT',
            decimals: 8,
            name: 'Basic Attention Token',
          },
          {
            chainId: 56,
            contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
            decimals: 18,
            symbol: 'USDC',
            name: 'USD Coin',
          },
          {
            chainId: 56,
            contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            symbol: 'WBNB',
            name: 'Wrapped Binance token',
          },
          {
            chainId: 56,
            contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            symbol: 'UNI',
            decimals: 18,
            name: 'Uniswap',
          },
        ],
        routeText: 'BAT > USDC > WBNB > UNI',
        routePathArray: [
          '0x101d82428437127bf1608f699cd651e6abf9766e',
          '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        ],
      },
      {
        expectedConvertQuote: '0.000000298264906505',
        routePathArrayTokenMap: [
          {
            chainId: 56,
            contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
            symbol: 'BAT',
            decimals: 8,
            name: 'Basic Attention Token',
          },
          {
            chainId: 56,
            contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
            decimals: 18,
            symbol: 'USDT',
            name: 'Tether USD',
          },
          {
            chainId: 56,
            contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
            decimals: 18,
            symbol: 'WBNB',
            name: 'Wrapped Binance token',
          },
          {
            chainId: 56,
            contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
            symbol: 'UNI',
            decimals: 18,
            name: 'Uniswap',
          },
        ],
        routeText: 'BAT > USDT > WBNB > UNI',
        routePathArray: [
          '0x101d82428437127bf1608f699cd651e6abf9766e',
          '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        ],
      },
  ],
  hasEnoughAllowance: true,
  approvalTransaction: undefined,
  toToken: {
    chainId: 56,
    contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    decimals: 18,
    symbol: 'UNI',
    name: 'Uniswap'
  },
  fromToken: {
    chainId: 56,
    contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
    decimals: 8,
    symbol: 'BAT',
    name: 'Basic Attention Token'
  },
  fromBalance: {
    hasEnough: true,
    balance: "3317.73129463"
  },
  transaction: {
    to: "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
    from: "0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9",
    data:"0x38ed1739000000000000000000000000000000000000000000000000000000003b9aca0000000000000000000000000000000000000000000000000000359578d85cf61000000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd900000000000000000000000000000000000000000000000000000000601683e30000000000000000000000000000000000000000000000000000000000000003000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc20000000000000000000000001985365e9f78359a9b6ad760e32412f4a445e862",
    value: "0x00"
  }
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();
```

#### bnb > ERC20

```ts
import { PancakeswapPair, WBNB, TradeContext } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // use the WBNB import from the lib, bare in mind you should use the
  // network which yours on, so if your on rinkeby you should use
  // WBNB.RINKEBY
  fromTokenContractAddress: WBNB.token().contractAddress,
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10 and
// it will work it all out for you
const trade = await PancakeswapPairFactory.trade('10');


// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '446878.20758208',
  expectedConvertQuote: '449123.82671566',
  liquidityProviderFee: '0.030000000000000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WBNB',
      decimals: 18,
      name: 'Wrapped Binance token',
    },
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      symbol: 'BAT',
      decimals: 8,
      name: 'Basic Attention Token',
    },
  ],
  routeText: 'WBNB > BAT',
  routePath: [
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    '0x101d82428437127bf1608f699cd651e6abf9766e',
  ],
  hasEnoughAllowance: true,
  approvalTransaction: undefined,
  toToken: {
    chainId: 56,
    contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
    symbol: 'BAT',
    decimals: 8,
    name: 'Basic Attention Token',
  },
  fromToken: {
    chainId: 56,
    contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WBNB',
    decimals: 18,
    name: 'Wrapped Binance token',
  },
  fromBalance: {
    hasEnough: false,
    balance: '0.008474677789598637',
  },
  transaction: {
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
    data:
      '0x7ff36ab5000000000000000000000000000000000000000000000000000028a4b1ae9cc00000000000000000000000000000000000000000000000000000000000000080000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd90000000000000000000000000000000000000000000000000000000060168ee30000000000000000000000000000000000000000000000000000000000000002000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b',
    value: '0x8ac7230489e80000',
  },
  allTriedRoutesQuotes: [
    {
      expectedConvertQuote: '449123.82671566',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446400.4834047',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446400.4834047',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446356.68778218',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446356.68778218',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446345.24608428',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '446345.24608428',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '347402.73288796',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '346246.52439964',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '345845.48248206',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153353.27776886',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153171.51955671',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '153099.84287111',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '10090.42827381',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '10090.42827381',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > DAI > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '176.25846115',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '176.25846115',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > USDC > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > DAI > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > COMP > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
    {
      expectedConvertQuote: '0.00167195',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
      ],
      routeText: 'WBNB > USDC > USDT > BAT',
      routePathArray: [
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x101d82428437127bf1608f699cd651e6abf9766e',
      ],
    },
  ],
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();

```

#### ERC20 > bnb

```ts
import { PancakeswapPair, WBNB, TradeContext } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // use the WBNB import from the lib, bare in mind you should use the
  // network which yours on, so if your on rinkeby you should use
  // WBNB.RINKEBY
  toTokenContractAddress: WBNB.token().contractAddress,
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

// the amount is the proper entered amount
// so if they enter 10 pass in 10
// it will work it all out for you
const trade = await PancakeswapPairFactory.trade('10');

// subscribe to quote changes
trade.quoteChanged$.subscribe((value: TradeContext) => {
  // value will hold the same info as below but obviously with
  // the new trade info.
});

console.log(trade);
{
  baseConvertRequest: '10',
  minAmountConvertQuote: '0.00022040807282109',
  expectedConvertQuote: '0.00022151807282109',
  liquidityProviderFee: '0.03000000',
  tradeExpires: 1612189240,
  routePathTokenMap: [
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      symbol: 'BAT',
      decimals: 8,
      name: 'Basic Attention Token',
    },
    {
      chainId: 56,
      contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    },
    {
      chainId: 56,
      contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
      decimals: 18,
      symbol: 'COMP',
      name: 'Compound',
    },
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      symbol: 'WBNB',
      decimals: 18,
      name: 'Wrapped Binance token',
    },
  ],
  routeText: 'BAT > DAI > COMP > WBNB',
  routePath: [
    '0x101d82428437127bf1608f699cd651e6abf9766e',
    '0x6B175474E89094C44Da98b954EedeAC495271d0F',
    '0xc00e94Cb662C3520282E6f5717214004A7f26888',
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  ],
  allTriedRoutesQuotes: [
    {
      expectedConvertQuote: '0.00022151807282109',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.00022151807282109',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000217400884509221',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216692105524981',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216165414503092',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000216113740987982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > DAI > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000207416610491746',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206879660311982',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000206675889551395',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000201332888879835',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000201332888879835',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDC > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.00000000454541448',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.00000000454541448',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xc00e94Cb662C3520282E6f5717214004A7f26888',
          decimals: 18,
          symbol: 'COMP',
          name: 'Compound',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > COMP > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xc00e94Cb662C3520282E6f5717214004A7f26888',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000004421040886',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000004406314787',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
          decimals: 18,
          symbol: 'DAI',
          name: 'Dai Stablecoin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > DAI > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
    {
      expectedConvertQuote: '0.000000003689610342',
      routePathArrayTokenMap: [
        {
          chainId: 56,
          contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
          symbol: 'BAT',
          decimals: 8,
          name: 'Basic Attention Token',
        },
        {
          chainId: 56,
          contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
          decimals: 18,
          symbol: 'USDT',
          name: 'Tether USD',
        },
        {
          chainId: 56,
          contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
          decimals: 18,
          symbol: 'USDC',
          name: 'USD Coin',
        },
        {
          chainId: 56,
          contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
          symbol: 'WBNB',
          decimals: 18,
          name: 'Wrapped Binance token',
        },
      ],
      routeText: 'BAT > USDT > USDC > WBNB',
      routePathArray: [
        '0x101d82428437127bf1608f699cd651e6abf9766e',
        '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      ],
    },
  ],
  hasEnoughAllowance: true,
  approvalTransaction: undefined,
  toToken: {
    chainId: 56,
    contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
    symbol: 'WBNB',
    decimals: 18,
    name: 'Wrapped Binance token',
  },
  fromToken: {
    chainId: 56,
    contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
    symbol: 'BAT',
    decimals: 8,
    name: 'Basic Attention Token',
  },
  fromBalance: {
    hasEnough: true,
    balance: '3317.73129463',
  },
  transaction: {
    to: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
    from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
    data:
      '0x18cbafe5000000000000000000000000000000000000000000000000000000003b9aca000000000000000000000000000000000000000000000000000000c875c0e2d96200000000000000000000000000000000000000000000000000000000000000a0000000000000000000000000b1e6079212888f0be0cf55874b2eb9d7a5e02cd90000000000000000000000000000000000000000000000000000000060168fe80000000000000000000000000000000000000000000000000000000000000004000000000000000000000000419d0d8bdd9af5e606ae2232ed285aff190e711b0000000000000000000000006b175474e89094c44da98b954eedeac495271d0f000000000000000000000000c00e94cb662c3520282e6f5717214004a7f26888000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    value: '0x00',
  },
}

// once done with trade aka they have sent it and you don't need it anymore call
trade.destroy();
```

## Approval transaction

Please note when you do your trade if `approvalTransaction` is defined the user has not enough allowance to perform this trade aka the router can not move on behalf of the user. This will generate the transaction for the approval of moving tokens for the user. This uses the max hex possible which means they will not have to do this again if they want to swap from the SAME from token again later. Please note the approval is per each erc20 token, so if they picked another from token after they swapped they would need to do this again. You have to send the and sign the transaction from within your dApp. Remember when they do not have enough allowance it will mean doing 2 transaction, 1 to extend the allowance using this transaction then the next one to actually execute the trade. On `eth` > `erc20` the `approvalTransaction` will always be undefined it will always throw an error as you only need to do this when moving `erc20 > eth` and `erc20 > erc20`.

### hasGotEnoughAllowance

This method will return `true` or `false` if the user has enough allowance to move the tokens. If you call this when doing `bnb` > `erc20` it will always return true as you only need to check this when moving `erc20 > bnb` and `erc20 > erc20`.

```ts
async hasGotEnoughAllowance(amount: string): Promise<boolean>
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const hasGotEnoughAllowance = await PancakeswapPairFactory.hasGotEnoughAllowance(
  '10'
);
console.log(hasGotEnoughAllowance);
true;
```

### allowance

This method will return the allowance the user has to move tokens from the from token they have picked. This is always returned as a hex and is not formatted for you. If you call this when doing `bnb` > `erc20` it will always return the max hex as you only need to check this when moving `erc20 > bnb` and `erc20 > erc20`.

```ts
async allowance(): Promise<string>
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const allowance = await PancakeswapPairFactory.allowance();
console.log(allowance);
// '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### generateApproveMaxAllowanceData

**NOTE** We advise using the `approvalTransaction` property on `TradeContext` then manually doing this.

This method will generate the transaction for the approval of moving tokens for the user. This uses the max hex possible which means they will not have to do this again if they want to swap from the SAME from token again later. Please note the approval is per each erc20 token, so if they picked another from token after they swapped they would need to do this again. You have to send the and sign the transaction from within your dApp. Remember when they do not have enough allowance it will mean doing 2 transaction, 1 to extend the allowance using this transaction then the next one to actually execute the trade. If you call this when doing `bnb` > `erc20` it will always throw an error as you only need to do this when moving `erc20 > bnb` and `erc20 > erc20`.

```ts
async generateApproveMaxAllowanceData(): Promise<Transaction>
```

```ts
export interface Transaction {
  to: string;
  from: string;
  data: string;
  value: string;
}
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

// the contract address of the token you want to convert FROM
const fromTokenContractAddress = '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1';
// the contract address of the token you want to convert TO
const toTokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';
// the ethereum address of the user using this part of the dApp
const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const transaction = await PancakeswapPairFactory.generateApproveMaxAllowanceData();
console.log(transaction);
{
  to: '0x101d82428437127bf1608f699cd651e6abf9766e',
  from: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
  data:
   '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
  value: '0x00'
}
```

### findBestRoute

This method will return you the best route for the amount you want to trade.

```ts
async findBestRoute(amountToTrade: string): Promise<RouteQuote>
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const bestRoute = await PancakeswapPairFactory.findBestRoute('10');
console.log(bestRoute);
{
  expectedConvertQuote: "0.014634280991384697",
  routePathArrayTokenMap: [
      {
        chainId: 56,
        contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
        decimals: 8,
        symbol: 'BAT',
        name: 'Basic Attention Token'
      },
      {
        chainId: 56,
        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
        symbol: 'DAI',
        name: 'Dai Stablecoin',
      },
     {
       chainId: 56,
       contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
       decimals: 18,
       symbol: 'WBNB',
       name: 'Wrapped Binance token'
     },
     { chainId: 56,
       contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
       decimals: 18,
       symbol: 'UNI',
       name: 'Uniswap'
      }
    ],
  routeText: 'BAT > WBNB > UNI',
  routePathArray: ['0x101d82428437127bf1608f699cd651e6abf9766e', '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2' '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1']
}
```

### findAllPossibleRoutesWithQuote

This method will return you all the possible routes with quotes ordered by the best quote first (index 0).

```ts
async findAllPossibleRoutesWithQuote(amountToTrade: string): Promise<RouteQuote[]>
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const allPossibleRoutes = await PancakeswapPairFactory.findAllPossibleRoutesWithQuote(
  '10'
);
console.log(allPossibleRoutes);
[
  {
    expectedConvertQuote: '0.014634280991384697',
    routePathArrayTokenMap: [
      {
        chainId: 56,
        contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
        decimals: 8,
        symbol: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        chainId: 56,
        contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
        decimals: 18,
        symbol: 'DAI',
        name: 'Dai Stablecoin',
      },
      {
        chainId: 56,
        contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
        symbol: 'WBNB',
        name: 'Wrapped Binance token',
      },
      {
        chainId: 56,
        contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        decimals: 18,
        symbol: 'UNI',
        name: 'Uniswap',
      },
    ],
    routeText: 'BAT > DAI > WBNB > UNI',
    routePathArray: [
      '0x101d82428437127bf1608f699cd651e6abf9766e',
      '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    ],
  },
  {
    expectedConvertQuote: '0.014506490902564688',
    routePathArrayTokenMap: [
      {
        chainId: 56,
        contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
        decimals: 8,
        symbol: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        chainId: 56,
        contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
        symbol: 'WBNB',
        name: 'Wrapped Binance token',
      },
      {
        chainId: 56,
        contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        decimals: 18,
        symbol: 'UNI',
        name: 'Uniswap',
      },
    ],
    routeText: 'BAT > WBNB > UNI',
    routePathArray: [
      '0x101d82428437127bf1608f699cd651e6abf9766e',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    ],
  },
  {
    expectedConvertQuote: '0.011506490902564688',
    routePathArrayTokenMap: [
      {
        chainId: 56,
        contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
        decimals: 8,
        symbol: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        chainId: 56,
        contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
        decimals: 18,
        symbol: 'USDC',
        name: 'USD Coin',
      },
      {
        chainId: 56,
        contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
        symbol: 'WBNB',
        name: 'Wrapped Binance token',
      },
      {
        chainId: 56,
        contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        decimals: 18,
        symbol: 'UNI',
        name: 'Uniswap',
      },
    ],
    routeText: 'BAT > USDC > WBNB > UNI',
    routePathArray: [
      '0x101d82428437127bf1608f699cd651e6abf9766e',
      '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    ],
  },
  {
    expectedConvertQuote: '0.000000291402712857',
    routePathArrayTokenMap: [
      {
        chainId: 56,
        contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
        decimals: 8,
        symbol: 'BAT',
        name: 'Basic Attention Token',
      },
      {
        chainId: 56,
        contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
        decimals: 18,
        symbol: 'USDT',
        name: 'Tether USD',
      },
      {
        chainId: 56,
        contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
        decimals: 18,
        symbol: 'WBNB',
        name: 'Wrapped Binance token',
      },
      {
        chainId: 56,
        contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
        decimals: 18,
        symbol: 'UNI',
        name: 'Uniswap',
      },
    ],
    routeText: 'BAT > USDT > WBNB > UNI',
    routePathArray: [
      '0x101d82428437127bf1608f699cd651e6abf9766e',
      '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    ],
  },
];
```

### findAllPossibleRoutes

This method will return you the all the possible routes you can take when trading.

```ts
async findAllPossibleRoutes(): Promise<Token[][]>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

const pancakeswapPair = new PancakeswapPair({
  // the contract address of the token you want to convert FROM
  fromTokenContractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
  // the contract address of the token you want to convert TO
  toTokenContractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  // the ethereum address of the user using this part of the dApp
  ethereumAddress: '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9',
});

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

const allRoutes = await PancakeswapPairFactory.findAllPossibleRoutes();
console.log(allRoutes);
[
  [
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      decimals: 8,
      symbol: 'BAT',
      name: 'Basic Attention Token',
    },
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped Binance token',
    },
    {
      chainId: 56,
      contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      decimals: 18,
      symbol: 'UNI',
      name: 'Uniswap',
    },
  ],
  [
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      decimals: 8,
      symbol: 'BAT',
      name: 'Basic Attention Token',
    },
    {
      chainId: 56,
      contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 18,
      symbol: 'USDT',
      name: 'Tether USD',
    },
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped Binance token',
    },
    {
      chainId: 56,
      contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      decimals: 18,
      symbol: 'UNI',
      name: 'Uniswap',
    },
  ],
  [
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      decimals: 8,
      symbol: 'BAT',
      name: 'Basic Attention Token',
    },
    {
      chainId: 56,
      contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      decimals: 18,
      symbol: 'USDC',
      name: 'USD Coin',
    },
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped Binance token',
    },
    {
      chainId: 56,
      contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      decimals: 18,
      symbol: 'UNI',
      name: 'Uniswap',
    },
  ],
  [
    {
      chainId: 56,
      contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
      decimals: 8,
      symbol: 'BAT',
      name: 'Basic Attention Token',
    },
    {
      chainId: 56,
      contractAddress: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      symbol: 'DAI',
      name: 'Dai Stablecoin',
    },
    {
      chainId: 56,
      contractAddress: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      symbol: 'WBNB',
      name: 'Wrapped Binance token',
    },
    {
      chainId: 56,
      contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
      decimals: 18,
      symbol: 'UNI',
      name: 'Uniswap',
    },
  ],
];
```

## TokenFactoryPublic

Along side the above we also have exposed some helpful erc20 token calls.

### getToken

This method will return you the token information like decimals, name etc.

```ts
async getToken(): Promise<Token>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(
  toTokenContractAddress
);

const token = await tokenFactoryPublic.getToken();
console.log(token);
{
  chainId: 56,
  contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
  decimals: 8,
  symbol: 'BAT',
  name: 'Basic Attention Token',
},
```

### allowance

This method will return the allowance the user has allowed to be able to be moved on his behalf. Pancakeswap needs this allowance to be higher then the amount swapping for it to be able to move the tokens for the user. This is always returned as a hex and not formatted for you.

```ts
async allowance(ethereumAddress: string): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(toTokenContractAddress);

const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const allowance = await tokenFactoryPublic.allowance(ethereumAddress);
console.log(allowance);
// '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### balanceOf

This method will return the balance this user holds of this token. This always returned as a hex and not formatted for you.

```ts
async balanceOf(ethereumAddress: string): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(toTokenContractAddress);

const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const balanceOf = await tokenFactoryPublic.balanceOf(ethereumAddress);
console.log(balanceOf);
// '0x00';
```

### totalSupply

This method will return the total supply of tokens which exist. This always returned as a hex.

```ts
async totalSupply(): Promise<string>
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(toTokenContractAddress);

const totalSupply = await tokenFactoryPublic.totalSupply();
console.log(totalSupply);
// '0x09195731e2ce35eb000000';
```

### generateApproveAllowanceData

This method will generate the data for the approval of being able to move tokens for the user. You have to send the transaction yourself, this only generates the data for you to send.

```ts
generateApproveAllowanceData(spender: string, value: string): string
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(tokenContractAddress);

// the contract address for which you are allowing to move tokens on your behalf
const spender = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';

// the amount you wish to allow them to move, this example just uses the max
// hex. If not each time they do a operation which needs to move tokens then
// it will cost them 2 transactions, 1 to approve the allowance then 1 to actually
// do the contract call to move the tokens.
const value =
  '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const data = tokenFactoryPublic.generateApproveAllowanceData(spender, value);
console.log(data);
// '0x095ea7b30000000000000000000000007a250d5630b4cf539739df2c5dacb4c659f2488dffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
```

### getAllowanceAndBalanceOf

This method will get the allowance and balance for the token in a multicall request. Will return as hex and NOT formatted for you.

```ts
async getAllowanceAndBalanceOf(ethereumAddress: string): Promise<AllowanceAndBalanceOf>
```

```ts
export interface AllowanceAndBalanceOf {
  allowance: string;
  balanceOf: string;
}
```

#### Usage

```ts
import { TokenFactoryPublic } from 'simple-pancakeswap-sdk';

const tokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';

const tokenFactoryPublic = new TokenFactoryPublic(
  tokenContractAddress
);

const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const result = await tokenFactoryPublic.getAllowanceAndBalanceOf(
  ethereumAddress
);
console.log(result);
{
  allowance: '0x2386f01852b720',
  balanceOf: '0x4d3f3832f7'
}
```

## TokensFactoryPublic

Along side the `TokenFactoryPublic` we also have exposed a way to call many contracts at once, this uses `multicall` so its super fast.

### getTokens

This method will return you the tokens information like decimals, name etc.

```ts
async getTokens(tokenContractAddresses: string[]): Promise<Token[]>
```

```ts
export interface Token {
  chainId: ChainId;
  contractAddress: string;
  decimals: number;
  symbol: string;
  name: string;
}
```

#### Usage

```ts
import { TokensFactoryPublic } from 'simple-pancakeswap-sdk';

const tokensFactoryPublic = new TokensFactoryPublic();

const tokens = await tokensFactoryPublic.getTokens([
  '0x101d82428437127bf1608f699cd651e6abf9766e',
  '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
]);
console.log(tokens);
[
  {
    chainId: 56,
    contractAddress: '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1',
    symbol: 'UNI',
    decimals: 18,
    name: 'Uniswap',
  },
  {
    chainId: 56,
    contractAddress: '0x101d82428437127bf1608f699cd651e6abf9766e',
    symbol: 'BAT',
    decimals: 8,
    name: 'Basic Attention Token',
  },
];
```

### Contract calls

Along side this we also expose in here the pancakeswap pair contract calls. Any methods which are state changing will return you the data and you will have to send it. Only use these if your doing any bespoke stuff with pairs. The `PancakeswapPairContractFactoryPublic` is also exposed in the package which you can pass it a chainId or a providerUrl

```ts
export interface PancakeswapPair {
  async allPairs(
    parameter0: BigNumberish,
  ): Promise<string>;

  async allPairsLength(): Promise<string>;

  // state changing
  async createPair(
    tokenA: string,
    tokenB: string,
  ): Promise<string>;

  async feeTo(): Promise<string>;

  async feeToSetter(): Promise<string>;

  async getPair(
    parameter0: string,
    parameter1: string,
  ): Promise<string>;

  // state changing
  async setFeeTo(
    _feeTo: string,
  ): Promise<string>;

  // state changing
  async setFeeToSetter(
    _feeToSetter: string,
  ): Promise<string>;
```

#### Usage

#### In PancakeswapPairFactory

```ts
import { PancakeswapPair } from 'simple-pancakeswap-sdk';

// the contract address of the token you want to convert FROM
const fromTokenContractAddress = '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1';
// the contract address of the token you want to convert TO
const toTokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';
// the ethereum address of the user using this part of the dApp
const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';

const pancakeswapPair = new PancakeswapPair(
  toTokenContractAddress,
  fromTokenContractAddress,
  ethereumAddress
);

// now to create the factory you just do
const pancakeswapPairFactory = await PancakeswapPair.createFactory();

// contract calls our here, this is only for the pancakeswap pair contract https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f#code
PancakeswapPairFactory.contractCalls;
```

#### Using PancakeswapPairContractFactoryPublic on its own

```ts
import { PancakeswapPairContractFactoryPublic } from 'simple-pancakeswap-sdk';

const pancakeswapPairContractFactoryPublic = new PancakeswapPairContractFactoryPublic();

// contract calls our here, this is only for the pancakeswap pair contract https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f#code
PancakeswapPairContractFactoryPublic;
```

### PancakeswapContractFactoryPublic

```ts
async allPairs(parameter0: BigNumberish): Promise<string>;

async allPairsLength(): Promise<string>;

// state changing
acreatePair(tokenA: string, tokenB: string): string;

async getPair(token0: string, token1: string): Promise<string>;
```

### Usage

```ts
import { PancakeswapContractFactoryPublic } from 'simple-pancakeswap-sdk';

const pancakeswapContractFactoryPublic = new PancakeswapContractFactoryPublic();

// contract calls our here https://etherscan.io/address/0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f#code
PancakeswapContractFactoryPublic;
```

### PancakeswapRouterContractFactoryPublic

```ts
// state changing
addLiquidity(
  tokenA: string,
  tokenB: string,
  amountADesired: BigNumberish,
  amountBDesired: BigNumberish,
  amountAMin: BigNumberish,
  amountBMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
addLiquidityETH(
  token: string,
  amountTokenDesired: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

async factory(): Promise<string>;

async getAmountsOut(
  amountIn: BigNumberish,
  path: string[]
): Promise<string[]>;

async quote(
  amountA: BigNumberish,
  reserveA: BigNumberish,
  reserveB: BigNumberish
): Promise<string>;

// state changing
removeLiquidity(
  tokenA: string,
  tokenB: string,
  liquidity: BigNumberish,
  amountAMin: BigNumberish,
  amountBMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETH(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETHSupportingFeeOnTransferTokens(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish
): string;

// state changing
removeLiquidityETHWithPermit(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish,
  approveMax: boolean,
  v: BigNumberish,
  r: BytesLike,
  s: BytesLike
);

// state changing
removeLiquidityETHWithPermitSupportingFeeOnTransferTokens(
  token: string,
  liquidity: BigNumberish,
  amountTokenMin: BigNumberish,
  amountETHMin: BigNumberish,
  to: string,
  deadline: BigNumberish,
  approveMax: boolean,
  v: BigNumberish,
  r: BytesLike,
  s: BytesLike
): string

// state changing
removeLiquidityWithPermit(
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
): string;

// state changing
swapExactETHForTokens(
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapETHForExactTokens(
  amountOut: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapExactETHForTokensSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForETH(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapTokensForExactETH(
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForETHSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapExactTokensForTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string;

// state changing
swapTokensForExactTokens(
  amountOut: BigNumberish,
  amountInMax: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string

// state changing
swapExactTokensForTokensSupportingFeeOnTransferTokens(
  amountIn: BigNumberish,
  amountOutMin: BigNumberish,
  path: string[],
  to: string,
  deadline: BigNumberish
): string
```

### Usage

```ts
import { PancakeswapRouterContractFactoryPublic } from 'simple-pancakeswap-sdk';

const pancakeswapRouterContractFactoryPublic = new PancakeswapRouterContractFactoryPublic();

// contract calls our here https://etherscan.io/address/0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D#code
PancakeswapRouterContractFactoryPublic;
```

## Tests

The whole repo is covered in tests output below:

Test Suites: 21 passed, 21 total
Tests: 133 passed, 133 total
Snapshots: 0 total
Time: 32.287s
Ran all test suites.

## Issues

Please raise any issues in the below link.

https://github.com/joshstevens19/pancakeswap-sdk/issues

## Thanks

This package is brought to you by [Josh Stevens](https://github.com/joshstevens19). My aim is to be able to keep creating these awesome packages to help the Ethereum space grow with easier-to-use tools to allow the learning curve to get involved with blockchain development easier and also making Ethereum ecosystem better. So if you want to help out with that vision and allow me to invest more time into creating cool packages please [sponsor me](https://github.com/sponsors/joshstevens19), every little helps. By sponsoring me, you're supporting me to be able to maintain existing packages, extend existing packages (as Ethereum matures), and allowing me to build more packages for Ethereum due to being able to invest more time into it. Thanks, everyone!
