const path = require('path');
const webpackDefault = require('@ionic/app-scripts/config/webpack.config');
const webpackMerge = require('webpack-merge');

const customConfig = {
  dev: {
    resolve: {
      alias: {
        '@ashy-app': path.resolve('src/app'),
        '@ashy-core': path.resolve('src/core'),
        '@ashy-pages': path.resolve('src/pages'),
        '@ashy-components': path.resolve('src/components'),
        '@ashy-pipes': path.resolve('src/pipes'),
        '@ashy-services': path.resolve('src/providers'),
        '@ashy-shared': path.resolve('src/shared'),
        '@ashy-environments': path.resolve('src/environments'),
        '@ashy-models': path.resolve('src/models'),
        '@ashy-mocks': path.resolve('src/mocks'),
      }
    }
  },
  prod: {
    resolve: {
      alias: {
        '@ashy-app': path.resolve('src/app'),
        '@ashy-core': path.resolve('src/core'),
        '@ashy-pages': path.resolve('src/pages'),
        '@ashy-components': path.resolve('src/components'),
        '@ashy-pipes': path.resolve('src/pipes'),
        '@ashy-services': path.resolve('src/providers'),
        '@ashy-shared': path.resolve('src/shared'),
        '@ashy-environments': path.resolve('src/environments'),
        '@ashy-models': path.resolve('src/models'),
        '@ashy-mocks': path.resolve('src/mocks'),
      }
    }
  }
};

module.exports = webpackMerge(webpackDefault, customConfig);