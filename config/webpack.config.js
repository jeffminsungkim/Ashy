const chalk = require("chalk");
const fs = require('fs');
const path = require('path');
const useDefaultConfig = require('@ionic/app-scripts/config/webpack.config.js');

let env = process.env.IONIC_ENV;

useDefaultConfig.prod.resolve.alias = {
  "@ashy-app": path.resolve('src/app'),
  "@ashy-components": path.resolve('src/components'),
  "@ashy-core": path.resolve('src/core'),
  "@ashy-env": path.resolve(environmentPath('prod')),
  "@ashy-mocks": path.resolve('src/mocks'),
  "@ashy-models": path.resolve('src/models'),
  "@ashy-pages": path.resolve('src/pages'),
  "@ashy-pipes": path.resolve('src/pipes'),
  "@ashy-services": path.resolve('src/providers'),
  "@ashy-shared": path.resolve('src/shared')
};

useDefaultConfig.dev.resolve.alias = {
  "@ashy-app": path.resolve('src/app'),
  "@ashy-components": path.resolve('src/components'),
  "@ashy-core": path.resolve('src/core'),
  "@ashy-env": path.resolve(environmentPath('dev')),
  "@ashy-mocks": path.resolve('src/mocks'),
  "@ashy-models": path.resolve('src/models'),
  "@ashy-pages": path.resolve('src/pages'),
  "@ashy-pipes": path.resolve('src/pipes'),
  "@ashy-services": path.resolve('src/providers'),
  "@ashy-shared": path.resolve('src/shared')
};

if (env !== 'prod' && env !== 'dev') {
  // Default to dev config
  useDefaultConfig[env] = useDefaultConfig.dev;
  useDefaultConfig[env].resolve.alias = {
    "@ashy-env": path.resolve(environmentPath(env))
  };
}

function environmentPath(env) {
  var filePath = './src/environments/environment' + (env === 'prod' ? '' : '.' + env) + '.ts';
  if (!fs.existsSync(filePath)) {
    console.log(chalk.red('\n' + filePath + ' does not exist!'));
  } else {
    return filePath;
  }
}

module.exports = function () {
  return useDefaultConfig;
};
