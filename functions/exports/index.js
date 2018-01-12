'use strict';

module.exports = (app) => {
  const glob = require('glob');
  glob.sync('./**/*.f.js', { cwd: __dirname, ignore: './node_modules/**'}).forEach(file => {

    const functionName = concoctFunctionName(file);

    if (process.env.FUNCTION_NAME === undefined || process.env.FUNCTION_NAME === functionName) exports[functionName] = require(file)(app);
  });
  return exports;
};

function concoctFunctionName(file) {
  const camel = require('camelcase');
  const split = file.split('/');
  const event = split.pop().split('.')[0];
  const snake = `${event}_${split.join('_')}`;

  return camel(snake);
}
