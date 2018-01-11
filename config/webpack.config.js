const path = require('path');
const webpackDefault = require('@ionic/app-scripts/config/webpack.config');
const webpackMerge = require('webpack-merge');

const customConfig = {
  dev: {
    resolve: {
      alias: {
        '@ashy-app': path.resolve('src/app'),
        '@ashy-components': path.resolve('src/components'),
        '@ashy-core': path.resolve('src/core'),
        '@ashy-environments': path.resolve('src/environments'),
        '@ashy-mocks': path.resolve('src/mocks'),
        '@ashy-models': path.resolve('src/models'),
        '@ashy-pages': path.resolve('src/pages'),
        '@ashy-pipes': path.resolve('src/pipes'),
        '@ashy-services': path.resolve('src/providers'),
        '@ashy-shared': path.resolve('src/shared')
      }
    }
  },
  prod: {
    resolve: {
      alias: {
        '@ashy-app': path.resolve('src/app'),
        '@ashy-components': path.resolve('src/components'),
        '@ashy-core': path.resolve('src/core'),
        '@ashy-environments': path.resolve('src/environments'),
        '@ashy-mocks': path.resolve('src/mocks'),
        '@ashy-models': path.resolve('src/models'),
        '@ashy-pages': path.resolve('src/pages'),
        '@ashy-pipes': path.resolve('src/pipes'),
        '@ashy-services': path.resolve('src/providers'),
        '@ashy-shared': path.resolve('src/shared')
      }
    }
  }
};

module.exports = webpackMerge(webpackDefault, customConfig);
