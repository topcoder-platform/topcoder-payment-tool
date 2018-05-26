const path = require('path');
const standardConfigFactory =
  require('topcoder-react-utils/config/webpack/app-production');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const customDefaultConfig = require('./default');

let publicPath = process.env.CDN_URL;
if (publicPath) publicPath += '/static-assets';
else publicPath = '/api/cdn/public/static-assets';

const standardProductionConfig = standardConfigFactory({
  context: path.resolve(__dirname, '../..'),
  entry: {
    main: './src/client',
  },
  keepBuildInfo: Boolean(global.KEEP_BUILD_INFO),
});

const jsxRule = standardProductionConfig.module.rules.find(rule =>
  rule.loader === 'babel-loader');
jsxRule.exclude = [
  /node_modules[\\/](?!appirio-tech.*|topcoder|tc-)/,
  /src[\\/]assets[\\/]fonts/,
  /src[\\/]assets[\\/]images[\\/]dashboard/,
];

standardProductionConfig.plugins.push(new webpack.DefinePlugin({
  PUBLIC_PATH: JSON.stringify(publicPath),
}));

module.exports = webpackMerge.smart(
  standardProductionConfig,
  customDefaultConfig,
);
