"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTradePath = void 0;
const trade_path_1 = require("../../enums/trade-path");
const bnb_1 = require("../tokens/bnb");
function getTradePath(fromToken, toToken) {
    if (fromToken.contractAddress === bnb_1.BNB.token().contractAddress) {
        return trade_path_1.TradePath.ethToErc20;
    }
    if (toToken.contractAddress === bnb_1.BNB.token().contractAddress) {
        return trade_path_1.TradePath.erc20ToEth;
    }
    return trade_path_1.TradePath.erc20ToErc20;
}
exports.getTradePath = getTradePath;
