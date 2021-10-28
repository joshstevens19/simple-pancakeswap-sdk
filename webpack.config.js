const path = require('path');

module.exports = {
  entry: './dist/esm/index.js',
  output: {
    path: path.resolve(__dirname, 'web'),
    filename: 'simplePancakeswapSdk.js',
    library: 'simplePancakeswapSdk',
    libraryTarget: 'umd',
    globalObject: 'this',
    umdNamedDefine: true,
  }
};