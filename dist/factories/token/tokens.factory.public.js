"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokensFactoryPublic = void 0;
const ethers_provider_1 = require("../../ethers-provider");
const tokens_factory_1 = require("./tokens.factory");
class TokensFactoryPublic extends tokens_factory_1.TokensFactory {
    constructor() {
        super(new ethers_provider_1.EthersProvider());
    }
}
exports.TokensFactoryPublic = TokensFactoryPublic;
