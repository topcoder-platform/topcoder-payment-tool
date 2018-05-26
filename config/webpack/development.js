const path = require('path');
const standardConfigFactory =
  require('topcoder-react-utils/config/webpack/app-development');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');

const customDefaultConfig = require('./default');

const standardDevelopmentConfig = standardConfigFactory({
  context: path.resolve(__dirname, '../..'),
  entry: {
    main: './src/client',
  },
  publicPath: '/api/cdn/public/static-assets',
});

standardDevelopmentConfig.plugins.push(new webpack.DefinePlugin({
  PUBLIC_PATH: JSON.stringify('/api/cdn/public/static-assets'),
}));

module.exports = webpackMerge.smart(
  standardDevelopmentConfig,
  customDefaultConfig,
);
