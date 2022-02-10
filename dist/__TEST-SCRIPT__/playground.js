"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const pancakeswap_pair_settings_1 = require("../factories/pair/models/pancakeswap-pair-settings");
const pancakeswap_pair_1 = require("../factories/pair/pancakeswap-pair");
// BAT - 0x101d82428437127bf1608f699cd651e6abf9766e
// UNI - 0xBf5140A22578168FD562DCcF235E5D43A02ce9B1
// BNB - 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c
const routeTest = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(new Date().getTime());
    const fromTokenContractAddress = '0x101d82428437127bf1608f699cd651e6abf9766e';
    const toTokenContractAddress = '0xBf5140A22578168FD562DCcF235E5D43A02ce9B1';
    const ethereumAddress = '0xB1E6079212888f0bE0cf55874B2EB9d7a5e02cD9';
    const pancakeSwapPair = new pancakeswap_pair_1.PancakeswapPair({
        fromTokenContractAddress,
        toTokenContractAddress,
        ethereumAddress,
        settings: new pancakeswap_pair_settings_1.PancakeswapPairSettings({
            // if not supplied it use `0.005` which is 0.5%;
            // all figures
            slippage: 0.005,
            // if not supplied it will use 20 a deadline minutes
            deadlineMinutes: 20,
            disableMultihops: false,
        }),
    });
    const pancakeSwapPairFactory = yield pancakeSwapPair.createFactory();
    try {
        const trade = yield pancakeSwapPairFactory.trade('10');
        console.log(trade);
        console.log(new Date().getTime());
    }
    catch (error) {
        console.log(error.message);
    }
    process.stdin.resume();
    // console.log(JSON.stringify(trade));
    // const data = await uniswapPairFactory.generateApproveMaxAllowanceData();
    // console.log(data);
    // const toToken = uniswapPairFactory.toToken;
    // console.log(toToken);
    // const fromToken = uniswapPairFactory.fromToken;
    // console.log(fromToken);
    // const tokenContractAddress = '0x419D0d8BdD9aF5e606Ae2232ed285Aff190E711b';
    // const tokenFactoryPublic = new TokenFactoryPublic(
    //   fromTokenContractAddress,
    //   ChainId.BSC
    // );
    // console.log(
    //   await tokenFactoryPublic.getAllowanceAndBalanceOf(ethereumAddress)
    // );
    // // the contract address for which you are allowing to move tokens on your behalf
    // const spender = '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D';
    // // the amount you wish to allow them to move, this example just uses the max
    // // hex. If not each time they do a operation which needs to move tokens then
    // // it will cost them 2 transactions, 1 to approve the allowance then 1 to actually
    // // do the contract call to move the tokens.
    // const value =
    //   '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';
    // const data = tokenFactoryPublic.generateApproveAllowanceData(spender, value);
    // console.log(data);
});
routeTest();
